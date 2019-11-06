import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import * as moment from 'moment';
import { HpbParentTabsPage } from "../../hpb-pages/hpb-parent-tab-page/hpb-parent-tab-page";
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'visit-mason-list-page',
  templateUrl: 'visit-mason-list-page.html',
})
export class VisitMasonListPage {

  newMemberTotal:any=0;
  visitTotal:any=0;
  maintainTotal:any=0;
  switchingTotal:any=0;
  srkuTotal:any=0;
  productTotal:any=0;
  currentDataSel:any;
  allDataMasonTodayList:any=[];
  busy:any;
  noVisitedActive:any='active';
  visitedActive:any='';
  allActive:any='';
  visitStatusTypeG:any='not_visited';
  visiListTab:any="notvisited";
  uid:any;
  totalAdded:any;
  allDataVisitedList:any = [];
  nonVisitedData:any = [];
  AllDataProductTodayList:any = [];
  allData:any = [];
  try:any = 0;
  today:boolean = true;
  achiveDate:any;
  @ViewChild('currentDataSelInst') currentDataSelInstD: any;
  settingsCalenders: any = {
      onChange: function(event, inst) {
          console.log('event',event);
          console.log('inst',inst);
      }
  }
constructor(private callNumber: CallNumber,public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public app:App) {
        this.app.viewDidEnter.subscribe(()=>{
            this.ionViewDidEnter1();
        })
}

ionViewDidEnter(){
    this.ionViewDidEnter1();    
}

ionViewDidEnter1() {
    //alert("mason list");
    if(this.today == false){
        this.dateChange();
        return false;
    }
    this.newMemberTotal=0;
    this.visitTotal=0;
    this.maintainTotal=0;
    this.switchingTotal=0;
    this.srkuTotal=0;
    this.productTotal=0;
    this.allDataVisitedList = [];
    this.nonVisitedData = [];
    this.allData = [];
    this.AllDataProductTodayList = [];
    //this.today = true;

        
    let currDate = moment().format("YYYY-MM-DD").toString(); 
    let hpb_type = 'mason';
    let localDate = this.appCom.getCurrentTimeStamp();
    console.log('currDate',currDate);
    
     this.appCom.getAppPreference("userCreds").then((resDataU)=>{
            console.log("resDataUser",resDataU);
            if( resDataU != undefined && resDataU != '' ){
                this.uid=resDataU.userId;

                let querySelectTemp = "select * from todays_temp_target where date(datetime(local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and for IN ('myPlan_mason_new_member','myPlan_mason_visit','myPlan_mason_maintain','myPlan_mason_switching','myPlan_mason_srku')";
                console.log(" querySelectTemp ",querySelectTemp);
                this.busy=this.sqlS.selectTableQueryData(querySelectTemp,[]).then((resTempData:any)=>{
                    if(resTempData.rows.length > 0){
                        for(let i = 0;i < resTempData.rows.length;i++){
                            console.log(" temp rows data ",resTempData.rows.item(i));
                            if(resTempData.rows.item(i).for == 'myPlan_mason_new_member'){
                                this.newMemberTotal = resTempData.rows.item(i).achieved;
                            }else if(resTempData.rows.item(i).for == 'myPlan_mason_visit'){
                                this.visitTotal = resTempData.rows.item(i).achieved;
                            }else if(resTempData.rows.item(i).for == 'myPlan_mason_maintain'){
                                this.maintainTotal = Math.round(resTempData.rows.item(i).achieved * 100) / 100;
                            }else if(resTempData.rows.item(i).for == 'myPlan_mason_switching'){
                                this.switchingTotal = Math.round(resTempData.rows.item(i).achieved * 100) / 100;
                            }else if(resTempData.rows.item(i).for == 'myPlan_mason_srku'){
                                this.srkuTotal = Math.round(resTempData.rows.item(i).achieved * 100) / 100;
                            }
                        }
                    }
                });

                //  GET all scheduled entries for today
                //let queryVisitedData = "select hm.* from hpb_master as hm INNER JOIN check_in_out as cio ON hm.created_by = cio.check_in_out_user_id where cio.check_in_out_user_id='"+this.uid+"' and date(datetime(cio.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' and hm.status=1 GROUP BY hm.server_hpb_id";
                
                
                //let queryGetTodaysTotalCheckins = "select mft.*,cio.check_in_datetime,hm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,hm.hpb_profile_pic from hpb_master as hm JOIN monthly_forecast_target as mft ON hm.server_hpb_id = mft.visitor_id LEFT JOIN project_master as pm ON pm.server_hpb_id = mft.visitor_id JOIN check_in_out as cio ON pm.server_hpb_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) where mft.sph_id = '"+this.uid+"' and date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' and hm.status=1 GROUP BY mft.visitor_id";
                
                let queryGetTodaysTotalCheckins = "select mft.*,cio.check_in_datetime,hm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,hm.hpb_profile_pic from hpb_master as hm LEFT JOIN project_master as pm ON pm.server_hpb_id = hm.server_hpb_id LEFT JOIN monthly_forecast_target as mft ON hm.server_hpb_id = mft.visitor_id LEFT JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where  ( date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') or date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') ) and hm.hpb_type = '"+hpb_type+"' and hm.status = 1 GROUP BY hm.server_hpb_id"; 
              //  let queryGetTodaysTotalCheckins = "select mft.*,cio.check_in_datetime,hm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,hm.hpb_profile_pic from hpb_master as hm LEFT JOIN project_master as pm ON pm.server_hpb_id = hm.server_hpb_id LEFT JOIN monthly_forecast_target as mft ON hm.server_hpb_id = mft.visitor_id LEFT JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' and hm.status = 1 GROUP BY hm.server_hpb_id";
                console.log(" mason contractor query 2 mason ",queryGetTodaysTotalCheckins);
                this.sqlS.selectTableQueryData(queryGetTodaysTotalCheckins,[]).then((ressqlGetData:any)=>{
                    this.allDataVisitedList=[];
                    this.nonVisitedData = [];
                    this.allData = [];
                    for(let i = 0;i<ressqlGetData.rows.length;i++){
                        if(ressqlGetData.rows.item(i).check_in_datetime != null){
                            let tempObj = ressqlGetData.rows.item(i);
                            let tempObjPic = JSON.parse(ressqlGetData.rows.item(i).hpb_profile_pic);           tempObj.visitStatus = true;                      
                            tempObj.proPic = tempObjPic[0].path;
                            
                            this.allDataVisitedList.push(tempObj);
                        }else{
                            let tempObj = ressqlGetData.rows.item(i);
                            let tempObjPic = JSON.parse(ressqlGetData.rows.item(i).hpb_profile_pic);           tempObj.proPic = tempObjPic[0].path;
                            tempObj.visitStatus = false;
                            
                            this.nonVisitedData.push(tempObj);
                        }
                        this.allData.push(ressqlGetData.rows.item(i));
                    }
                });

                //Non cement product target achieved//
                let queryGetProductTargetAchieved = "select hb.hpb_id,tb2.product_name,SUM(tb2.quantity) as quantity from hpb_master as hb join (select pat.*,tb.* from products_receipt_approval_tbl as pat join (select pm.product_name,prm.quantity,prm.hpb_id,prm.receipt_id from product_master as pm join product_receipt_master as prm on pm.server_product_id = prm.product_id where date(datetime(prm.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and pm.is_cement = 0 and prm.created_by = '"+this.uid+"') as tb on pat.receipt_id = tb.receipt_id where pat.receipt_id not in (select receipt_id from products_receipt_approval_tbl where is_closed = 0 and approval_status =-1 group by receipt_id) group by pat.receipt_id) as tb2  on hb.hpb_id = tb2.hpb_id where hpb_type='"+hpb_type+"' group by tb2.product_name order by tb2.quantity";
                this.AllDataProductTodayList = [];
                console.log(" mason contractor query 3 ",queryGetProductTargetAchieved);
                this.sqlS.selectTableQueryData(queryGetProductTargetAchieved,[]).then((ressqlGetData:any)=>{
                    if(ressqlGetData && ressqlGetData.rows.length>0){
                        for(let i = 0;i<ressqlGetData.rows.length;i++){
                            this.AllDataProductTodayList[i] = {};
                            this.AllDataProductTodayList[i]['product_name'] = ressqlGetData.rows.item(i).product_name;
                            this.AllDataProductTodayList[i]['quantity'] = ressqlGetData.rows.item(i).quantity; 
                        }
                    }else{
                        this.AllDataProductTodayList = [];
                    }
                }); 
                
            }else{
                this.uid="";
            }
        },(err)=>{
            console.log('err ref',err);
        });

  }

