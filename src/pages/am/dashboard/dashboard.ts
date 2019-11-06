import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { SuperTabsModule } from 'ionic2-super-tabs';
import { SrkuPage } from '../../srku/srku';
import { SwitchingPage } from '../../switching/switching';
import { MaintainPage } from '../../maintain/maintain';
import { NewMemberPage } from '../../new-member/new-member';
import { ShareService } from "../../../providers/ShareService";
import { SyncServices } from "../../../providers/syncServices";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../providers/constant";
import { SqlServices } from "../../../providers/sqlService";
import { amNewMemberPage } from "../am-new-member/am-new-member";
import { amMaintainPage } from "../am-maintain/am-maintain";
import { amSwitchingPage } from "../am-switching/am-switching";
import { amSrkuPage } from "../am-srku/am-srku";
import * as moment from 'moment';

declare var selectedDistrict,selectedACUid,sessionUserGlobalData;
declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;

@Component({
  selector: "page-dashboard",
  templateUrl: "dashboard.html"
})
export class AmDashboardPage {
  
  @ViewChild('acSelectId') acSelectId: any;
  @ViewChild('selectDistrictId') selectDistrictId: any;
  @ViewChild('districtMob') districtMob: any;
  @ViewChild('acSelectMob') acSelectMob: any;

  noAc: boolean = false;
  acData: any[];
  approval: string;
  limit: number;
  pages: number;
  uId: number;
  dataLen: number;
  userName: any;
  districtData: any[];
  productReceiptAllData: any[];
  display: boolean = false;
  todayActualPerc:number=0;

  // ac stats params
  acSelect: any = "all";
  acStatsData: any;
  srkuData: any = [];
  switchingData: any = [];
  maintainData: any = [];
  newMemberData: any = [];
  acUidsArr: any = [];
  prodArrObj:any = [];

  page1: any = amSrkuPage;
  page2: any = amSwitchingPage;
  page3: any = amMaintainPage;
  page4: any = amNewMemberPage;

  busy: any;
  busyMessage: any = "Please Wait...";
  selectedDistrict: any = "all";
  selectedAc: any = "all";
  globalSyncLoaderBtn: boolean = false;

  mobiScollAcSelectSettings: any = {
    inputClass: "text-input",
    theme: "material",
    showOnFocus: true,
    group: false,
    filter: true,
    filterEmptyText:filterEmptyText,
    filterPlaceholderText:filterPlaceholderText,
    placeholder: mobisPlaceHolderWaitTxtTransl,
    rows: 8,
    data: [],
    readonly: false,
    buttons: mobisBtnArr,  
    onSet: (event, inst) => {
        console.log(" onset triggerd select ac------------>"); 
        if(event.valueText){
          this.selectAc();
        }else{

        }
        
    },
    onClear: (event, inst) => {
        let tempserchKey = '';
        this.filterAcList(tempserchKey);
    },
    // onFilter: (event, inst)=> {
    //     this.filterAcList(event.filterText);
    // }
  };

  mobiScollDistrictSelectSettings: any = {
    inputClass: "text-input",
    theme: "material",
    showOnFocus: true,
    group: false,
    filter: true,
    filterEmptyText:filterEmptyText,
    filterPlaceholderText:filterPlaceholderText,
    placeholder: mobisPlaceHolderWaitTxtTransl,
    rows: 8,
    data: [],
    readonly: false,
    buttons: mobisBtnArr,
    onSet: (event, inst) => {
        //console.log(" onset triggerd ",this.sphSelect,'-------',this.sphSelectId);
        if(event.valueText){
          this.selectDistrict();
        }else{

        }
        
    },
    onClear: (event, inst) => {
      this.districtMobiFilter();
    },
    // onFilter: (event, inst)=> {
    //         this.districtMobiFilter(event.filterText);
    // }
  };

  constructor(
    private events: Events,
    private syncS: SyncServices,
    public navCtrl: NavController,
    public navParams: NavParams,
    public shareS: ShareService,
    public appCom: appCommonMethods,
    private sqlS: SqlServices
  ) {
    let masterSync = this.shareS.getshareData("masterSync");
    //console.log(" master sync status ", masterSync);
    if (masterSync) {
      this.busy = this.syncS.syncUserData().then(
        () => {
          this.busy = this.syncS.syncHomeStatsAcTlh("sph").then(
            () => {
              //console.log(" masterSync syncHomeStatsSph called ");
              this.firstFunction();
              this.shareS.setshareData("masterSync", false);
            },
            err => {
              this.shareS.setshareData("masterSync", false);
              this.firstFunction();
              console.log(" error occured masterSync user data called ", err);
            }
          );
        },
        err => {
          this.shareS.setshareData("masterSync", false);
          console.log(" error occured syncUserData user data called ", err);
        }
      );
    }
  }

