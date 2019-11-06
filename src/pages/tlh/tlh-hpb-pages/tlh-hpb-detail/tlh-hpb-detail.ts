import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App } from 'ionic-angular';
import { MasonRedeemTabPage } from "../../../mason/mason-redeem-tab/mason-redeem-tab";
import { ShareService } from "../../../../providers/ShareService";
import { SqlServices } from "../../../../providers/sqlService";
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { App_hpbApi } from "../../../../shared/loopback_sdk/index";
import { ALL_MESSAGE } from "../../../../providers/constant";




@Component({
  selector: 'tlh-hpb-detail',
  templateUrl: 'tlh-hpb-detail.html',
})
export class TlhHpbDetailsPage {
  hpbData:any=[];
  hpbProfilePic:any;
  hpbIdPhotoObj:any=[];
  dateOfBirth:any;
  hpbServerId:any;
  disabledRedeem:boolean = true;
  hpb_Id:any;
  busyMessage:any;
  busy:any;
  uId:number;
  userRole="$tlh";



  constructor(private shareS:ShareService,public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public app: App,public hpbApi: App_hpbApi) {
  }

  ionViewDidLoad() {
        console.log('ionViewDidLoad HpbDetailsPage');
        let paramData=this.navParams.data;
        let hpbId =paramData['hpbId'];
        this.busy =  this.hpbApi.getHpb(hpbId,null,null,null,null,null,null,null,null,null,null,null,null,null).subscribe(resData => {
        this.hpbData= resData.result[0] ;     
        console.log("this.hpbData",this.hpbData);
        let idPhoto = JSON.parse(this.hpbData.id_photo);     
        let dp=JSON.parse(this.hpbData['hpb_profile_pic']);     
        let ds=JSON.parse(this.hpbData['hpb_digital_sign']);      
              if(  this.hpbData.hpb_profile_pic !=undefined && this.hpbData.hpb_profile_pic !='' ){
                   this.hpbData['hpb_profile_pic'] = dp[0]['serverPath'];
              }else{
                   this.hpbData.hpb_profile_pic = "assets/img/profile.jpg";
              }

              if(  this.hpbData.hpb_digital_sign !=undefined && this.hpbData.hpb_digital_sign !='' ){
                   this.hpbData.hpb_digital_sign = ds[0]['serverPath'];
              }else{
                   this.hpbData.hpb_digital_sign = "";
              }
             
              if( idPhoto !=undefined && idPhoto !=''  ){
                for( var i=0;i<idPhoto.length;i++ ){
                      this.hpbIdPhotoObj.push(  idPhoto[i]['serverPath'] );  
                }
              }
             
             if( this.hpbData['date_of_birth'] != undefined && this.hpbData['date_of_birth'] != "" ){
                    this.dateOfBirth=this.appCom.timeStampToDate((this.hpbData['date_of_birth']));
             }
              
       
    
    }, (error) => {
        console.log('Error', error);
        
    });
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

  openFile(file){
      console.log(" file ",file);
      this.appCom.onlineFileOpen(file);
  }
   


  redeem(hpb_id){
    //hpb_id = 8;
    // this.shareS.setshareData('redeem_hpbId',hpb_id);
    // this.app.getRootNav().push(MasonRedeemTabPage,{
    //   hpb_id: hpb_id
    // });
  }

}
