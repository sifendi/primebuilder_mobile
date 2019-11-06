import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";

import * as moment from 'moment';


@Component({
  selector: 'page-am-achievements-tlh',
  templateUrl: 'am-achievements-tlh.html',
})
export class AmAchievementsTlhPage {

  @ViewChild('tlhSelectId') tlhSelectId: any;//tlhSelectmobi
  @ViewChild('tlhSelectmobi') tlhSelectmobi: any;

  tlhData:any = [];
  tlhSelect:any = 'all';
  tlhStatsData:any;
  srkuData:any = [];
  switchingData:any = [];
  maintainData:any = [];
  newMemberData:any = [];
  prodArrObj:any = [];
  display:boolean = false;
  busy:any;
  busyMessage:any="Please Wait...";
  todayActualPerc:number=0;

    mobiScollReferCustSettings: any = {
    inputClass: "text-input",
    theme: "material",
    showOnFocus: true,
    group: false,
    filter: true,
    placeholder: "Please select",
    rows: 8,
    data: [],
    readonly: false,
    buttons: ["set", "clear", "cancel"],
    onSet: (event, inst) => {
        //console.log(" onset triggerd ",this.sphSelect,'-------',this.sphSelectId);
        if(event.valueText){
            this.tlhSelectData();
        }else{

        }
       
    },
    onClear: (event, inst) => {
        this.filtertlhMobi();
    }
    // },onFilter: (event, inst)=> {
    //     this.filtertlhMobi(event.filterText);
    // }
  };

  constructor(private sqlS:SqlServices,public appCom:appCommonMethods,public navCtrl: NavController, public navParams: NavParams) {
  }

