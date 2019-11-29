import { AddProjectPage } from '../project/add-project/add-project';
import { Component } from '@angular/core';
import { MenuController, NavController, Events } from 'ionic-angular';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { SrkuPage } from '../srku/srku';
import { SwitchingPage } from '../switching/switching';
import { MaintainPage } from '../maintain/maintain';
import { NewMemberPage } from '../new-member/new-member';
import { ProductStatsPage } from '../product-stats/product-stats';


import { VisitMasonListPage } from '../visit-pages/visit-mason-list-page/visit-mason-list-page';
import { VisitContractorListPage } from '../visit-pages/visit-contractor-list-page/visit-contractor-list-page';
import { DistributorListVisitPage } from '../visit-pages/visit-distributor-list-page/visit-distributor-list-page';
import { RetailerListVisitPage } from '../visit-pages/visit-retailer-list-page/visit-retailer-list-page';
import { NotificationsTabPage } from '../../pages/notification/notifications-tab/notifications-tab';


import { addHpbFormPage } from "../hpb-pages/hpb-add-form/hpb-add-form";
import { VisitParentTabsPage } from "../visit-pages/visit-parent-tab-page/visit-parent-tab-page";
import { ALL_MESSAGE } from '../../providers/constant';
import { SqlServices } from '../../providers/sqlService';
import { SyncServices } from '../../providers/syncServices';
import { ShareService } from "../../providers/ShareService";
import {  App_hpbApi }  from '../../shared/loopback_sdk';

import { appCommonMethods } from '../../providers/appCommonMethods';

