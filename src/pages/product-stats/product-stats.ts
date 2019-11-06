import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { SqlServices } from '../../providers/sqlService';
import { ShareService } from "../../providers/ShareService";
import * as moment from 'moment';

/**
 * Generated class for the ProductStatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-product-stats',
  templateUrl: 'product-stats.html',
})
export class ProductStatsPage {
  busy:any;
  currentUserData={};
  prodArrObj:any = [];
  constructor(private events:Events,private shareS:ShareService,private sqlS:SqlServices,public navCtrl: NavController, public navParams: NavParams) {
    this.currentUserData=this.shareS.getshareData('currSessionUserData');
    events.subscribe('refreshSphStats', () => {
        this.ionViewDidEnter();
    })
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ProductStatsPage');
    this.prodArrObj = [];

    let currDateMonth = parseInt(moment().format("MM").toString()); 
    let currDateYear = parseInt(moment().format("YYYY").toString()); 
    let currDate = moment().format("YYYY-MM-DD").toString();
    
    let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;
    let dataArr=[];

    let queryProductStats = "select * from home_stats where target_for NOT IN ('srku_vol','srku_label','new_switching_hpb','cement_vol_switching','srku_house_num','cement_volume_maintain','cement_vol_maintain') and date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"')";
    console.log(" Product_stats query  --",queryProductStats);
    this.busy = this.sqlS.selectTableQueryData(queryProductStats,dataArr).then((ressqlData:any)=>{
      if(ressqlData && ressqlData.rows.length>0){
        for(let i=0;i<ressqlData.rows.length;i++){
          this.prodArrObj[i] = {};
          this.prodArrObj[i]['target_for'] = (!(ressqlData.rows.item(i).target_for))?0:((ressqlData.rows.item(i).target_for).charAt(0).toUpperCase()+(ressqlData.rows.item(i).target_for).slice(1)).replace(/_/g, ' ');
          this.prodArrObj[i]['productsTodayTarget'] = (isNaN(ressqlData.rows.item(i).todays_target))?0:ressqlData.rows.item(i).todays_target;
          this.prodArrObj[i]['productsTodayAchievementTarget'] = (isNaN(ressqlData.rows.item(i).todays_achievement))?0:ressqlData.rows.item(i).todays_achievement;
          this.prodArrObj[i]['productsMonthlyTarget'] = (isNaN(ressqlData.rows.item(i).monthly_target))?0:ressqlData.rows.item(i).monthly_target;
          this.prodArrObj[i]['achieved_target'] = (isNaN(ressqlData.rows.item(i).achieved_target))? 0:ressqlData.rows.item(i).achieved_target;
          this.prodArrObj[i]['estimatedTarget'] = (isNaN(ressqlData.rows.item(i).estimated_target)) ? 0:ressqlData.rows.item(i).estimated_target;
        
          if(this.prodArrObj[i]['achieved_target'] != null && this.prodArrObj[i]['productsMonthlyTarget'] != null){
            this.prodArrObj[i]['productsMonthlyTargetAchievPerc'] = Math.ceil(( this.prodArrObj[i]['achieved_target']/this.prodArrObj[i]['productsMonthlyTarget'] ) * 100);
            if(isFinite(this.prodArrObj[i]['productsMonthlyTargetAchievPerc']) == false){
              this.prodArrObj[i]['productsMonthlyTargetAchievPerc'] = 0;
            }
            if(this.prodArrObj[i]['productsMonthlyTargetAchievPerc'] > 999){
              this.prodArrObj[i]['productsMonthlyTargetAchievPerc'] = 999;
            }else if(this.prodArrObj[i]['productsMonthlyTargetAchievPerc'] < 0){
              this.prodArrObj[i]['productsMonthlyTargetAchievPerc'] = 0;
            }
          }

          let remainingDays = moment().daysInMonth();
          let currentDay:any = moment().format('D');

          console.log("reminingDays",remainingDays,"currentDay",currentDay);
          this.prodArrObj[i]['todayActualPerc'] = Math.ceil((currentDay/(remainingDays))*100);
          console.log("todayActualPerc",this.prodArrObj[i]['todayActualPerc']);

          if(this.prodArrObj[i]['productsTodayAchievementTarget'] != null && this.prodArrObj[i]['productsTodayTarget'] != null){
            this.prodArrObj[i]['productsTodayTargetAchievPerc'] = Math.ceil(( this.prodArrObj[i]['productsTodayAchievementTarget']/this.prodArrObj[i]['productsTodayTarget'] ) * 100);
            if(this.prodArrObj[i]['productsTodayTargetAchievPerc'] > 999){
                this.prodArrObj[i]['productsTodayTargetAchievPerc'] = 999;
            }
            if(isFinite(this.prodArrObj[i]['productsTodayTargetAchievPerc']) == false){
                this.prodArrObj[i]['productsTodayTargetAchievPerc'] = 0;
            }else if(this.prodArrObj[i]['productsTodayTargetAchievPerc'] < 0){
                this.prodArrObj[i]['productsTodayTargetAchievPerc'] = 0;
            }
          }
        }
      }else{
        
        this.prodArrObj = [];
      }
    });


  }

}