  globalSync() {
    this.globalSyncLoaderBtn = true;
    this.busy = this.syncS.syncUserData().then(
    () => {
    this.busy = this.syncS.syncHomeStatsAcTlh("sph").then(
      () => {
        this.firstFunction();
        this.globalSyncLoaderBtn = false;
      },
      err => {
        this.firstFunction();
        this.globalSyncLoaderBtn = false;
      }
    );
    },
    err1 => {
      this.firstFunction();
      this.globalSyncLoaderBtn = false;
      }
    );
  }

  async ionViewDidEnter() {

    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
    this.productReceiptAllData = [];
    this.districtData = [];
    this.acData = [];

    let masterSync = this.shareS.getshareData("masterSync");
    if (!masterSync) {
      this.firstFunction();
    }
  }

  firstFunction() {

    let remainingDays = moment().daysInMonth();
    let currentDay:any = moment().format('D');
    
    console.log("reminingDays",remainingDays,"currentDay",currentDay);
    this.todayActualPerc = Math.ceil((currentDay/(remainingDays))*100);
    console.log("todayActualPerc",this.todayActualPerc);

    this.districtData = [];
    this.acData = [];
    console.log("ionViewDidEnter TlhProductReceiptsAllPage");
    this.userName = sessionUserGlobalData.user.realm;
    let uId = sessionUserGlobalData.userId;
    this.uId = parseInt(uId);
    console.log("this.uId ", this.uId);
    console.log("this.userName ", this.userName);
    this.productReceiptAllData = [];
    this.pages = 0;
    this.limit = 1;
    this.approval = "0";
    
    let getSubdistricts =
      "SELECT DISTINCT json_extract(user_data.district,'$') as district_name,json_extract(user_data.district,'$[0].id') as district_id FROM user_data, json_tree(user_data.district,'$')";
    console.log(" getdistricts ", getSubdistricts);
    this.busy = this.sqlS.selectTableQueryData(getSubdistricts, []).then(
      (ressqlData: any) => {
        if (ressqlData.rows.length > 0) {
          let tempIdData = [];
          for (let i = 0; i < ressqlData.rows.length; i++) {
            let tempData = JSON.parse(ressqlData.rows.item(i).district_name);
            if( i==0 ){
               this.districtData.push({"text":"All Districts","value":"all"});
              }  
            for (let j = 0; j < tempData.length; j++) {
              let temp: any = {};
              temp.district_name = tempData[j].name;
              temp.district_id = tempData[j].id;
              

              if (tempIdData.indexOf(tempData[j].id) == -1) {
                tempIdData.push(tempData[j].id);
                //this.districtData.push(temp);
                 this.districtData.push({"text":temp.district_name,"value":temp.district_id});
              }

              if (i == ressqlData.rows.length - 1 && j == tempData.length - 1) {
                console.log(" district data ", this.districtData);
                  this.busy = setTimeout(()=>{
                    this.selectDistrictId.valueAccessor._instance.setVal(this.selectedDistrict,true);
                    this.selectDistrict();
                  },300);
                
              }
            }  
          }
          
          console.log(" this.districtData ", this.districtData);
          this.districtMob.instance.option({
              data: this.districtData
          });
        }
      },
      err => {
        console.log("error occured", err);
      }
    );

    this.getAcData("all");
  }

  selectDistrict() {
    selectedDistrict = this.selectedDistrict;
    this.events.publish("refreshAcStats");
    this.updateAcList(selectedDistrict);
  }

