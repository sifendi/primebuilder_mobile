import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { ALL_MESSAGE } from '../../providers/constant';
import { SqlServices } from '../../providers/sqlService';
import { ShareService } from "../../providers/ShareService";
import * as moment from 'moment';
import async from 'async'; 

@Component({
  selector: 'page-maintain',
  templateUrl: 'maintain.html',
})
export class MaintainPage {
  maintainTodayTarget:any=0;
  maintainTodayAchievementTarget:any=0;
  maintainTodayTargetAchievPerc:any=0;
  maintainMonthlyTarget:any=0;
  maintainMonthlyCurrentTarget:any=0;
  maintainMonthlyTargetAchievPerc:any=0;
  currentUserData={};
  achieved_target:any=0;
  estimatedTarget:any=0;
  todayActualPerc:any=0;
  constructor(private events:Events,private shareS:ShareService,private sqlS:SqlServices,public navCtrl: NavController, public navParams: NavParams) {
      this.currentUserData=this.shareS.getshareData('currSessionUserData');
       events.subscribe('refreshSphStats', () => {
            this.ionViewDidEnter();
        })
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad MaintainPage');
      this.maintainTodayTarget=0;
      this.maintainMonthlyTarget=0;
      this.maintainTodayAchievementTarget = 0;

      let currDateMonth = parseInt(moment().format("MM").toString()); 
      let currDateYear = parseInt(moment().format("YYYY").toString()); 
      let currDate = moment().format("YYYY-MM-DD").toString(); 
 
      console.log('currDate',currDateMonth);
      console.log('currDate',currDateYear);
      let lableVal='cement_vol_maintain';
      let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;
    
      let queryHomeStats = "select * from home_stats where target_for = 'cement_vol_maintain' and date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"')";
      console.log(" home_stats --",queryHomeStats);
      this.sqlS.selectTableQueryData(queryHomeStats,[]).then((ressqlData:any)=>{
            for(let i=0;i<ressqlData.rows.length;i++){
                  console.log("ressqlData ----",ressqlData.rows.item(i));
                  if(ressqlData.rows.item(i).target_for == 'cement_vol_maintain'){
                      this.maintainTodayTarget = (isNaN(ressqlData.rows.item(i).todays_target)) ? 0: ressqlData.rows.item(i).todays_target;
                      this.maintainTodayAchievementTarget = (isNaN(ressqlData.rows.item(i).todays_achievement)) ? 0: ressqlData.rows.item(i).todays_achievement;
                      this.maintainMonthlyTarget = (isNaN(ressqlData.rows.item(i).monthly_target)) ? 0: ressqlData.rows.item(i).monthly_target;
                      this.achieved_target = (isNaN(ressqlData.rows.item(i).achieved_target)) ? 0: ressqlData.rows.item(i).achieved_target;
                      this.estimatedTarget = (isNaN(ressqlData.rows.item(i).estimated_target)) ? 0: ressqlData.rows.item(i).estimated_target;
                    
                        if(this.achieved_target != null && this.maintainMonthlyTarget != null){
                            this.maintainMonthlyTargetAchievPerc = Math.ceil((( this.achieved_target/this.maintainMonthlyTarget ) * 100));
                            if(isFinite(this.maintainMonthlyTargetAchievPerc) == false){
                                this.maintainMonthlyTargetAchievPerc = 0;
                            }
                            if(this.maintainMonthlyTargetAchievPerc > 999){
                                this.maintainMonthlyTargetAchievPerc = 999;
                            }else if(this.maintainMonthlyTargetAchievPerc < 0){
                                this.maintainMonthlyTargetAchievPerc = 0;
                            }
                        }
                        let remainingDays = moment().daysInMonth();
                        let currentDay:any = moment().format('D');
                        
                        console.log("reminingDays",remainingDays,"currentDay",currentDay);
                        this.todayActualPerc = Math.ceil((currentDay/(remainingDays))*100);
                        console.log("todayActualPerc",this.todayActualPerc);

                        if(this.maintainTodayTarget != null && this.maintainTodayAchievementTarget != null){
                            this.maintainTodayTargetAchievPerc = Math.ceil((( this.maintainTodayAchievementTarget/this.maintainTodayTarget ) * 100));
                            if(isFinite(this.maintainTodayTargetAchievPerc) == false){
                                this.maintainTodayTargetAchievPerc = 0;
                            }
                            if(this.maintainTodayTargetAchievPerc > 999){
                                this.maintainTodayTargetAchievPerc = 999;
                            }else if(this.maintainTodayTargetAchievPerc < 0){
                                this.maintainTodayTargetAchievPerc = 0;
                            }
                        }
                  }
            }
      });

  }

}