  async ionViewDidEnter() {
      this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
      this.tlhData = [];
      this.srkuData = [];
      this.tlhSelect = 'all';
      this.switchingData = [];
      this.maintainData = [];
      this.newMemberData = [];
      this.prodArrObj = [];
      let index = 0;

      let remainingDays = moment().daysInMonth();
      let currentDay:any = moment().format('D');
      
      console.log("reminingDays",remainingDays,"currentDay",currentDay);
      this.todayActualPerc = Math.ceil((currentDay/(remainingDays))*100);
      console.log("todayActualPerc",this.todayActualPerc);

      this.appCom.getAppPreference("userCreds").then((resDataU)=>{
          console.log(" user data ",resDataU);
      })
      let currDate = moment().format("YYYY-MM-DD").toString(); 

      let queryHomeStats = "select * from user_data where role = '$tlh'";
      console.log(" home_stats srku --",queryHomeStats);
       this.busy= this.sqlS.selectTableQueryData(queryHomeStats,[]).then((ressqlData:any)=>{
          
          for(let i=0;i<ressqlData.rows.length;i++){
              console.log(" tlh data ",ressqlData.rows.item(i));
              let temp:any = [];
              temp.name = ressqlData.rows.item(i).name;
              temp.id = ressqlData.rows.item(i).uid;
              if( i==0 ){
              this.tlhData.push({"text":"All","value":"all"});  
              }
              this.tlhData.push({"text":temp.name,"value":temp.id});
              //this.tlhData.push(temp);
          }
          
            if( this.tlhData && (this.tlhSelect == undefined || this.tlhSelect == "all" ) ){
             if( this.tlhData[0] ){
                    setTimeout(()=>{
                        this.tlhSelect=this.tlhData[0]['value'];
                        this.tlhSelectId.valueAccessor._instance.setVal(this.tlhSelect,true);                   
                    },300)
                   
             }
          }

      })

        let allQuery = "select sum(monthly_target) as monthly_target,sum(achieved_target) as achieved_target,sum(target_remaining) as target_remaining,sum(estimated_target) as estimated_target,sum(todays_achievement) as todays_achievement,sum(todays_target) as todays_target,target_for from home_stats_ac_tlh where date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') group by target_for";
        console.log(" allQuery --",allQuery);
         this.busy= this.sqlS.selectTableQueryData(allQuery,[]).then((allresData:any)=>{
            
              for(let i=0;i<allresData.rows.length;i++){
                console.log("ressqlData",allresData.rows.item(i));
                let temp:any = [];
                temp.target_for = (!(allresData.rows.item(i).target_for))?0:((allresData.rows.item(i).target_for).charAt(0).toUpperCase()+(allresData.rows.item(i).target_for).slice(1)).replace(/_/g, ' ');
                temp.achieved_target = Math.round(allresData.rows.item(i).achieved_target * 100)/100;
                temp.estimated_target = Math.round(allresData.rows.item(i).estimated_target * 100)/100;
                temp.monthly_target = Math.round(allresData.rows.item(i).monthly_target * 100)/100;
                temp.target_remaining = Math.round(allresData.rows.item(i).target_remaining * 100)/100;
                temp.todays_achievement = Math.round(allresData.rows.item(i).todays_achievement * 100)/100;
                temp.todays_target = Math.round(allresData.rows.item(i).todays_target * 100)/100;
      
                if(allresData.rows.item(i).target_for == 'srku_vol'){
                    this.srkuData = temp;
                    this.srkuData.monthlyPercentage = Math.ceil((( temp.achieved_target/temp.monthly_target ) * 100));
                    this.srkuData.todaysPercentage = Math.ceil((( temp.todays_achievement/temp.todays_target ) * 100));
                    if(this.srkuData.monthlyPercentage > 999){
                        this.srkuData.monthlyPercentage = 999;
                    }
                    if(isFinite(this.srkuData.monthlyPercentage) == false){
                        this.srkuData.monthlyPercentage = 0;
                    }else if(this.srkuData.monthlyPercentage < 0){
                        this.srkuData.monthlyPercentage = 0;
                    }

                    if(this.srkuData.todaysPercentage > 999){
                        this.srkuData.todaysPercentage = 999;
                    }
                    if(isFinite(this.srkuData.todaysPercentage) == false){
                        this.srkuData.todaysPercentage = 0;
                    }else if(this.srkuData.todaysPercentage < 0){
                        this.srkuData.todaysPercentage = 0;
                    }
                    this.display = true;
                }else if(allresData.rows.item(i).target_for == 'cement_vol_switching'){
                    this.switchingData = temp;
                    this.switchingData.monthlyPercentage = Math.ceil((( temp.achieved_target/temp.monthly_target ) * 100));
                    this.switchingData.todaysPercentage = Math.ceil((( temp.todays_achievement/temp.todays_target ) * 100));
                    if(this.switchingData.monthlyPercentage > 999){
                        this.switchingData.monthlyPercentage = 999;
                    }
                    if(isFinite(this.switchingData.monthlyPercentage) == false){
                        this.switchingData.monthlyPercentage = 0;
                    }else if(this.switchingData.monthlyPercentage < 0){
                        this.switchingData.monthlyPercentage = 0;
                    }

                    if(this.switchingData.todaysPercentage > 999){
                        this.switchingData.todaysPercentage = 999;
                    }
                    if(isFinite(this.switchingData.todaysPercentage) == false){
                        this.switchingData.todaysPercentage = 0;
                    }else if(this.switchingData.todaysPercentage < 0){
                        this.switchingData.todaysPercentage = 0;
                    }
                    this.display = true;
                }else if(allresData.rows.item(i).target_for == 'cement_vol_maintain'){
                    this.maintainData = temp;
                    this.maintainData.monthlyPercentage = Math.ceil((( temp.achieved_target/temp.monthly_target ) * 100));
                    this.maintainData.todaysPercentage = Math.ceil((( temp.todays_achievement/temp.todays_target ) * 100));
                    if(this.maintainData.monthlyPercentage > 999){
                        this.maintainData.monthlyPercentage = 999;
                    }
                    if(isFinite(this.maintainData.monthlyPercentage) == false){
                        this.maintainData.monthlyPercentage = 0;
                    }else if(this.maintainData.monthlyPercentage < 0){
                        this.maintainData.monthlyPercentage = 0;
                    }

                    if(this.maintainData.todaysPercentage > 999){
                        this.maintainData.todaysPercentage = 999;
                    }
                    if(isFinite(this.maintainData.todaysPercentage) == false){
                        this.maintainData.todaysPercentage = 0;
                    }else if(this.maintainData.todaysPercentage < 0){
                        this.maintainData.todaysPercentage = 0;
                    }
                    this.display = true;
                }else if(allresData.rows.item(i).target_for == 'new_switching_hpb'){
                    this.newMemberData = temp;                  
                    this.newMemberData.monthlyPercentage = Math.ceil((( temp.achieved_target/temp.monthly_target ) * 100));
                    this.newMemberData.todaysPercentage = Math.ceil((( temp.todays_achievement/temp.todays_target ) * 100));
                    if(this.newMemberData.monthlyPercentage > 999){
                        this.newMemberData.monthlyPercentage = 999;
                    }
                    if(isFinite(this.newMemberData.monthlyPercentage) == false){
                        this.newMemberData.monthlyPercentage = 0;
                    }else if(this.newMemberData.monthlyPercentage < 0){
                        this.newMemberData.monthlyPercentage = 0;
                    }

                    if(this.newMemberData.todaysPercentage > 999){
                        this.newMemberData.todaysPercentage = 999;
                    }
                    if(isFinite(this.newMemberData.todaysPercentage) == false){
                        this.newMemberData.todaysPercentage = 0;
                    }else if(this.newMemberData.todaysPercentage < 0){
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

        })

  }

  tlhSelectData(){
      let currDate = moment().format("YYYY-MM-DD").toString(); 

    if(this.tlhSelect != 'all'){
        let queryHomeStats = "select distinct('hsat.sphid') as sphid,hsat.*,ud.* from home_stats_ac_tlh as hsat JOIN user_data as ud on ud.uid = hsat.sphid where date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and ud.pid IN ('"+this.tlhSelect+"') GROUP BY sphid";
        console.log(" home_stats srku --",queryHomeStats);
        this.sqlS.selectTableQueryData(queryHomeStats,[]).then((ressqlData:any)=>{
            
            let allSphId = [];
            for(let i=0;i<ressqlData.rows.length;i++){
                console.log(" sph data ",ressqlData.rows.item(i));
                let temp:any = [];
                temp.name = ressqlData.rows.item(i).name;
                temp.id = ressqlData.rows.item(i).sphid;
                allSphId.push(ressqlData.rows.item(i).sphid);
                if(i == ressqlData.rows.length-1){
                    let sphIds = allSphId.join();
                    this.getSphStats(sphIds);
                }
            }

        })

    }else{
        let queryHomeStatsAll = "select * from user_data where role = '$sph'";
        console.log(" home_stats srku queryHomeStatsAll --",queryHomeStatsAll);
        this.sqlS.selectTableQueryData(queryHomeStatsAll,[]).then((ressqlData:any)=>{
            
            let allSphId = [];
            for(let i=0;i<ressqlData.rows.length;i++){
                console.log(" sph data ",ressqlData.rows.item(i));
                allSphId.push(ressqlData.rows.item(i).uid);
                if(i == ressqlData.rows.length-1){
                    let sphIds = allSphId.join();
                    this.getSphStats(sphIds);
                }
            }
        })
    }

  }

    getSphStats(sphIds){
        let temp:any = [];
        this.prodArrObj = [];
        let index = 0;
        let currDate = moment().format("YYYY-MM-DD").toString(); 
        let sphIdsV:any;
        sphIdsV = sphIds.split(',');
        console.log(" sphIdsV ",sphIdsV);
        sphIds = sphIdsV.join("','");
        console.log(" sphIdsV ",sphIdsV,sphIds);
        let queryHomeStats = "select sum(monthly_target) as monthly_target,sum(achieved_target) as achieved_target,sum(target_remaining) as target_remaining,sum(estimated_target) as estimated_target,sum(todays_achievement) as todays_achievement,sum(todays_target) as todays_target,target_for from home_stats_ac_tlh where sphid IN ('"+sphIds+"') and date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') group by target_for";
        console.log(" get sph stats --",queryHomeStats);
         this.busy= this.sqlS.selectTableQueryData(queryHomeStats,[]).then((ressqlData:any)=>{
            
            for(let i=0;i<ressqlData.rows.length;i++){
                console.log("ressqlData",ressqlData.rows.item(i));
                temp = [];
                temp.target_for = (!(ressqlData.rows.item(i).target_for))?0:((ressqlData.rows.item(i).target_for).charAt(0).toUpperCase()+(ressqlData.rows.item(i).target_for).slice(1)).replace(/_/g, ' ');
                temp.achieved_target = ressqlData.rows.item(i).achieved_target;
                temp.estimated_target = ressqlData.rows.item(i).estimated_target;
                temp.monthly_target = ressqlData.rows.item(i).monthly_target;
                temp.target_remaining = ressqlData.rows.item(i).target_remaining;
                temp.todays_achievement = ressqlData.rows.item(i).todays_achievement;
                temp.todays_target = ressqlData.rows.item(i).todays_target;

                console.log("ressqlData stats",temp.achieved_target,'-1-',temp.estimated_target,'-2-',temp.monthly_target,'-3-',temp.target_remaining,'-4-',temp.todays_achievement,'-5-',temp.todays_target);
                
                if(ressqlData.rows.item(i).target_for == 'srku_vol'){
                    this.srkuData = temp;
                    this.srkuData.monthlyPercentage = Math.ceil((( temp.achieved_target/temp.monthly_target ) * 100));
                    this.srkuData.todaysPercentage = Math.ceil((( temp.todays_achievement/temp.todays_target ) * 100));
                    if(this.srkuData.monthlyPercentage > 999){
                        this.srkuData.monthlyPercentage = 999;
                    }
                    if(isFinite(this.srkuData.monthlyPercentage) == false){
                        this.srkuData.monthlyPercentage = 0;
                    }else if(this.srkuData.monthlyPercentage < 0){
                        this.srkuData.monthlyPercentage = 0;
                    }

                    if(this.srkuData.todaysPercentage > 999){
                        this.srkuData.todaysPercentage = 999;
                    }
                    if(isFinite(this.srkuData.todaysPercentage) == false){
                        this.srkuData.todaysPercentage = 0;
                    }else if(this.srkuData.todaysPercentage < 0){
                        this.srkuData.todaysPercentage = 0;
                    }
                    this.display = true;
                }else if(ressqlData.rows.item(i).target_for == 'cement_vol_switching'){
                    this.switchingData = temp;
                    this.switchingData.monthlyPercentage = Math.ceil((( temp.achieved_target/temp.monthly_target ) * 100));
                    this.switchingData.todaysPercentage = Math.ceil((( temp.todays_achievement/temp.todays_target ) * 100));
                    if(this.switchingData.monthlyPercentage > 999){
                        this.switchingData.monthlyPercentage = 999;
                    }
                    if(isFinite(this.switchingData.monthlyPercentage) == false){
                        this.switchingData.monthlyPercentage = 0;
                    }else if(this.switchingData.monthlyPercentage < 0){
                        this.switchingData.monthlyPercentage = 0;
                    }

                    if(this.switchingData.todaysPercentage > 999){
                        this.switchingData.todaysPercentage = 999;
                    }
                    if(isFinite(this.switchingData.todaysPercentage) == false){
                        this.switchingData.todaysPercentage = 0;
                    }else if(this.switchingData.todaysPercentage < 0){
                        this.switchingData.todaysPercentage = 0;
                    }
                    this.display = true;
                }else if(ressqlData.rows.item(i).target_for == 'cement_vol_maintain'){
                    this.maintainData = temp;
                    this.maintainData.monthlyPercentage = Math.ceil((( temp.achieved_target/temp.monthly_target ) * 100));
                    this.maintainData.todaysPercentage = Math.ceil((( temp.todays_achievement/temp.todays_target ) * 100));
                    if(this.maintainData.monthlyPercentage > 999){
                        this.maintainData.monthlyPercentage = 999;
                    }
                    if(isFinite(this.maintainData.monthlyPercentage) == false){
                        this.maintainData.monthlyPercentage = 0;
                    }else if(this.maintainData.monthlyPercentage < 0){
                        this.maintainData.monthlyPercentage = 0;
                    }

                    if(this.maintainData.todaysPercentage > 999){
                        this.maintainData.todaysPercentage = 999;
                    }
                    if(isFinite(this.maintainData.todaysPercentage) == false){
                        this.maintainData.todaysPercentage = 0;
                    }else if(this.maintainData.todaysPercentage < 0){
                        this.maintainData.todaysPercentage = 0;
                    }
                    this.display = true;
                }else if(ressqlData.rows.item(i).target_for == 'new_switching_hpb'){
                    this.newMemberData = temp;                  
                    this.newMemberData.monthlyPercentage = Math.ceil((( temp.achieved_target/temp.monthly_target ) * 100));
                    this.newMemberData.todaysPercentage = Math.ceil((( temp.todays_achievement/temp.todays_target ) * 100));
                    if(this.newMemberData.monthlyPercentage > 999){
                        this.newMemberData.monthlyPercentage = 999;
                    }
                    if(isFinite(this.newMemberData.monthlyPercentage) == false){
                        this.newMemberData.monthlyPercentage = 0;
                    }else if(this.newMemberData.monthlyPercentage < 0){
                        this.newMemberData.monthlyPercentage = 0;
                    }

                    if(this.newMemberData.todaysPercentage > 999){
                        this.newMemberData.todaysPercentage = 999;
                    }
                    if(isFinite(this.newMemberData.todaysPercentage) == false){
                        this.newMemberData.todaysPercentage = 0;
                    }else if(this.newMemberData.todaysPercentage < 0){
                        this.newMemberData.todaysPercentage = 0;
                    }
                    this.display = true;
                }else if(ressqlData.rows.item(i).target_for != 'srku_house_num'){
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
            //this.sphStatsData = ressqlData.rows.item(0);
        })
    }


    mobiScollCitySettings:any = {
        inputClass: 'text-input',
        theme: 'material',
        showOnFocus: true,
        group: false,
        filter: true,
        placeholder: 'Please select',
        rows:8,
        data:[],
        readonly:false,
        buttons:['set','clear','cancel']
    };


    filtertlhMobi(serchKey?:any){
      this.tlhData=[];
      let currDate = moment().format("YYYY-MM-DD").toString(); 
      let queryHomeStats = "select * from user_data where role = '$tlh'";
        if(serchKey ){
           queryHomeStats="select * from user_data where role = '$tlh' and name  LIKE '%"+serchKey+"%' " ;
        }
      
      console.log(" home_stats srku --",queryHomeStats);
       this.busy= this.sqlS.selectTableQueryData(queryHomeStats,[]).then((ressqlData:any)=>{
          
          for(let i=0;i<ressqlData.rows.length;i++){
              console.log(" tlh data ",ressqlData.rows.item(i));
              let temp:any = [];
              temp.name = ressqlData.rows.item(i).name;
              temp.id = ressqlData.rows.item(i).uid;
              if( i==0 && (serchKey=="a" || serchKey=="l" || serchKey=="all" || serchKey=="al" || serchKey=="" ) ){
              this.tlhData.push({"text":"All","value":"all"});  
              }
              this.tlhData.push({"text":temp.name,"value":temp.id});
              //this.tlhData.push(temp);
          }	  
          this.tlhSelectmobi.instance.option({
            data: this.tlhData
        });
         

    });

}

}