  updateAcList(districtId) {

    this.acData = [];
    this.acUidsArr = [];

    let getAc;
    if(districtId == 'all'){
        getAc = "SELECT DISTINCT(uid),name FROM user_data where role = '$ac'";
    }else{
        getAc = "SELECT DISTINCT(uid),name FROM user_data, json_tree(user_data.district) where json_tree.key = 'id' and json_tree.value IN (" +districtId +") and role = '$ac'";
    }

    console.log(" getAc ", getAc);
    this.busy = this.sqlS.selectTableQueryData(getAc, []).then(
      (resData: any) => {
        //console.log(" resData ", resData);

        if (resData.rows.length > 0) {
          this.noAc = false;
          for (let i = 0; i < resData.rows.length; i++) {
              let temp:any = [];
              temp.name = resData.rows.item(i).name;
              temp.id = resData.rows.item(i).uid;
              if( i==0 ){
                this.acData.push({"text":"All AC Users","value":"all"});  
              }
              this.acData.push({"text":temp.name,"value":temp.id});
              console.log("AC data-------------------------------->",resData.rows.item(i));
            //this.acData.push(resData.rows.item(i));

            this.acUidsArr.push(resData.rows.item(i).uid);
            if (i == resData.rows.length - 1) {
              selectedACUid = this.acUidsArr.join();
              this.selectedAc = 'all';
              this.busy = setTimeout(()=>{
                  this.acSelectId.valueAccessor._instance.setVal(this.selectedAc,true);
                  this.selectAc();
              },300);
            }
          }
          this.acSelectMob.instance.option({
            data: this.acData
        });
        } else {
          //console.log(" in else check ");
          this.display = false;
          this.noAc = true;
        }
      },
      err => {
        console.log("error occured", err);
      }
    );
  }

  selectAc() {
    let ac = this.selectedAc;
    let sphIdsArr = [];
    //console.log(" ac ", ac);
    let getAcSph = "";
    /*if (ac == "all") {

      if (selectedACUid) {
        getAcSph =
        "SELECT * FROM user_data where pid IN (SELECT uid from user_data where pid IN (" +
        selectedACUid +
        "))";

      }else{
        getAcSph = "SELECT * FROM user_data where role = '$sph'";
      }
    } else {
      getAcSph =
        "SELECT * FROM user_data where pid IN (SELECT uid from user_data where pid IN (" +
        ac +
        "))";
    }*/

    console.log(" ac ",ac," selectedDistrict ",selectedDistrict);

    if (ac == "all") {
      if (selectedDistrict == "all") {
        getAcSph =
        "SELECT DISTINCT(uid),name FROM user_data where pid IN (SELECT uid from user_data where pid IN (" +selectedACUid +")) and role = '$sph'";      
      }else{
        getAcSph = "SELECT DISTINCT(uid),name FROM user_data, json_tree(user_data.district) where json_tree.key = 'id' and json_tree.value IN ("+selectedDistrict+") and role = '$sph'";
      }
    } else {
      getAcSph =
      "SELECT DISTINCT(uid),name FROM user_data, json_tree(user_data.district) where pid IN (SELECT uid from user_data where pid IN (" +ac +")) and role = '$sph'";
    }

    console.log(" getAcSph ", getAcSph);
    this.busy = this.sqlS.selectTableQueryData(getAcSph, []).then(
      (resData: any) => {
        console.log(" resData ", resData, resData.rows.length);

        if (resData.rows.length > 0) {
          for (let i = 0; i < resData.rows.length; i++) {
            sphIdsArr.push(resData.rows.item(i).uid);
            //console.log("resData.rows.item(i).uid",resData.rows.item(i).uid,sphIdsArr);

            if (i == resData.rows.length - 1) {
              //console.log(" data inside sphIdsArr", sphIdsArr);
              let sphIds = sphIdsArr.join();
              this.getAcData(sphIds);
            }
          }
        } else {
          this.display = false;
          console.log(" in else data ");
        }
      },
      err => {
        console.log("error occured", err);
      }
    );
  }

