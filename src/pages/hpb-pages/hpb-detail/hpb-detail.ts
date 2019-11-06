import { AddProjectPage } from '../../project/add-project/add-project';

import { addHpbFormPage } from '../hpb-add-form/hpb-add-form';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { ShareService } from '../../../providers/ShareService';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { App } from 'ionic-angular';

import { MasonRedeemTabPage } from '../../mason/mason-redeem-tab/mason-redeem-tab';
declare var sessionUserGlobalData;

@Component({
  selector: 'page-registration-form-details',
  templateUrl: 'hpb-detail.html',
})
export class HpbDetailsPage {
  hpbData:any=[];
  hpbProfilePic:any;
  hpbIdPhotoObj:any=[];
  dateOfBirth:any;
  hpbServerId:any;
  disabledRedeem:boolean = true;
  hpb_Id:any;
  busyMessage:any="Please Wait...";  
  busy:any;
  hpbRedeemBtnShow:any=false;
  hpbProfilePicTemp:any=[];
  hpbDigitalSignTemp:any=[];
  hpbIdCardPicTemp:any=[]; 

  constructor(public events:Events,private shareS:ShareService,public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public app: App) {
    this.events.subscribe('refreshHpbDetailPage',()=>{
      console.log("hpb detail ts");
     // this.ionViewDidLoad1();
    });
  }

//   ionViewWillEnter() {
//     this.busyMessage = this.appCom.getTranslatedTxt("Please wait..."); 
//     console.log("ionViewDidEnter");
//      //default value of approval and reason
//      this.hpbData['mobapprovalstatus'] = 1;
//      this.hpbData['idapprovalstatus'] = 1;
//      this.hpbData['mobapprovalreason'] = '';
//      this.hpbData['idapprovalreason'] = '';

//      var hpbApprovalQuery = "select * from hpb_update_approval where hpb_id="+this.hpbServerId+" group by field_name";

//      this.busy = this.sqlS.selectTableQueryData(hpbApprovalQuery,[]).then((data)=>{
//         if(data && data.rows.length>0){
//           for(let i = 0;i<data.rows.length;i++){
//             if(data.rows.item(i).field_name=='Mobile'){
//               this.hpbData['mobapprovalstatus'] = data.rows.item(i).approval_status;
//               this.hpbData['mobapprovalreason'] = data.rows.item(i).reason;
//             }else if(data.rows.item(i).field_name=='Card Number'){
//               this.hpbData['idapprovalstatus'] = data.rows.item(i).approval_status;
//               this.hpbData['idapprovalreason'] = data.rows.item(i).reason;
//             }
//           }
//         }else{
//           //do nothing.
//         }
//      });

//      console.log('this.hpbData=>',this.hpbData);  
//  }

 ionViewDidLoad(){
  this.ionViewDidLoad1();
 }


