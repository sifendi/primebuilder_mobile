import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Events, AlertController, MenuController } from 'ionic-angular';
import { ALL_MESSAGE,SQL_QUERY } from '../../../providers/constant';
import { ShareService } from '../../../providers/ShareService';
import { SqlServices } from '../../../providers/sqlService';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import * as moment from 'moment';
import async from 'async'; 

import { HomePage } from '../../../pages/home/home';

declare var globalInternetCheckConnection;
declare var sessionUserGlobalData;
@Component({
  selector: 'ac-activate-sph-list',
  templateUrl: 'ac-activate-sph-list.html',
})
export class AcActivateSphListPage {
  busy:any;
  busyMessage:any=ALL_MESSAGE.COMMON_MESSAGE.PLEASE_WAIT;
  userListDataArrs:any=[];
  userListDataArrsAll:any=[];
  selectedUserId:any;
  ActiveSelctUserData:any;
  searchUserM:any=null;
  constructor(public navCtrl: NavController,public menu: MenuController, public navParams: NavParams,public sharS:ShareService,public sqlS:SqlServices,public appComM:appCommonMethods,public alertCtrl:AlertController,private appCom:appCommonMethods) {
    
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcActivateSphListPage');
    this.initDataList();
  }

  initDataList(){
      let query="SELECT * FROM user_data where role='$sph'";
      this.busy=this.sqlS.queryExecuteSql(query,[]).then((reslData:any)=>{
        this.userListDataArrs=[];
        for(let i=0;i<reslData.rows.length;i++){
          let tempCurObj=reslData.rows.item(i);
          this.userListDataArrs.push(tempCurObj);
        }
        this.userListDataArrsAll=this.userListDataArrs;
        console.log('this.userListDataArrs', this.userListDataArrs);
      },(error)=>{
        console.log('ActivateSphListPage error sql ',error);
      });
  }

  searchUser(ev){
        let val = ev.target.value;
        this.userListDataArrs=this.userListDataArrsAll;
        if (val && val.trim() != '') {
            this.userListDataArrs = this.userListDataArrs.filter((item) => {
                return (item['name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
  }

 selectUserF(uDataCurr){
    console.log('uDataCurr',uDataCurr);

     this.ActiveSelctUserData=uDataCurr;
  }

async activateSph(){
    console.log('activateSph',this.ActiveSelctUserData);
    if(!globalInternetCheckConnection){
      this.appComM.showAlert(ALL_MESSAGE.COMMON_MESSAGE.NO_INTERNET_MSG,"Ok","");
      return false;
    }

    if(this.selectedUserId>0){
        console.log('searchUserM',this.ActiveSelctUserData);
        this.activateSphPresentConfirm();
    }else{
      let titleOk = await this.appComM.getTranslatedTxt("Ok");
      let errorMessage = await this.appComM.getTranslatedTxt("Please select SPH");
      //let errorMessage='Please select SPH';
      let alert = this.alertCtrl.create({
        subTitle: errorMessage,
        enableBackdropDismiss:false,
        buttons: [{
          text: titleOk,
          handler: () => {
            console.log('Ok clicked');
              this.sphActivatedY();
          }
        }]
      });
      alert.present();

    }
  
  }


sphActivatedY(){
    return new Promise((resolve,reject)=>{
        console.log('sphActivatedY');
          
         let sphTblLists=SQL_QUERY.TABLE_TLH_SPH_LIST;
         if(sessionUserGlobalData['lastActUserId']==this.ActiveSelctUserData['uid']){
            sphTblLists=[];
         }

         async.each(sphTblLists,(sphTblList,callback)=>{
              let queryDel="DELETE FROM "+sphTblList;
              this.sqlS.queryExecuteSql(queryDel,[]).then((reslData:any)=>{
                  callback();
              },(err)=>{
                  callback();
              });
          },(error)=>{
              //resolve(true);
              this.sharS.setshareData('masterSync',true);
              this.appComM.getAppPreference("userCreds").then((uData:any)=>{
                  let tempUdata=uData;
                  tempUdata['lastActUserId']=this.ActiveSelctUserData['uid'];
                  this.appComM.storeAppPreference("userCredsTemp",tempUdata).then(()=>{
                    tempUdata['userIdG']=tempUdata['userId'];  
                    tempUdata['userId']=this.ActiveSelctUserData['uid'];  
                    tempUdata['activeUserName']=this.ActiveSelctUserData['name']; 
                      this.appComM.storeAppPreference("userCreds",tempUdata).then(()=>{
                        this.appComM.getAppPreference("userCreds").then((uuData:any)=>{
                              sessionUserGlobalData=uuData;
                              resolve(true);
                        },(errr)=>{
                              reject(false);
                        });
                      },(errrr)=>{
                            reject(false);
                      });
                     
                  },(errrr)=>{
                            reject(false);
                 });
                
              },(errr)=>{
                        reject(false);
               });
             
          });

    });
}
  
async activateSphScussesPresentAlert() {
 
    let titleOk = await this.appComM.getTranslatedTxt("Ok");
    let message = await this.appComM.getTranslatedTxt("You are now activated as SPH and can perform all activites on behalf of selected SPH. To deactivate go to menu and select deactivate.");
    //let message="You are now activated as SPH and can perform all activites on behalf of selected SPH. To deactivate go to menu and select deactivate.";
    let alert = this.alertCtrl.create({
      subTitle: message,
      enableBackdropDismiss:false,
      buttons: [{
        text: titleOk,
        handler: () => {
          console.log('Ok clicked');
            
        }
      }]
    });
    alert.present();
}

async activateSphFailedPresentAlert() {
    //let message="SPH Activate as SPH Failed. Please try agian later.";
    let titleOk = await this.appComM.getTranslatedTxt("Ok");
    let message = await this.appComM.getTranslatedTxt("SPH Activate as SPH Failed. Please try agian later.");
    let alert = this.alertCtrl.create({
      subTitle: message,
      enableBackdropDismiss:false,
      buttons: [{
        text: titleOk,
        handler: () => {
          console.log('Ok clicked');
            
        }
      }]
    });
    alert.present();
}

async activateSphPresentConfirm() {
  let titleYes = await this.appComM.getTranslatedTxt("Yes");
  let subTitle = await this.appComM.getTranslatedTxt("Are you sure you want to activate as SPH?");
  let titleCancel = await this.appComM.getTranslatedTxt("Cancel");
  let alert = this.alertCtrl.create({
    subTitle: subTitle,
    enableBackdropDismiss:false,
    buttons: [
      {
        text:titleYes,
        handler: () => {
          console.log('Yes clicked');
          //this.activateSphPresentAlert();
          this.busy=this.sphActivatedY().then(()=>{
              this.busy=this.navCtrl.setRoot(HomePage,{}).then(()=>{
                  let menuName="acSphMainMenu";
                  this.menu.enable(false);
                  this.menu.enable(true,menuName);
                  this.activateSphScussesPresentAlert();
              });
          },()=>{
              this.activateSphFailedPresentAlert();
          }); 
        }
      },
      {
        text: titleCancel,
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
    ]
  });
  alert.present();
}

}