  getAcData(id) {
    let currDate = moment().format("YYYY-MM-DD").toString();
    this.prodArrObj = [];
    let index = 0;
    let allQuery;
    if (id == "all") {
      allQuery =
        "select sum(monthly_target) as monthly_target,sum(achieved_target) as achieved_target,sum(target_remaining) as target_remaining,sum(estimated_target) as estimated_target,sum(todays_achievement) as todays_achievement,sum(todays_target) as todays_target,target_for from home_stats_ac_tlh where date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('" +
        currDate +
        "') group by target_for";
    } else {
      allQuery =
        "select sum(monthly_target) as monthly_target,sum(achieved_target) as achieved_target,sum(target_remaining) as target_remaining,sum(estimated_target) as estimated_target,sum(todays_achievement) as todays_achievement,sum(todays_target) as todays_target,target_for from home_stats_ac_tlh where date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('" +
        currDate +
        "') and sphid IN (" +
        id +
        ") group by target_for";
    }
    console.log(" getAcData query --", allQuery);
    this.busy = this.sqlS
      .selectTableQueryData(allQuery, [])
      .then((allresData: any) => {
        for (let i = 0; i < allresData.rows.length; i++) {
          //console.log("ressqlData", allresData.rows.item(i));
          let temp: any = [];
          temp.target_for = (!(allresData.rows.item(i).target_for))?0:((allresData.rows.item(i).target_for).charAt(0).toUpperCase()+(allresData.rows.item(i).target_for).slice(1)).replace(/_/g, ' ');
          temp.achieved_target = Math.round(allresData.rows.item(i).achieved_target * 100)/100;
          temp.estimated_target = Math.round(allresData.rows.item(i).estimated_target * 100)/100;
          temp.monthly_target = Math.round(allresData.rows.item(i).monthly_target * 100)/100;
          temp.target_remaining = Math.round(allresData.rows.item(i).target_remaining * 100)/100;
          temp.todays_achievement = Math.round(allresData.rows.item(i).todays_achievement * 100)/100;
          temp.todays_target = Math.round(allresData.rows.item(i).todays_target * 100)/100;

          if (allresData.rows.item(i).target_for == "srku_vol") {
            this.srkuData = temp;
            this.srkuData.monthlyPercentage = Math.ceil(
              temp.achieved_target / temp.monthly_target * 100
            );
            this.srkuData.todaysPercentage = Math.ceil(
              temp.todays_achievement / temp.todays_target * 100
            );
            if (this.srkuData.monthlyPercentage > 999) {
              this.srkuData.monthlyPercentage = 999;
            }
            if (isFinite(this.srkuData.monthlyPercentage) == false) {
              this.srkuData.monthlyPercentage = 0;
            } else if (this.srkuData.monthlyPercentage < 0) {
              this.srkuData.monthlyPercentage = 0;
            }

            if (this.srkuData.todaysPercentage > 999) {
              this.srkuData.todaysPercentage = 999;
            }
            if (isFinite(this.srkuData.todaysPercentage) == false) {
              this.srkuData.todaysPercentage = 0;
            } else if (this.srkuData.todaysPercentage < 0) {
              this.srkuData.todaysPercentage = 0;
            }
            this.display = true;
          } else if (
            allresData.rows.item(i).target_for == "cement_vol_switching"
          ) {
            this.switchingData = temp;
            this.switchingData.monthlyPercentage = Math.ceil(
              temp.achieved_target / temp.monthly_target * 100
            );
            this.switchingData.todaysPercentage = Math.ceil(
              temp.todays_achievement / temp.todays_target * 100
            );
            if (this.switchingData.monthlyPercentage > 999) {
              this.switchingData.monthlyPercentage = 999;
            }
            if (isFinite(this.switchingData.monthlyPercentage) == false) {
              this.switchingData.monthlyPercentage = 0;
            } else if (this.switchingData.monthlyPercentage < 0) {
              this.switchingData.monthlyPercentage = 0;
            }

            if (this.switchingData.todaysPercentage > 999) {
              this.switchingData.todaysPercentage = 999;
            }
            if (isFinite(this.switchingData.todaysPercentage) == false) {
              this.switchingData.todaysPercentage = 0;
            } else if (this.switchingData.todaysPercentage < 0) {
              this.switchingData.todaysPercentage = 0;
            }
            this.display = true;
          } else if (
            allresData.rows.item(i).target_for == "cement_vol_maintain"
          ) {
            this.maintainData = temp;
            this.maintainData.monthlyPercentage = Math.ceil(
              temp.achieved_target / temp.monthly_target * 100
            );
            this.maintainData.todaysPercentage = Math.ceil(
              temp.todays_achievement / temp.todays_target * 100
            );
            if (this.maintainData.monthlyPercentage > 999) {
              this.maintainData.monthlyPercentage = 999;
            }
            if (isFinite(this.maintainData.monthlyPercentage) == false) {
              this.maintainData.monthlyPercentage = 0;
            } else if (this.maintainData.monthlyPercentage < 0) {
              this.maintainData.monthlyPercentage = 0;
            }

            if (this.maintainData.todaysPercentage > 999) {
              this.maintainData.todaysPercentage = 999;
            }
            if (isFinite(this.maintainData.todaysPercentage) == false) {
              this.maintainData.todaysPercentage = 0;
            } else if (this.maintainData.todaysPercentage < 0) {
              this.maintainData.todaysPercentage = 0;
            }
            this.display = true;
          } else if (
            allresData.rows.item(i).target_for == "new_switching_hpb"
          ) {
            this.newMemberData = temp;
            this.newMemberData.monthlyPercentage = Math.ceil(
              temp.achieved_target / temp.monthly_target * 100
            );
            this.newMemberData.todaysPercentage = Math.ceil(
              temp.todays_achievement / temp.todays_target * 100
            );
            if (this.newMemberData.monthlyPercentage > 999) {
              this.newMemberData.monthlyPercentage = 999;
            }
            if (isFinite(this.newMemberData.monthlyPercentage) == false) {
              this.newMemberData.monthlyPercentage = 0;
            } else if (this.newMemberData.monthlyPercentage < 0) {
              this.newMemberData.monthlyPercentage = 0;
            }

            if (this.newMemberData.todaysPercentage > 999) {
              this.newMemberData.todaysPercentage = 999;
            }
            if (isFinite(this.newMemberData.todaysPercentage) == false) {
              this.newMemberData.todaysPercentage = 0;
            } else if (this.newMemberData.todaysPercentage < 0) {
              this.newMemberData.todaysPercentage = 0;
            }
            this.display = true;
          }else if(allresData.rows.item(i).target_for != 'srku_house_num'){
            this.prodArrObj[index] = {};
            this.prodArrObj[index]['target_for'] = temp.target_for
            this.prodArrObj[index]['productsTodayTarget'] = temp.todays_target;
            this.prodArrObj[index]['productsTodayAchievementTarget'] = temp.todays_achievement;
            this.prodArrObj[index]['productsMonthlyTarget'] = temp.monthly_target;
            this.prodArrObj[index]['achieved_target'] = temp.achieved_target;
            this.prodArrObj[index]['estimatedTarget'] = temp.estimated_target;
          
            if(this.prodArrObj[index]['achieved_target'] != null && this.prodArrObj[index]['productsMonthlyTarget'] != null){
              this.prodArrObj[index]['productsMonthlyTargetAchievPerc'] = Math.ceil(( this.prodArrObj[index]['achieved_target']/this.prodArrObj[index]['productsMonthlyTarget'] ) * 100);
              if(isFinite(this.prodArrObj[index]['productsMonthlyTargetAchievPerc']) == false){
                this.prodArrObj[index]['productsMonthlyTargetAchievPerc'] = 0;
              }
              if(this.prodArrObj[index]['productsMonthlyTargetAchievPerc'] > 999){
                this.prodArrObj[index]['productsMonthlyTargetAchievPerc'] = 999;
              }else if(this.prodArrObj[index]['productsMonthlyTargetAchievPerc'] < 0){
                this.prodArrObj[index]['productsMonthlyTargetAchievPerc'] = 0;
              }
            }
  
            let remainingDays = moment().daysInMonth();
            let currentDay:any = moment().format('D');
  
            console.log("reminingDays",remainingDays,"currentDay",currentDay);
            this.prodArrObj[index]['todayActualPerc'] = Math.ceil((currentDay/(remainingDays))*100);
            console.log("todayActualPerc",this.prodArrObj[index]['todayActualPerc']);
  
            if(this.prodArrObj[index]['productsTodayAchievementTarget'] != null && this.prodArrObj[index]['productsTodayTarget'] != null){
              this.prodArrObj[index]['productsTodayTargetAchievPerc'] = Math.ceil(( this.prodArrObj[index]['productsTodayAchievementTarget']/this.prodArrObj[index]['productsTodayTarget'] ) * 100);
              if(this.prodArrObj[index]['productsTodayTargetAchievPerc'] > 999){
                  this.prodArrObj[index]['productsTodayTargetAchievPerc'] = 999;
              }
              if(isFinite(this.prodArrObj[index]['productsTodayTargetAchievPerc']) == false){
                  this.prodArrObj[index]['productsTodayTargetAchievPerc'] = 0;
              }else if(this.prodArrObj[index]['productsTodayTargetAchievPerc'] < 0){
                  this.prodArrObj[index]['productsTodayTargetAchievPerc'] = 0;
              }
            }
            console.log("this.prodArrObj=>",this.prodArrObj);

            index++;
        }
        }
      });
  }

