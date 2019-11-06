import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, Events } from 'ionic-angular';
import { App_loginApi, App_hpbApi, LoopBackAuth,RewardApi,App_product_receipt,WishApi,RewardClaimApi,App_product_receiptApi }  from '../../../shared/loopback_sdk';

import {Subscription} from 'rxjs';
import { ShareService } from '../../../providers/ShareService';
import { ALL_MESSAGE } from '../../../providers/constant';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { MasonRedeemInvoicePage } from '../redeem-invoice/redeem-invoice';

import { SITE_API, } from "../../../providers/constant";

/**
 * Generated class for the RedeemListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-redeem-list',
  templateUrl: 'redeem-list.html',
})
export class MasonRedeemListPage {
  netCon:any;
  userName:any;
  busyMessage:any;
  busy:Subscription;
  rewardList:any = [];
  total:number = 0;
  dataLen:number = 0;
  limit:number = 6;
  dataLoadCompleted:boolean = false;
  selectedProducts:any = [];
  redeemDisabled:boolean = true;
  totalPoints:number = 0;
  length:number = 0;
  uid:any;
  hpbId:any;
  alert:any;
  pointsRedeemed:number = 0;
  page:number = 0;
  container:any;
  constructor(private events:Events,private rewardClaim:RewardClaimApi,private alertCtrl: AlertController,public app: App,private rewardApi:RewardApi,public productRecipt: App_product_receiptApi,private rewardClaimApi:RewardClaimApi,private navCtrl: NavController, private navParams: NavParams,private shareS:ShareService,private appCom:appCommonMethods,private wish:WishApi) {
      //this.loadUserPoints();      
    this.events.subscribe('refreshRedeem', () => {
        this.ionViewDidEnter();
    })
  }

  async ionViewDidEnter() {
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");      
    this.container = SITE_API.CONTAINER;
    this.netCon = this.shareS.getshareData('netConnection');
    this.length = 0;
    this.total = 0;  
    this.dataLen = 0;
    this.limit = 6;
    this.page = 0;
    this.dataLoadCompleted = false;
    this.selectedProducts = [];
    this.rewardList = [];
    this.totalPoints = 0;
    this.pointsRedeemed = 0;
    this.redeemDisabled = true;
    
    if(this.shareS.getshareData('redeem_hpbId')){
        this.hpbId = this.shareS.getshareData('redeem_hpbId');
        console.log(" this.hpbId ",this.hpbId);
    }

    this.appCom.getAppPreference("userCreds").then((resDataU)=>{
      console.log(" resDataU ---------- ",resDataU);
      if(!this.hpbId){
        if(typeof resDataU.user.userinfohpb !== 'undefined'){
            this.hpbId = resDataU.user.userinfohpb[0].hpb_id;
        }
      }

      this.uid = resDataU.userId;
      this.userName = resDataU.user.realm;
        this.productRecipt.getProductReceipt(null, this.hpbId).subscribe(resData => {
            
            /*let x;
            for (x in resData.result) {
              resData.result[x].created_date = this.appCom.timeStampToDate(resData.result[x].created_date);
              console.log(" total points cal ",resData.result[x].points,this.totalPoints);
              if(typeof resData.result[x].points != 'undefined' && resData.result[x].points != 'undefined' && resData.result[x].points != null && resData.result[x].points != ''){
                  this.totalPoints = this.totalPoints + parseInt(resData.result[x].points);
              }
            }*/

            for(let i = 0;i<resData.result.length;i++){
                resData.result[i].created_date = this.appCom.timeStampToDate(resData.result[i].created_date);
                if(typeof resData.result[i].points != 'undefined' && resData.result[i].points != 'undefined' && resData.result[i].points != null && resData.result[i].points != ''){
                    this.totalPoints = this.totalPoints + parseInt(resData.result[i].points);
                }
            }
            console.log(" this.totalPoints ",this.totalPoints)

            this.rewardClaim.getRedeemHistory(null,this.hpbId).subscribe((resData)=>{
                /*let j;
                for (j in resData.result) {
                    this.pointsRedeemed = this.pointsRedeemed + resData.result[j].points_redeemed;
                }*/
                console.log(" resData.result[0] ",resData.result[0]);
                if(typeof(resData.result[0]) != 'undefined' && typeof(resData.result[0].totalpoints) != 'undefined'){
                    let redeemedtotalPoints = resData.result[0].totalpoints;
                    this.totalPoints = this.totalPoints - redeemedtotalPoints;
                }
                        
                this.loadData();
                
                console.log(' this.pointsRedeemed History ',this.pointsRedeemed,this.totalPoints);
            },(error)=>{
                this.loadData();
                console.log('error',error);
            });
            
          },
          error => {
            console.log("error", error);
          }
        );
    },(err)=>{
        console.log('err ref',err);
    });
    
    
  }

  loadData(){
    if(this.netCon){

        this.busy = this.rewardApi.getRewards(null,null,null,null,null,null,null,null,this.limit,this.page).subscribe((resData)=>{
                let x;
                this.dataLen = resData.result.length;
                this.page++;
            
                for (let i=0;i<resData.result.length;i++) {
                    resData.result[i].selected = false;
                    resData.result[i].created_date = this.appCom.timeStampToDate(resData.result[i].created_date);
                    this.total = this.total + resData.result[i].points;
                    
                    this.rewardList.push(resData.result[i]);
                }
                if(this.dataLen < this.limit){
                    this.dataLoadCompleted = true;
                }
                console.log(' rewardList ',this.rewardList);
          },(error)=>{
              console.log('error',error);
          }); 
        
      }
  }

  redeem(i){
      console.log("this.totalPoints ---",this.totalPoints);
      if(this.selectedProducts.length > 0){
          this.app.getRootNav().push(MasonRedeemInvoicePage, {
            selectedProducts: this.selectedProducts,
            hpb_id: this.hpbId,
            uid:this.uid,
            remainingPoints:this.totalPoints
          });
      }
  }

  selectProduct(index){
    //alert(index);
    if(this.totalPoints >= this.rewardList[index].points){
      this.rewardList[index].selected = true;
      this.selectedProducts.push(this.rewardList[index]);
      this.redeemDisabled = false;

      let productPoints = (this.rewardList[index].promo_points) ? this.rewardList[index].promo_points : this.rewardList[index].points;
      this.totalPoints = this.totalPoints - productPoints;
      console.log("this.selectedProducts",this.selectedProducts);
    }else{
      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INSUFFICIENT_POINTS,'Ok',null);
    }
  }

  removeProduct(index,rowId){
    let x;
    for (x in this.selectedProducts) {
        if(this.selectedProducts[x].id == rowId){
            this.selectedProducts[x].selected = false;
            let productPoints = (this.rewardList[index].promo_points) ? this.rewardList[index].promo_points : this.rewardList[index].points;
            this.totalPoints = this.totalPoints + productPoints;
            this.selectedProducts.splice(x, 1);
        }
    }
    if(this.selectedProducts.length == 0){
      this.redeemDisabled = true;
    }
    console.log("after remove this.selectedProducts",this.selectedProducts);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if(this.dataLen < this.limit){
        this.dataLoadCompleted = true;
      }else{
        this.loadData();
      } 
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

 async showWishModal(){
      let title = await this.appCom.getTranslatedTxt("Write your wish here"); 
      let titlePlaceHolder = await this.appCom.getTranslatedTxt("Eg:Mobile");  
      let titleSubmit = await this.appCom.getTranslatedTxt("Submit");  
      let titleCancel = await this.appCom.getTranslatedTxt("Cancel");
      //this.appCom.showPrompt('WRITE YOUR WISH HERE','I wish','Submit',null).;
        this.alert = this.alertCtrl.create({
            cssClass: 'prompt',
            title: title,
            enableBackdropDismiss:false,
            inputs: [
                {
                    name: 'I wish',
                    placeholder: titlePlaceHolder
                }
            ],
            buttons: [
                {
                    text: titleSubmit,
                    handler: data => {
                        console.log(" data wish ",data['I wish']);
                        if (data['I wish'] && data['I wish'].trim().length > 0) {
                            let wish = data['I wish'].trim();
                            if(isNaN(wish)){
                                let createdDate = this.appCom.getCurrentTimeStamp();
                                this.wish.create({"description": data['I wish'],"created_by": this.uid,"created_date":createdDate}).subscribe(resData => {
                                    this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.WISH_SUCCESSFULLY_SUBMITTED,'OK',null);
                                });                                
                            }else{
                                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.PLEASE_ADD_CORRECT_WISH,'Ok',null);
                            }
                        } else {
                            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.PLEASE_ADD_YOUR_WISH,'Ok',null);
                            return false;
                        }
                    }
                },{
                    text: titleCancel,
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        this.alert.present();
  }

  ionViewWillLeave() {
    if(this.alert){
        this.alert.dismiss();
    }
  }

}