  dateChange(){
    setTimeout(() => {
        let dateVal = this.currentDataSel;
        let timestamp = this.appCom.dateToTimeStamp(dateVal);
        let date:any=0;
        let now:any=0;

        date = moment(dateVal).format('DD');
        now = moment().format('DD');
        console.log("this.currentDataSel ------------",dateVal,date,now);
        date = parseInt(date);
        now = parseInt(now);
        
        if(date != now){
            this.today = false;
            this.achiveDate = moment(timestamp).format("DD MMM YYYY").toString();
        }else{
            this.today = true;
        }
        this.calenderFilterData(timestamp);
    },100);
  }

  calenderFilterData(dateTime){
    this.newMemberTotal=0;
    this.visitTotal=0;
    this.maintainTotal=0;
    this.switchingTotal=0;
    this.srkuTotal=0;
    this.productTotal=0;
    this.allDataVisitedList = [];
    this.nonVisitedData = [];
    this.allData = [];
    this.AllDataProductTodayList = [];

        
    let currDate = moment(dateTime).format("YYYY-MM-DD").toString(); 
    let hpb_type = 'mason';
    let localDate = this.appCom.getCurrentTimeStamp();
    console.log('currDate',currDate);
    
     this.appCom.getAppPreference("userCreds").then((resDataU)=>{
            console.log("resDataUser",resDataU);
            if( resDataU != undefined && resDataU != '' ){
                this.uid=resDataU.userId;
    
                    //  New member added today by sph    
                    let queryNewMember = "select count(*) as Total from hpb_master where created_by = '"+this.uid+"' and date(datetime(local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hpb_type = '"+hpb_type+"'";
                    let dataAr=[];
                    this.sqlS.selectTableQueryData(queryNewMember,dataAr).then((ressqlData:any)=>{
                        this.newMemberTotal = ressqlData.rows.item(0).Total;
                    },(error)=>{
                        console.log('error',error);
                    });
                    
                    //  Todays total visits
                    let queryGetTodaysTotalCheckinsQ = "select pm.*,hm.* from hpb_master as hm JOIN project_master as pm ON hm.server_hpb_id = pm.server_hpb_id JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id where cio.check_in_out_user_id = '"+this.uid+"' and date(datetime(cio.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' GROUP BY pm.project_id";
                    
                    let allDataMasonTodayListQ=[];
                    console.log(" queryGetTodaysTotalCheckins mason ",queryGetTodaysTotalCheckinsQ);
                    this.sqlS.selectTableQueryData(queryGetTodaysTotalCheckinsQ,[]).then((ressqlData:any)=>{
                        let hpbUsers = [];
                        for(let i=0;i<ressqlData.rows.length;i++){
                            this.visitTotal++;
                        }
                    },(error)=>{
                        console.log('error',error);
                    });


                    //  Data for maintain and switching
                    //let queryGetTodaysTotalConsumption = "select pm.*,hm.*,prm.* from hpb_master as hm JOIN product_receipt_master as prm ON hm.server_hpb_id = prm.server_hpb_id JOIN product_master AS pm ON pm.server_product_id = prm.product_id where prm.created_by = '"+this.uid+"' and date(datetime(prm.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_status IN('maintain','switching') and hm.hpb_type = '"+hpb_type+"'";
                    
                    let queryGetTodaysTotalConsumption = "select pm.*,hm.*,prm.*,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' order by local_created_date DESC limit 1) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' order by local_created_date DESC limit 1) AS sa_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' order by local_created_date DESC limit 1) AS ac_approval from hpb_master as hm JOIN product_receipt_master as prm ON hm.server_hpb_id = prm.server_hpb_id JOIN product_master AS pm ON pm.server_product_id = prm.product_id where prm.created_by = '"+this.uid+"' and date(datetime(prm.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_status IN('maintain','switching') and hm.hpb_type = '"+hpb_type+"'";
                    
                    console.log(" maintain and switching ",queryGetTodaysTotalConsumption);
                    this.sqlS.selectTableQueryData(queryGetTodaysTotalConsumption,[]).then((ressqlData:any)=>{
                        for(let i=0;i<ressqlData.rows.length;i++){
                            if(ressqlData.rows.item(i).tlh_approval != -1 && ressqlData.rows.item(i).ac_approval != -1 && ressqlData.rows.item(i).sa_approval != -1){
                                if(ressqlData.rows.item(i).hpb_status == 'switching'){
                                    let temp = (ressqlData.rows.item(i).quantity * ressqlData.rows.item(i).product_unit_value)/1000;
                                    let tempVal = this.switchingTotal + temp;
                                    this.switchingTotal = Math.round(tempVal * 100) / 100; 
                                }else if(ressqlData.rows.item(i).hpb_status == 'maintain'){
                                    let temp = (ressqlData.rows.item(i).quantity * ressqlData.rows.item(i).product_unit_value)/1000;
                                    let tempVal = this.maintainTotal + temp;
                                    this.maintainTotal = Math.round(tempVal * 100) / 100;                                
                                }
                            }
                        }
                    },(error)=>{
                        console.log('error',error);
                    });


                    // is srku projects added data need to add hpb_type filter
                    let queryGetTodaysTotalSRKUConsumption = "select prodm.*,pm.*,prm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' order by local_created_date DESC limit 1) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' order by local_created_date DESC limit 1) AS sa_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' order by local_created_date DESC limit 1) AS ac_approval from hpb_master as hm JOIN project_master as pm ON hm.server_hpb_id = pm.server_hpb_id LEFT JOIN product_receipt_master as prm ON pm.project_id = prm.project_id JOIN product_master as prodm ON prodm.server_product_id = prm.product_id where prm.created_by = '"+this.uid+"' and date(datetime(prm.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' and pm.is_srku = 1";
                    console.log(" issrku check ",queryGetTodaysTotalConsumption);
                    this.sqlS.selectTableQueryData(queryGetTodaysTotalSRKUConsumption,[]).then((ressqlData:any)=>{
                        for(let i=0;i<ressqlData.rows.length;i++){
                            if(ressqlData.rows.item(i).tlh_approval != -1 && ressqlData.rows.item(i).ac_approval != -1 && ressqlData.rows.item(i).sa_approval != -1){
                                console.log(" is srku data ",ressqlData.rows.item(i));
                                let temp = (ressqlData.rows.item(i).quantity * ressqlData.rows.item(i).product_unit_value) / 1000;
                                let tempVal = this.srkuTotal + temp;
                                this.srkuTotal = Math.round(tempVal * 100) / 100;
                            }
                        }
                    },(error)=>{
                        console.log('error',error);
                    });
                    
                //  GET all scheduled entries for today
                //let queryGetTodaysTotalCheckins = "select mft.*,cio.check_in_datetime,hm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,hm.hpb_profile_pic from hpb_master as hm LEFT JOIN project_master as pm ON pm.server_hpb_id = hm.server_hpb_id LEFT JOIN monthly_forecast_target as mft ON hm.server_hpb_id = mft.visitor_id LEFT JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) where mft.sph_id = '"+this.uid+"' and date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' and hm.status = 1 GROUP BY mft.visitor_id";
                
                //let queryGetTodaysTotalCheckins = "select mft.*,cio.check_in_datetime,hm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,hm.hpb_profile_pic from hpb_master as hm LEFT JOIN project_master as pm ON pm.server_hpb_id = hm.server_hpb_id LEFT JOIN monthly_forecast_target as mft ON hm.server_hpb_id = mft.visitor_id LEFT JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where  date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' and hm.status = 1 GROUP BY hm.server_hpb_id";
               // let queryGetTodaysTotalCheckins = "select mft.*,cio.check_in_datetime,hm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,hm.hpb_profile_pic from hpb_master as hm LEFT JOIN project_master as pm ON pm.server_hpb_id = hm.server_hpb_id LEFT JOIN monthly_forecast_target as mft ON hm.server_hpb_id = mft.visitor_id LEFT JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where  ( date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') or date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') ) and hm.hpb_type = '"+hpb_type+"' and hm.status = 1 GROUP BY hm.server_hpb_id";
               let queryGetTodaysTotalCheckins = "select mft.*,cio.check_in_datetime,hm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,hm.hpb_profile_pic from hpb_master as hm LEFT JOIN project_master as pm ON pm.server_hpb_id = hm.server_hpb_id LEFT JOIN monthly_forecast_target as mft ON hm.server_hpb_id = mft.visitor_id LEFT JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where  ( date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') or date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') ) and hm.hpb_type = '"+hpb_type+"' and hm.status = 1 GROUP BY hm.server_hpb_id"; 
               let allDataMasonTodayList=[];
                let tempVisitedHpbArr = [];
                console.log(" mason contractor query 2 ",queryGetTodaysTotalCheckins);
                this.sqlS.selectTableQueryData(queryGetTodaysTotalCheckins,[]).then((ressqlGetData:any)=>{
                    for(let i = 0;i<ressqlGetData.rows.length;i++){
                        if(ressqlGetData.rows.item(i).check_in_datetime != null){
                            let tempObj = ressqlGetData.rows.item(i);
                            let tempObjPic = JSON.parse(ressqlGetData.rows.item(i).hpb_profile_pic);                                    
                            tempObj.proPic = tempObjPic[0].path;
                            tempObj.visitStatus = true;                             
                            this.allDataVisitedList.push(tempObj);
                        }else{
                            let tempObj = ressqlGetData.rows.item(i);
                            let tempObjPic = JSON.parse(ressqlGetData.rows.item(i).hpb_profile_pic);           
                            
                            tempObj.visitStatus = false;                           
                            tempObj.proPic = tempObjPic[0].path;
                            this.nonVisitedData.push(tempObj);
                        }
                        this.allData.push(ressqlGetData.rows.item(i));
                    }
                });

                //Non cement product target achieved//
                let queryGetProductTargetAchieved = "select hb.hpb_id,tb2.product_name,SUM(tb2.quantity) as quantity from hpb_master as hb join (select pat.*,tb.* from products_receipt_approval_tbl as pat join (select pm.product_name,prm.quantity,prm.hpb_id,prm.receipt_id from product_master as pm join product_receipt_master as prm on pm.server_product_id = prm.product_id where date(datetime(prm.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and pm.is_cement = 0 and prm.created_by = '"+this.uid+"') as tb on pat.receipt_id = tb.receipt_id where pat.receipt_id not in (select receipt_id from products_receipt_approval_tbl where is_closed = 0 and approval_status =-1 group by receipt_id) group by pat.receipt_id) as tb2  on hb.hpb_id = tb2.hpb_id where hpb_type='"+hpb_type+"' group by tb2.product_name order by tb2.quantity";
                this.AllDataProductTodayList = [];
                console.log(" mason contractor query 3 ",queryGetProductTargetAchieved);
                this.sqlS.selectTableQueryData(queryGetProductTargetAchieved,[]).then((ressqlGetData:any)=>{
                    if(ressqlGetData && ressqlGetData.rows.length>0){
                        for(let i = 0;i<ressqlGetData.rows.length;i++){
                            this.AllDataProductTodayList[i] = {};
                            this.AllDataProductTodayList[i]['product_name'] = ressqlGetData.rows.item(i).product_name;
                            this.AllDataProductTodayList[i]['quantity'] = ressqlGetData.rows.item(i).quantity; 
                        }
                    }else{
                        this.AllDataProductTodayList = [];
                    }
                });   
            }else{
                this.uid="";
            }
        },(err)=>{
            console.log('err ref',err);
        });

  }

  goToHpbDetail(hpb){
    this.app.getRootNav().push(HpbParentTabsPage,{
      "hpbData":hpb,
      "hpbId"  : hpb['hpb_id'],
      "hpbName": hpb['hpb_name'],
      "action":"hpbSpecific",
      "tab":"detail"
    });
  }

  goToProjectList(hpb){ 
    this.app.getRootNav().push(HpbParentTabsPage,{
      "hpbData":hpb,
      "hpbId" : hpb['hpb_id'],
      "action":"hpbSpecific",
      "hpbName": hpb['hpb_name'],
      "tab":"projects"
    }); 
  }

  call(number){
      if(number){
        this.callNumber.callNumber(number, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
      }
  }

}
