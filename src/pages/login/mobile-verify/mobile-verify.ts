import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,ModalController,MenuController } from 'ionic-angular';
import {  NgModel } from '@angular/forms';
import { TermsAndConditon } from '../terms-and-conditions-page/terms-and-conditions-page';
import { ALL_MESSAGE, SITE_API } from "../../../providers/constant";
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { OtpPage } from '../otp/otp';
import { ActivationRegisterPage } from '../activation-register/activation-register';
import {Subscription} from 'rxjs';
import { ShareService } from '../../../providers/ShareService';
import {  App_loginApi, App_hpbApi, LoopBackAuth }  from '../../../shared/loopback_sdk';

declare var globalInternetCheckConnection,sessionUserGlobalData,appDeviceInfo;
declare var appTypeMainTran;
@Component({
  selector: 'page-mobile-verify',
  templateUrl: 'mobile-verify.html'
}) 
export class MobileVerifyPage {
  busy: Subscription;
  busyMessage:any;
  accept_terms_default:any=false;
  submitted:boolean= false;
  termsCondHide:any=false;
  @ViewChild('mobilenumber') mobilenumber: NgModel;

  constructor(private loopBackAuth:LoopBackAuth,private app_hpbApi:App_hpbApi,private menu: MenuController,private app_loginApi:App_loginApi,private shareS:ShareService,public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods,public modalCtrl:ModalController ) {
     this.menu.enable(false);
  }

  ionViewDidLoad() {
      // console.log('ionViewDidLoad MobileVerifyPage');  

        this.termsCondHide = this.shareS.getshareData('forgetPassFlag');

          this.appCom.getAppPreference("userCreds").then((resDataU)=>{
            this.loopBackAuth.setToken(resDataU);   
            this.loopBackAuth.setUser(resDataU); 
            
          },(err)=>{
             console.log('err ref',err);
          });
      
     
  
}

 async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

  submitMobileVerfiy(){
      this.submitted= true; 
      if(this.accept_terms_default || this.termsCondHide){

            if( this.mobilenumber.valid ){

              

              if(globalInternetCheckConnection==false){
                   this.appCom.showAlert('No internet connection','Ok',null);
                   return false;
              }

              let dataObj={};
              dataObj['imei']=appDeviceInfo.uuid;
              dataObj['user_no']=this.mobilenumber.value;
              this.busy = this.app_loginApi.checkImeiNew(dataObj).subscribe((imeiStatusRes)=>{
                  console.log(" imeiStatusRes ",imeiStatusRes);
                  if(imeiStatusRes.length == 0 || imeiStatusRes[0].match || imeiStatusRes[0].isSuper==1){
                      
                      console.log(this.mobilenumber.value);
                      let creads = {username:this.mobilenumber.value};
                      this.busy = this.app_loginApi.requestCode(creads).subscribe((res)=>{
                          
                            console.log(res);

                            if(res['response']['status']){

                                if(res['response']['userStatus'] || imeiStatusRes[0].isSuper==1){
                               
                                        if(res['response']['isSuper']==1){
                                            console.log(res);
                                            this.shareS.setshareData('currFullUserData',res['response']);
                                            this.navCtrl.setRoot(ActivationRegisterPage);
                                        }else{
                                            this.shareS.setshareData('currUserMobile',this.mobilenumber.value);
                                            if(appTypeMainTran=="training"){
                                                this.appCom.showToast('Your otp is '+res['response']['otpcode'],'bottom');
                                            }
                                            
                                            this.navCtrl.setRoot(OtpPage);
                                         }
                                }else{
                                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.APP_DEACTIVATED_S,'Ok',null);
                                }
                            }else{
                                this.appCom.showAlert('Something went wrong. Please try again later.','Ok',null);
                            }


                        },(err)=>{
                              console.log(err);
                            this.appCom.showAlert('Please enter a valid mobile no.','Ok',null);
                      });

                  }else{
                      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_IMEI,'Ok',null);
                  }
                  
              })

            }else{
                  this.appCom.showAlert('Please enter a valid mobile no.','Ok',null);
            }
         
      }else{

          this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.TERMS_N_COND_SELECT_ERR,"Ok","");
     
     }
   


  }


openTermsAndCond(){
    this.appCom.openTNC(SITE_API.TNC);
}


  

}
