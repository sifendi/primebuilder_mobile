import { appCommonMethods } from '../../../providers/appCommonMethods';
import { LoginPage } from '../login/login';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,MenuController, Platform, LoadingController, AlertController, ToastController, Events } from 'ionic-angular';
import { ShareService } from '../../../providers/ShareService';
import {  App_loginApi, LoopBackAuth }  from '../../../shared/loopback_sdk';

import { ALL_MESSAGE } from "../../../providers/constant";

declare var appDeviceInfo;
declare var sessionUserGlobalData;

@Component({
  selector: 'page-activation-register',
  templateUrl: 'activation-register.html'
})
export class ActivationRegisterPage {
  busy: any;
	busyMessage:any;
 pinCode:String="";
 pinCode1:String="";
 pinCode2:String="";
 pinCtn:any=0;
 pinTitle:String="";
 uuid:String="abcdefghdyd113";
 deviceTokenPush:String="abcdefghdyd113";
 deviceData:any = {};
 constructor(private loopBackAuth:LoopBackAuth,private menu: MenuController,private app_loginApi:App_loginApi,private shareS:ShareService,public navCtrl: NavController, public navParams: NavParams,public platform:Platform,private alertCtrl: AlertController,private loadingCtrl: LoadingController,private toastCtrl: ToastController,private events:Events,public appCom:appCommonMethods) {
    	this.menu.enable(false);
}

  async ionViewDidLoad() {
    //let dataAuthCheck=['userData'];
   // this.events.publish('userPageCheckAuth',dataAuthCheck);
   this.pinTitle = await this.appCom.getTranslatedTxt("Enter New Passcode");
  }

  async addPin(currNum){
     console.log("this.pinCode",this.pinCode,currNum); 
    if(this.pinCode.length<4){
      console.log("this.pinCode",this.pinCode);
      this.pinCode=this.pinCode+currNum;
      if(this.pinCode.length==4){
         this.pinCtn=this.pinCtn + 1;
        setTimeout(async()=>{
         if(this.pinCtn==1){
          this.pinCode1=this.pinCode;
          this.pinCode='';
          this.pinTitle = await this.appCom.getTranslatedTxt("Re-Enter New Passcode");
         }else if(this.pinCtn==2){
          this.pinCode2=this.pinCode;
              if(this.pinCode1==this.pinCode2){

                      let currSessionData = this.shareS.getshareData('currFullUserData');
                      console.log("currSessionData ----",currSessionData);
                      currSessionData['pin']=this.pinCode2;
                      
                      this.busyMessage = 'Please Wait...';
                      
                      console.log(" appDeviceInfo ",appDeviceInfo);
                      let uuid = appDeviceInfo.uuid;
                      let userId=0;
                     
                      this.busy = this.app_loginApi.appActivate(uuid,currSessionData['userId'],appDeviceInfo).subscribe((res)=>{

                        console.log(" app activate response ",res,typeof res);
                        if(typeof res != 'object' && res.toLowerCase() == 'invalid imei' && currSessionData['isSuper']!=1){
                            currSessionData['appStatus']='deactive';
                            currSessionData['appStatusComment']='imei not matched';
                            this.pinCode = '';
                            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_IMEI,'Ok',null);  
                        }

                        this.appCom.storeAppPreference("userCreds",currSessionData).then((success)=>{
                            this.loopBackAuth.setToken(currSessionData);
                            this.loopBackAuth.setUser(currSessionData);
                            this.shareS.setshareData('masterSync',true);
                            this.navCtrl.setRoot(LoginPage);
                            sessionUserGlobalData=currSessionData;
                            this.appCom.showToast('Success. Please Login','button');
                        },(error)=>{
                            console.log(error);
                            this.appCom.showAlert('Somthing went wrong. Please try again later.','Ok',null);
                        });

                      },(err)=>{
                      console.log(err);
                          this.appCom.showAlert('Please check internet','Ok',null);
                      });

              }else{
                this.pinCode='';
                this.pinTitle="Enter New Passcode";
                this.pinCtn=0;
                let alert = this.alertCtrl.create({
                title: '',
                subTitle:"Passcodes Mismatch",
                enableBackdropDismiss:false,
                buttons: ['OK'],
                });
                alert.present();
              }

         }else{
                this.pinCode='';
                this.pinTitle="Enter New Passcode";
                this.pinCtn=0;
         }
        },200);
      }
    } 
  }
  removePin(){  
    if(this.pinCode.length > 0){
			this.pinCode = this.pinCode.slice(0, -1);
		}
  }



}