import * as moment from 'moment';
import async from 'async';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  page1: any = SrkuPage;
  page2: any = SwitchingPage;
  page3: any = MaintainPage;
  page4: any = NewMemberPage;
  page5: any = ProductStatsPage;
  page6: any = SrkuPage;
  pageML:any = VisitMasonListPage;
  pageCL:any = VisitContractorListPage;
  pageDL:any = DistributorListVisitPage;
  pageRL:any = RetailerListVisitPage;
  notificationCtn=0;
  busy: any;
  busyMessage:any;
  busyMason: any;
  busyMasonMessage:any;
  busyContractor: any;
  busyContractorMessage:any;
  busyDistributor: any;
  busyDistributorMessage:any;
  busyRetailer: any;
  busyRetailerMessage:any;
  massonTodayVisitTotal=0;
  contractorTodayVisitTotal=0;
  distTodayVisitTotal=0;
  retailerTodayVisitTotal=0;
  massonCurrTodayVisitTotal=0;
  contractorCurrTodayVisitTotal=0;
  distTodayCurrVisitTotal=0;
  retailerCurrTodayVisitTotal=0;
  allDataHome=[];
  allCheckInOutDatas=[];
  currentUserData={};
   globalSyncLoaderBtn:boolean=false;
   globalSyncUpdatedDate:any="";
  checkHpb:any = [];
  retId:any = [];
  distId:any = [];
  allDataMasonTodayList:any = [];
  totalTon:number = 0;
  visitTotal:number = 0;
  try:any = 0;
  visitTodayTotal:any = 0;
  constructor(public events:Events,private appCom:appCommonMethods, private syncS:SyncServices,private shareS:ShareService,private sqlS:SqlServices,private app_hpbApi:App_hpbApi,public navCtrl: NavController,public menu: MenuController) {

    this.currentUserData=this.shareS.getshareData('currSessionUserData');

        this.events.subscribe('globalSync',()=>{
            console.log("home ts");
            this.globalSync();
        });

      let masterSync =  this.shareS.getshareData('masterSync');
      if(masterSync){
          //this.busyMessage="Syncing...";
          this.globalSyncLoaderBtn=true;
          this.busy=this.firstGlobaSync().then(()=>{

            // stats functions calls
            this.appCom.updateMasonContractorStats('mason');
            this.appCom.updateMasonContractorStats('contractor');
            this.appCom.updateRetailerDistStats('retailer');
            this.appCom.updateRetailerDistStats('distributor');
            this.appCom.updateMyPlanStats('mason');
            this.appCom.updateMyPlanStats('contractor');
            this.appCom.updateHomeSliderStats();
            this.busy = setTimeout(()=>{
                this.globalSyncLoaderBtn=false;
                console.log(" timeout called ");
                this.homeDashbaordDataInit();
            },3000);

            this.notificationCountSet();

          },()=>{
            this.homeDashbaordDataInit();
          });
          this.shareS.setshareData('masterSync',false);
      }else{
        /*this.appCom.updateMasonContractorStats('mason');
        this.appCom.updateMasonContractorStats('contractor');
        this.appCom.updateRetailerDistStats('retailer');
        this.appCom.updateRetailerDistStats('distributor');
        this.appCom.updateMyPlanStats('mason');
        this.appCom.updateMyPlanStats('contractor');
        this.appCom.updateHomeSliderStats();*/
        this.homeDashbaordDataInit();
      }

      this.events.unsubscribe('notificationCountSet');
      this.events.subscribe('notificationCountSet',()=>{
          this.notificationCountSet();
      });
      this.notificationCountSet();
}
notificationCountSet(){
   let query="SELECT * FROM notification_center WHERE ntc_user_read_flag=0 AND status=1";
   this.sqlS.queryExecuteSql(query,[]).then((respData:any)=>{
       this.notificationCtn=respData.rows.length;
   },(error)=>{

   });
}
  firstGlobaSync(){
        return new Promise((resolve,reject)=>{
                   let allSyncTask=[];
                    let allTaskComplete = ()=>{
                       resolve(true);
                    }
                    allSyncTask.push((callback)=>{
                        this.syncS.syncAllMaster().then(()=>{
                            callback();
                        },()=>{
                            callback();
                        });
                    });
                    allSyncTask.push((callback)=>{
                        this.syncS.syncAllOtherData().then(()=>{
                            callback();
                        },()=>{
                            callback();
                        });
                    });
                    allSyncTask.push((callback)=>{
                      this.syncS.syncTargetsMaster().then(()=>{
                          callback();
                        },()=>{
                          callback();
                        });
                    });

                    // allSyncTask.push((callback)=>{
                    //     this.syncS.syncAllHpbApproveRejectData().then(()=>{
                    //         callback();
                    //     },()=>{
                    //         callback();
                    //     });
                    // });

                  async.parallelLimit(allSyncTask,1,function(){
                    allTaskComplete();
                  });

        });
  }

  globalSync(){
      if(this.globalSyncLoaderBtn){
              this.appCom.showToast('Sync already running.','center');
              return false;
        }
        console.log("globalSync started========>");
        this.globalSyncLoaderBtn=true;
        this.busy=this.syncS.syncAllUpDownLocalMaster().then(()=>{
            this.globalSyncLoaderBtn=false;
            let currDate = moment().format("DD-MM-YYYY, h:mm:ss").toString();
            this.globalSyncUpdatedDate=currDate;
            this.appCom.storeAppPreference('globalSyncUpdatedDateTimeStamp',moment().valueOf());
            this.appCom.updateMasonContractorStats('mason');
            this.appCom.updateMasonContractorStats('contractor');
            this.appCom.updateRetailerDistStats('retailer');
            this.appCom.updateRetailerDistStats('distributor');
            this.appCom.updateMyPlanStats('mason');
            this.appCom.updateMyPlanStats('contractor');
            this.appCom.updateHomeSliderStats();
            this.busy = setTimeout(()=>{
                this.homeDashbaordDataInit();
            },2000);
            this.notificationCountSet();
        },()=>{
          this.globalSyncLoaderBtn=false;
        });
  }

  goToTabPage(tabNumber){
     // VisitParentTabsPage
      this.navCtrl.push(VisitParentTabsPage,{"tabNumber":tabNumber});
  }

  async ionViewDidEnter(){
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
    // if(this.globalSyncLoaderBtn==false){
    //     this.busyMessage="Please wait...";
    //     this.homeDashbaordDataInit();
    // }
  }

  openFile(file){
      this.appCom.fileOpen(file);
  }

  homeDashbaordDataInit() {
    console.log("homeDashbaordDataInit");
    this.try = 0;
    this.massonTodayVisitTotal=0;
    this.contractorTodayVisitTotal=0;
    this.distTodayVisitTotal=0;
    this.retailerTodayVisitTotal=0;
    this.contractorCurrTodayVisitTotal=0;
    this.distTodayCurrVisitTotal=0;
    this.retailerCurrTodayVisitTotal=0;
    this.massonCurrTodayVisitTotal=0;

    let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;


    let currDate = moment().format("YYYY-MM-DD").toString();

      let querySelectTemp = "select * from todays_temp_target where for IN('retailer_stats','distributor_stats','mason_stats','contractor_stats') AND date(datetime(local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"')";
      console.log(" querySelectTemp data ----",querySelectTemp);
      this.busy=this.sqlS.selectTableQueryData(querySelectTemp,[]).then((resTempData:any)=>{
          if(resTempData.rows.length > 0){
              for(let i = 0;i < resTempData.rows.length;i++){
                  console.log(" temp rows data ",resTempData.rows.item(i));
                  if(resTempData.rows.item(i).for == 'retailer_stats'){
                      this.retailerCurrTodayVisitTotal = resTempData.rows.item(i).achieved;
                      this.retailerTodayVisitTotal = resTempData.rows.item(i).target;
                  }else if(resTempData.rows.item(i).for == 'distributor_stats'){
                      this.distTodayCurrVisitTotal = resTempData.rows.item(i).achieved;
                      this.distTodayVisitTotal = resTempData.rows.item(i).target;
                  }else if(resTempData.rows.item(i).for == 'mason_stats'){
                      this.massonTodayVisitTotal = resTempData.rows.item(i).target;
                      this.massonCurrTodayVisitTotal = resTempData.rows.item(i).achieved;
                  }else if(resTempData.rows.item(i).for == 'contractor_stats'){
                      this.contractorCurrTodayVisitTotal = resTempData.rows.item(i).achieved;
                      this.contractorTodayVisitTotal = resTempData.rows.item(i).target;
                  }
              }
          }
      });
      this.events.publish('refreshSphStats');
  }

  getAllTargets(){
    console.log('getAllTargets');

  }

  getCheckInCheckOutDataProcess(dataArr){
    return new Promise((resolve,reject)=>{

        let j=0;
        let dataFinal=[];
        let checkInDataRec =(currData,j)=>{

              if(!currData[j]){
                resolve(dataFinal);
                return false;
              }
              let tableName='';
              let colName='';

              if(currData[j]['check_in_out_type']=='project'){
                  tableName='project_master';
                  colName='project_id';
              }else if(currData[j]['check_in_out_type']=='retailer' || currData[j]['check_in_out_type']=='distributor'){
                  tableName='retailer_distributor_master';
                  colName='rds_id';
              }
              let query = "select * from "+tableName+" where "+colName+"="+currData[j]['check_in_out_type_id'];
              this.sqlS.selectTableQueryData(query,[]).then((reslData)=>{

                for(let k=0;k<reslData.rows.length;k++){
                    let tempObj = {};
                    let tmpData = reslData.rows.item(k);
                    tempObj['check_in_out_type']=currData[j]['check_in_out_type'];
                    tempObj['check_in_out_id']=currData[j]['check_in_out_id'];
                    tempObj['check_in_out_type_id']=currData[j]['check_in_out_type_id'];
                    tempObj['hpb_id']= tmpData['server_hpb_id'] || false;
                    tempObj['rds_id']= tmpData['rds_id'] || false;
                    tempObj['rds_type']= tmpData['rds_type'] || false;
                    dataFinal.push(tempObj);
                    console.log('reslData',reslData);
                }
                j++;
                checkInDataRec(dataArr,j);

              },(error)=>{
                j++;
                checkInDataRec(dataArr,j);
                console.log('error',error);
              });

        }
        checkInDataRec(dataArr,j);
    });
  }

  addHPB(){
    this.navCtrl.push(addHpbFormPage);
  }
  productPerformance(){
      this.navCtrl.push(ProductStatsPage);
  }
  addProject(){

    this.busy=this.appCom.projectAddCheckPrvSRKUApp().then((resResult:any)=>{
        if(resResult){
              this.navCtrl.push(AddProjectPage);
        }else{
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.NEW_PRE_PROJECT_SRKU_ERR,"Ok",null);
        }
    });

  }

  goToVisitsList(){
    this.navCtrl.push(VisitParentTabsPage);
  }

 goToNotifyPage(){
    this.navCtrl.push(NotificationsTabPage);
  }


}
