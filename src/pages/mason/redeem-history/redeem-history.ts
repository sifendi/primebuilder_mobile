import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App_loginApi, App_hpbApi, LoopBackAuth,RewardApi,RewardClaimApi }  from '../../../shared/loopback_sdk';

import {Subscription} from 'rxjs';
import { ShareService } from '../../../providers/ShareService';
import { appCommonMethods } from '../../../providers/appCommonMethods';

import * as moment from 'moment';
import { ALL_MESSAGE } from "../../../providers/constant";
/**
 * Generated class for the RedeemHistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-redeem-history',
  templateUrl: 'redeem-history.html',
})
export class MasonRedeemHistoryPage {
  netCon:any;
  userName:any;
  busyMessage:any;
  busy:Subscription;
  receipts:any = [];
  hpbId:any;
  limit:number = 10;
  page:number = 0;
  datalen:any;
  dataLoadCompleted:boolean = false;
  totalPoints:number = 0;
  constructor(private rewardClaim:RewardClaimApi, public rewardApi:RewardApi,public navCtrl: NavController, public navParams: NavParams,public shareS:ShareService,public appCom:appCommonMethods) {}

    async ionViewDidEnter() {
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");    
        this.limit = 10;
        this.page = 0;
        this.datalen = 0;
        this.receipts = [];
        this.netCon = this.shareS.getshareData('netConnection');
        
        if(this.netCon){

            if(this.shareS.getshareData('redeem_hpbId')){
                this.hpbId = this.shareS.getshareData('redeem_hpbId');
            }

          this.appCom.getAppPreference("userCreds").then((resDataU)=>{
              //console.log(" resDataU ",resDataU);
              this.userName = resDataU.user.realm;
              if(!this.hpbId){
                if(typeof resDataU.user.userinfohpb !== 'undefined'){
                    this.hpbId = resDataU.user.userinfohpb[0].hpb_id;
                }
              }
              
              this.loadData();
          },(err)=>{
              console.log('err ref',err);
          });
        }
    }

    loadData(){
       
        this.busy=this.rewardClaim.getRedeemHistory(null,this.hpbId,null,null,null,null,this.limit,this.page).subscribe((resData)=>{
            if(typeof(resData.result[0]) != 'undefined'){
                this.totalPoints = resData.result[0].totalpoints;
                this.datalen = resData.result.length;
                this.page++;
                for (let i=0;i<resData.result.length;i++) {
                    resData.result[i].created_date = this.appCom.timeStampToDate(resData.result[i].created_date);
                    this.receipts.push(resData.result[i]);
                }
                console.log(' getProductReceipt History ',this.receipts);
                
            }
        },(error)=>{
            console.log('error',error);
        });
    }

    doInfinite(infiniteScroll) {
      console.log('Begin async operation');

      setTimeout(() => {
        if(this.datalen < this.limit){
            this.dataLoadCompleted = true;
        }else{
            this.loadData();
        }
        console.log('Async operation has ended');
        infiniteScroll.complete();
      }, 500);
    }

}