  districtMobiFilter(serchKey?:any){
    
    this.districtData=[];   
		let query="SELECT DISTINCT json_extract(user_data.district,'$') as district_name,json_extract(user_data.district,'$[0].id') as district_id FROM user_data, json_tree(user_data.district,'$')"; //LIMIT 100
         if(serchKey){
            query="SELECT DISTINCT json_extract(user_data.district,'$') as district_name,json_extract(user_data.district,'$[0].id') as district_id FROM user_data, json_tree(user_data.district,'$') where district_name LIKE '%"+serchKey+"%'  " ;
          }

        this.busy = this.sqlS.selectTableQueryData(query, []).then(
          (ressqlData: any) => {
            if (ressqlData.rows.length > 0) {
              let tempIdData = [];
              for (let i = 0; i < ressqlData.rows.length; i++) {
                let tempData = JSON.parse(ressqlData.rows.item(i).district_name);
                if( i==0 && (serchKey=="a" || serchKey=="l" || serchKey=="all" || serchKey=="al" || serchKey=="" ) ){
                  this.districtData.push({"text":"All","value":"all"});
                  }  
                for (let j = 0; j < tempData.length; j++) {
                  let temp: any = {};
                  temp.district_name = tempData[j].name;
                  temp.district_id = tempData[j].id;
                  

                  if (tempIdData.indexOf(tempData[j].id) == -1) {
                    tempIdData.push(tempData[j].id);
                    //this.districtData.push(temp);
                    this.districtData.push({"text":temp.district_name,"value":temp.district_id});
                  }

                  if (i == ressqlData.rows.length - 1 && j == tempData.length - 1) {
                    console.log(" district data ", this.districtData);
                      setTimeout(()=>{
                      this.selectDistrictId.valueAccessor._instance.setVal(this.selectedDistrict,true);
                      this.selectDistrict();
                      },300);
                    
                  }
                }  
              }
              
              console.log(" this.districtData ", this.districtData);
              this.districtMob.instance.option({
                  data: this.districtData
              });
            }
          },
          err => {
            console.log("error occured", err);
          }
        );
 }

