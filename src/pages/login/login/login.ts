import { appCommonMethods } from "../../../providers/appCommonMethods";
import { HomePage } from "../../home/home";
import { MasonDashboardPage } from "../../mason/dashboard/dashboard";

import { SyncServices } from "../../../providers/syncServices";
import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Platform,
  AlertController,
  MenuController,
  ToastController,
  Events
} from "ionic-angular";
import { MobileVerifyPage } from "../mobile-verify/mobile-verify";
import { ShareService } from "../../../providers/ShareService";
import { App_hpbApi } from "../../../shared/loopback_sdk";
import { TlhDashboardPage } from "../../tlh/dashboard/dashboard";

import {  App_loginApi,App_areaApi, LoopBackAuth }  from '../../../shared/loopback_sdk';

import async from "async";
import { AcDashboardPage } from "../../ac/dashboard/dashboard";
import { ALL_MESSAGE } from "../../../providers/constant";
import { AmDashboardPage } from "../../am/dashboard/dashboard";

declare var sessionUserGlobalData,globalInternetCheckConnection,appDeviceInfo,await;

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  userPin: any = "";
  busy: any;
  busyMessage: any;
  constructor(
    private syncS: SyncServices,
    private app_hpbApi: App_hpbApi,
    private menu: MenuController,
    private shareS: ShareService,
    public navCtrl: NavController,
    platform: Platform,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private events: Events,
    public appCom: appCommonMethods,
    public appLogin:App_loginApi,
    public checkTokenApiTemp:App_areaApi
  ) {
    this.menu.enable(false);
  }
  pinCode: String = "";
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    //this.events.publish('userMenuAuthEnbDib',false);
    if(globalInternetCheckConnection){
        let mobile = sessionUserGlobalData.user.username;
        let dataObj={};
        dataObj['imei']=appDeviceInfo.uuid;
        dataObj['user_no']=mobile;
        this.appLogin.checkImeiNew(dataObj).subscribe((imeiStatusRes)=>{
            console.log(" imeiStatusRes ",imeiStatusRes);
            if(imeiStatusRes[0].match || imeiStatusRes[0].isSuper==1){
                sessionUserGlobalData.appStatus = 'active';
                sessionUserGlobalData.appStatusComment = '';
            }else{
                sessionUserGlobalData.appStatus = 'deactive';
                sessionUserGlobalData.appStatusComment = 'invalid imei';
            }
            this.appCom.storeAppPreference("userCreds",sessionUserGlobalData);
            
        });
        
        this.checkTokenApiTemp.find().subscribe(()=>{
            
        },(error)=>{
          console.log(' checkImei error',error);
          if(error['statusCode']==401 && error['code']=="AUTHORIZATION_REQUIRED"){
              console.log('log out...');
              this.shareS.setshareData("forgetPassFlag", true);
              this.navCtrl.setRoot(MobileVerifyPage).then(()=>{
                this.appCom.storeAppPreference("userCreds",false);
                sessionUserGlobalData=null;
                this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SESSION_EXPIRED,"bottom")
              });
          }
        });
    }
  }

  async addPin(currNum) {
    
    if (this.pinCode.length < 4) {
      this.pinCode = this.pinCode + currNum;
      if (this.pinCode.length == 4) { 
        let titleW = await this.appCom.getTranslatedTxt("Wrong Pin");
        let titleSw = await this.appCom.getTranslatedTxt("Entered pin is incorrect");
        let titleOk = await this.appCom.getTranslatedTxt("Ok");
        setTimeout(() => {
          this.appCom.getAppPreference("userCreds").then(userData => {
            if (userData) {

              console.log(" sessionUserGlobalData login ",sessionUserGlobalData);
              if (sessionUserGlobalData.appStatus != "deactive") {
                if (
                  this.pinCode == userData["pin"] &&
                  userData["pin"] != "" &&
                  userData["pin"] != null
                ) {
                  console.log(
                    " userData ",
                    userData,
                    userData.user.roles[0]["name"]
                  );
                  let menuName;
                  let homePageName;
                  let currShareDataUser: any = { role: false, uid: 0 };
                  currShareDataUser["uid"] = userData.user["id"];
                  if (userData.user.roles[0]["name"] == "$sph") {
                    menuName = "sphMainMenu";
                    homePageName = HomePage;
                    currShareDataUser["role"] = "$sph";
                  } else if (userData.user.roles[0]["name"] == "$hpb") {
                    menuName = "hpbMainMenu";
                    homePageName = MasonDashboardPage;
                  } else if (userData.user.roles[0]["name"] == "$tlh") {
                    menuName = "tlhMainMenu";
                    homePageName = TlhDashboardPage;
                    if (
                      userData["userId"] != userData["userIdG"] &&
                      userData["userIdG"] > 0 &&
                      userData["userId"] > 0
                    ) {
                      menuName = "tlhSphMainMenu";
                      homePageName = HomePage;
                    }
                  } else if (userData.user.roles[0]["name"] == "$ac") {
                    menuName = "acMainMenu";
                    homePageName = AcDashboardPage;
                    if (
                      userData["userId"] != userData["userIdG"] &&
                      userData["userIdG"] > 0 &&
                      userData["userId"] > 0
                    ) {
                      menuName = "acSphMainMenu";
                      homePageName = HomePage;
                    }
                  } else if (userData.user.roles[0]["name"] == "$am") {
                    menuName = "amMainMenu";
                    homePageName = AmDashboardPage;
                  }
                  this.shareS.setshareData(
                    "currSessionUserData",
                    currShareDataUser
                  );
                  console.log("home page", homePageName);
                  this.navCtrl.setRoot(homePageName).then(() => {
                    this.menu.enable(true, menuName);
                    this.events.publish("userDataRefresh");
                  });
                } else {
                 
                  let alert = this.alertCtrl.create({
                    title: titleW,
                    subTitle: titleSw,
                    enableBackdropDismiss: false,
                    buttons: [
                      {
                        text: titleOk,
                        handler: data => {
                          this.pinCode = "";
                        }
                      }
                    ]
                  });
                  alert.present();
                }
              } else {
                this.pinCode = '';
                this.appCom.showAlert(
                  ALL_MESSAGE.ERROR_MESSAGE.APP_DEACTIVATED,
                  "Ok",
                  null
                );
              }
            }
          });
        }, 200);
      }
    }
  }
  removePin() {
    if (this.pinCode.length > 0) {
      this.pinCode = this.pinCode.slice(0, -1);
    }
  }

  forgotPassClick() {
    this.shareS.setshareData("forgetPassFlag", true);
    this.navCtrl.push(MobileVerifyPage);
  }
}
