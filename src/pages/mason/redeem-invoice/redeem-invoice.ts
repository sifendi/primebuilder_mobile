import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Events } from 'ionic-angular';
import { RewardClaimApi,App_product_receiptApi }  from '../../../shared/loopback_sdk';

import { appCommonMethods } from '../../../providers/appCommonMethods';

import { Subscription } from 'rxjs';
import { SITE_API } from "../../../providers/constant";

declare var sessionUserGlobalData;
/**
 * Generated class for the RedeemInvoicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-redeem-invoice',
  templateUrl: 'redeem-invoice.html',
})
export class MasonRedeemInvoicePage {
  selectedProducts:any = [];
  busyMessage:any;
  busy:Subscription;
  hpb_id:any;
  uid:any;
  totalPointsUsed:number = 0;
  remainingPoints:number = 0;
  currUserRole:any;
  termsFlag:any = {};
  redeemDisabled:boolean = false;
  constructor(private events:Events,private alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams,private appCom:appCommonMethods,private rewardClaimApi:RewardClaimApi) {}

  ionViewDidEnter() {
    this.totalPointsUsed = 0;
    this.selectedProducts = this.navParams.get('selectedProducts');
    this.hpb_id = this.navParams.get('hpb_id');
    this.uid = this.navParams.get('uid');
    this.remainingPoints = this.navParams.get('remainingPoints');

    this.currUserRole = sessionUserGlobalData.user.roles[0].name;

    if(this.currUserRole == '$sph'){
        this.termsFlag.checked = false;
        this.redeemDisabled = true;
    }

    console.log(' params ',this.selectedProducts,this.hpb_id,this.uid);
    
    for(let i = 0;i<this.selectedProducts.length;i++){
      let points = (this.selectedProducts[i].promo_points) ? this.selectedProducts[i].promo_points:this.selectedProducts[i].points;
      this.totalPointsUsed = this.totalPointsUsed + points;
    }
  }

  terms(){
        console.log("this.termsFlag", this.termsFlag);
        if(this.termsFlag.checked){
            this.redeemDisabled = false;
        }else{
            this.redeemDisabled = true;
        }
  }

 async confirmRedeem(i){
    let title = await this.appCom.getTranslatedTxt("Are you sure you want to Redeem this Reward ?");
    let titleCancel = await this.appCom.getTranslatedTxt("Cancel");
    let titleConfirm = await this.appCom.getTranslatedTxt("Confirm");
    let alertVarRedeem = this.alertCtrl.create({
        cssClass: 'confirm', 
        title: title,
        enableBackdropDismiss:false,
        buttons: [{text:titleConfirm,
                    role:'null',
                        handler: () => {
                            this.redeem(i);
                        }
                    },{
                        text: titleCancel,
                        role: 'cancel',
                        handler: () => {
                        console.log('Cancel clicked');
                        }
                    }],
        });
        alertVarRedeem.present();
  }

    async redeem(i){
      let title = await this.appCom.getTranslatedTxt("Redeem request submitted successfully"); 
      let titleOk = await this.appCom.getTranslatedTxt("Ok");  
      if(this.selectedProducts.length > 0){
          if(typeof this.selectedProducts[i] == 'undefined'){
              //this.navCtrl.push();
              let alertVar = this.alertCtrl.create({
                  cssClass: 'confirm', 
                  title: title,
                  enableBackdropDismiss:false,
                  buttons: [{text:titleOk,
                              role:'null',
                                  handler: () => {
                                      this.events.publish('refreshRedeem');
                                      this.navCtrl.pop();
                                  }
                              }]
                  });
              alertVar.present();
              
              return false;
          }

          let rewardId = this.selectedProducts[i].id;
          let promoId = (this.selectedProducts[i].promo_id) ? this.selectedProducts[i].promo_id : null;
          let redeemedPoints = (this.selectedProducts[i].promo_points) ? this.selectedProducts[i].promo_points : this.selectedProducts[i].points;
          let created_date = this.appCom.getCurrentTimeStamp();

          //rewardId,promoId,this.hpb_id,redeemedPoints,this.uid,created_date

            let dataObj = {
                "promo_id":promoId,
                "hpb_id":this.hpb_id,
                "reward_id":rewardId,
                "points_redeemed":redeemedPoints,
                "created_by":this.uid,
                "created_date":created_date
            };

            this.busy=this.rewardClaimApi.redeemPoints(dataObj).subscribe((resData)=>{
                console.log(" reward claim info ",resData);
                i++;
                this.redeem(i);
            },(error)=>{
                i++;
                this.redeem(i);
                console.log('error',error);
            });
      }
  }

  cancel(){
      this.navCtrl.pop();
  }

  openRedeemTC(){
    this.appCom.openTNC(SITE_API.REDEEMTNC);
  }

}