    filterAcList(serchKey?:any) {

    this.acData = [];
    this.acUidsArr = [];

    let getAc;
    if(this.selectedDistrict == 'all'){
        getAc = "SELECT DISTINCT(uid),name FROM user_data where role = '$ac'";
    }else{
        getAc = "SELECT DISTINCT(uid),name FROM user_data, json_tree(user_data.district) where json_tree.key = 'id' and json_tree.value IN (" +this.selectedDistrict +") and role = '$ac'";
    }

    if(serchKey){
            
            if(this.selectedDistrict == 'all'){
                getAc = "SELECT DISTINCT(uid),name FROM user_data where role = '$ac' and name LIKE '%"+serchKey+"%' ";
            }else{
                getAc = "SELECT DISTINCT(uid),name FROM user_data, json_tree(user_data.district) where json_tree.key = 'id' and json_tree.value IN (" +this.selectedDistrict +") and role = '$ac' and name LIKE '%"+serchKey+"%' ";
            } 

    }

    //console.log(" getAc ", getAc);
    this.busy = this.sqlS.selectTableQueryData(getAc, []).then(
      (resData: any) => {
        //console.log(" resData ", resData);

        if (resData.rows.length > 0) {
          this.noAc = false;
          for (let i = 0; i < resData.rows.length; i++) {
              let temp:any = [];
              temp.name = resData.rows.item(i).name;
              temp.id = resData.rows.item(i).uid;
              console.log(" serchKey ",serchKey);
              if( i==0 && (serchKey=="a" || serchKey=="l" || serchKey=="all" || serchKey=="al" || serchKey=="" ) ){
                this.acData.push({"text":"All AC Users","value":"all"});  
              }
              this.acData.push({"text":temp.name,"value":temp.id});
              console.log("AC data-------------------------------->",resData.rows.item(i));
            //this.acData.push(resData.rows.item(i));

            this.acUidsArr.push(resData.rows.item(i).uid);
            if (i == resData.rows.length - 1) {
              selectedACUid = this.acUidsArr.join();
              this.selectedAc = 'all';
              setTimeout(()=>{
                  this.acSelectId.valueAccessor._instance.setVal(this.selectedAc,true);
                  this.selectAc();
              },300);
            }
          }
          this.acSelectMob.instance.option({
              data: this.acData
          });
        } else {
          //console.log(" in else check ");
          this.display = false;
          this.noAc = true;
        }
      },
      err => {
        console.log("error occured", err);
      }
    );
  }



}
