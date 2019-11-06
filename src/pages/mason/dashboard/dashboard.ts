import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Events } from "ionic-angular";
import { App_loginApi,App_hpbApi,LoopBackAuth,RewardApi,App_product_receiptApi, RewardClaimApi } from "../../../shared/loopback_sdk";
import { Subscription } from "rxjs";
import { ShareService } from "../../../providers/ShareService";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { MasonRedeemTabPage } from "../mason-redeem-tab/mason-redeem-tab";
import { MasonReceiptListPage } from "../mason-receipt-list/mason-receipt-list";
import { ReceiptDetailPage } from "../receipt-detail/receipt-detail";
import { NotificationsTabPage } from '../../../pages/notification/notifications-tab/notifications-tab';

import { SITE_API, ALL_MESSAGE } from "../../../providers/constant";


@Component({
  selector: "page-dashboard",
  templateUrl: "dashboard.html"
})
export class MasonDashboardPage {
  netCon: any;
  busy: Subscription;
  busyMessage: any;
  userName: any;
  receiptList: any = [];
  uId: any;
  totalPoints: number;
  totalPointsCal: number;
  hpbId:any;
  pointsRedeemed:number = 0;
  disableBtn:boolean = true;
  proPic:any = '';
  currCcode:any='';
  notificationCtn=2;
  constructor(private rewardClaim:RewardClaimApi,public rewardApi: RewardApi,public productRecipt: App_product_receiptApi,public navCtrl: NavController,public navParams: NavParams,public shareS: ShareService,public appCom: appCommonMethods,public events: Events) {
    
  }

  async ionViewDidEnter() {
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");    
    this.receiptList = [];
    this.pointsRedeemed = 0;
    this.totalPointsCal = 0;
    this.netCon = this.shareS.getshareData("netConnection");

    if (this.netCon) {
      this.appCom.getAppPreference("userCreds").then(
        resDataU => {
          console.log(" resDataUser ",resDataU);
          this.userName = resDataU.user.realm;
          this.uId = resDataU.userId;
          this.hpbId = resDataU.user.userinfohpb[0].hpb_id;
          
          if(resDataU.user.userinfohpb[0].hpb_profile_pic != null){
            let tempObjPic = JSON.parse(resDataU.user.userinfohpb[0].hpb_profile_pic);
            this.proPic = SITE_API.CONTAINER+'profile/download/'+tempObjPic[0].name;
          }

          this.busy = this.productRecipt.getProductReceipt(null, this.hpbId).subscribe(resData => {
                /*let x;
                for (x in resData.result) {
                  resData.result[x].created_date = this.appCom.timeStampToDate(
                    resData.result[x].created_date
                  );
                  this.receiptList.push(resData.result[x]);
                  this.totalPointsCal = this.totalPointsCal + resData.result[x].points;
                }*/
                for(let i=0;i<resData.result.length;i++){
                  resData.result[i].created_date = this.appCom.timeStampToDate(
                    resData.result[i].created_date
                  );
                  this.receiptList.push(resData.result[i]);
                  this.totalPointsCal = this.totalPointsCal + resData.result[i].points;
                }

                this.rewardClaim.getRedeemHistory(null,this.hpbId,null,null,null,null,1,0).subscribe((resDataN)=>{
                    
                    if(typeof(resDataN.result[0]) != 'undefined'){
                        this.pointsRedeemed = resDataN.result[0].totalpoints;
                    }
                      
                    this.totalPointsCal = this.totalPointsCal - this.pointsRedeemed;
                    this.totalPoints = this.totalPointsCal;
                    if(this.totalPoints > 0){
                      this.disableBtn = false;
                    }
                    console.log(' this.pointsRedeemed History ',this.pointsRedeemed);
                },(error)=>{
                    console.log('error',error);
                });

                console.log("this.receiptList", this.receiptList);
              },
              error => {
                console.log("error", error);
              }
          );
        },
        err => {
          console.log("err ref", err);
        });
    }
  }

  

  redeemNow() {
    this.navCtrl.push(MasonRedeemTabPage);
  }

  viewReceiptList() {
    this.navCtrl.push(MasonReceiptListPage);
  }

  openReceipt(id){

    this.navCtrl.push(ReceiptDetailPage, {
      receiptId: id,
      hpbId: this.hpbId
    });
  }

  goToNotifyPage(){
    this.navCtrl.push(NotificationsTabPage);
  }

}