 ionViewDidLoad1() {
    console.log('ionViewDidLoad HpbDetailsPage');
    //this.busyMessage = this.appCom.getTranslatedTxt("Please wait...");
    var hpbId =this.navParams.get("hpbId");
    var selectField = "*";
    var where =" `hpb_id` = " +hpbId;
    console.log("where=>",where);
    var tablename = "hpb_master";
    this.busy= this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {
        console.log(" hpb data ",data.rows.item(0));

        this.hpbData= data['rows'].item(0) ;     

        this.hpbServerId = this.hpbData.server_hpb_id;
        if(this.hpbData['created_by']==sessionUserGlobalData['userId'] || this.hpbData['assigned_to']==sessionUserGlobalData['userId']){
            this.hpbRedeemBtnShow=true;
        }
        if(this.hpbServerId){
          this.hpb_Id = this.hpbServerId;
          this.disabledRedeem = false;
        }

        this.hpbProfilePicTemp=this.hpbData['hpb_profile_pic'];
        this.hpbDigitalSignTemp=this.hpbData['hpb_digital_sign'];
        this.hpbIdCardPicTemp=this.hpbData.id_photo;

        let idPhoto = JSON.parse(this.hpbData.id_photo);     
        let dp=JSON.parse(this.hpbData['hpb_profile_pic']);     
        let ds=JSON.parse(this.hpbData['hpb_digital_sign']);      
         
              if(  this.hpbData.hpb_profile_pic !=undefined && this.hpbData.hpb_profile_pic !='' ){
                   //this.hpbData.hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                   this.hpbData.hpb_profile_pic = this.appCom.getImageLocalPathFull(dp[0]);
              }else{
                   this.hpbData.hpb_profile_pic = "assets/img/profile.jpg";
              }

              if(  this.hpbData.hpb_digital_sign !=undefined && this.hpbData.hpb_digital_sign !='' ){
                   //this.hpbData.hpb_digital_sign = this.appCom.urlSanitizer(ds[0]['path']);
                   this.hpbData.hpb_digital_sign = this.appCom.getImageLocalPathFull(ds[0]);
              }else{
                   this.hpbData.hpb_digital_sign = "";
              }
             
              if( idPhoto !=undefined && idPhoto !=''  ){
                for( var i=0;i<idPhoto.length;i++ ){
                      //this.hpbIdPhotoObj.push(  this.appCom.urlSanitizer(idPhoto[i]['path']) );
                      this.hpbIdPhotoObj.push(  this.appCom.getImageLocalPathFull(idPhoto[i]) );  
                }
              }
             
             if( this.hpbData['date_of_birth'] != undefined && this.hpbData['date_of_birth'] != "" ){
                    this.dateOfBirth=this.appCom.timeStampToDate((this.hpbData['date_of_birth']));
             }

                          
             var hpbApprovalQuery = "select * from hpb_update_approval where server_hpb_id="+this.hpbServerId+" and is_closed= 0";

             this.busy = this.sqlS.selectTableQueryData(hpbApprovalQuery,[]).then((data)=>{
                if(data && data.rows.length>0){
                  //default value of approval and reason
                  this.hpbData['mobapprovalstatus'] = 1;
                  this.hpbData['idapprovalstatus'] = 1;
                  this.hpbData['mobapprovalreason'] = '';
                  this.hpbData['idapprovalreason'] = ''; 

                  for(let i = 0;i<data.rows.length;i++){
                    if(data.rows.item(i).field_name=='Mobile'){
                      this.hpbData['mobapprovalstatus'] = data.rows.item(i).approval_status;
                      this.hpbData['mobapprovalreason'] = data.rows.item(i).reason;
                       
                      if(this.hpbData['mobapprovalstatus']==-1){
                        this.hpbData['primary_mobile_no'] = data.rows.item(i).field_old_value;
                      }else{
                        this.hpbData['primary_mobile_no'] = data.rows.item(i).field_new_value;
                      }
                    }else if(data.rows.item(i).field_name=='Card Number'){
                      this.hpbData['idapprovalstatus'] = data.rows.item(i).approval_status;
                      this.hpbData['idapprovalreason'] = data.rows.item(i).reason;
                      if(this.hpbData['idapprovalstatus']==-1){
                        this.hpbData['id_card_number'] = data.rows.item(i).field_old_value;
                      }else{
                        this.hpbData['id_card_number'] = data.rows.item(i).field_new_value;
                      }
                    }
                  }
                }else{
                  //do nothing.
                  //default value of approval and reason
                  this.hpbData['mobapprovalstatus'] = 1;
                  this.hpbData['idapprovalstatus'] = 1;
                  this.hpbData['mobapprovalreason'] = '';
                  this.hpbData['idapprovalreason'] = '';
                }
             });

             console.log('this.hpbData=>',this.hpbData);    
    
    }, (error) => {
        console.log('Error', error);
        
    });
  }

  openFile(file){
      console.log(" file ",file.changingThisBreaksApplicationSecurity);
      this.appCom.fileOpen(file.changingThisBreaksApplicationSecurity);
  }

  addHPB(){
    this.app.getRootNav().push(addHpbFormPage,{
      "action":"none"
    });
     
  }
   
  addProject(){   
     this.app.getRootNav().push(AddProjectPage,{
      "action":"none"
    });
  }

  editCurrentHpb(){
    
    // this.hpbData.hpb_profile_pic =this.hpbProfilePicTemp;
    // this.hpbData.hpb_digital_sign= this.hpbDigitalSignTemp
    // this.hpbData.id_photo= this.hpbIdCardPicTemp;

    this.app.getRootNav().push(addHpbFormPage,{
         "hpbData":this.hpbData,
         "action":"edit"
    });
  }

  redeem(hpb_id){
    
    //hpb_id = 8;
    this.shareS.setshareData('redeem_hpbId',hpb_id);
    this.app.getRootNav().push(MasonRedeemTabPage,{
      hpb_id: hpb_id
    });
  }

}
