import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ALL_MESSAGE } from '../../providers/constant';
import { SqlServices } from '../../providers/sqlService';
import { ShareService } from "../../providers/ShareService";
import * as moment from 'moment';
import async from 'async';

@Component({
  selector: 'page-switching',
  templateUrl: 'switching.html',
})
export class SwitchingPage {
  switchingTodayTarget:any=0;
  switchingTodayAchievementTarget:any=0;
  switchingTodayTargetAchievPerc=0;
  switchingMonthlyTarget:any=0;
  achieved_target:any=0;
  switchingMonthlyTargetAchievPerc:any=0;
  estimatedTarget:any=0;
  currentUserData={};
  todayActualPerc:any=0;
  constructor(private events:Events,private shareS:ShareService,private sqlS:SqlServices,public navCtrl: NavController, public navParams: NavParams) {
      this.currentUserData=this.shareS.getshareData('currSessionUserData');
        events.subscribe('refreshSphStats', () => {
            this.ionViewDidEnter();
        })
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad SwitchingPage');

    this.switchingMonthlyTarget=0;
    this.switchingTodayTarget=0;
    this.estimatedTarget = 0;
    this.switchingTodayAchievementTarget = 0;

      let currDateMonth = parseInt(moment().format("MM").toString()); 
      let currDateYear = parseInt(moment().format("YYYY").toString()); 
      let currDate = moment().format("YYYY-MM-DD").toString(); 
      console.log('currDate',currDateMonth);
      console.log('currDate',currDateYear);
      let lableVal='cement_vol_switching';
      let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;

      let queryHomeStats = "select * from home_stats where target_for = 'cement_vol_switching' and date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"')";
      console.log(" home_stats --",queryHomeStats);
      this.sqlS.selectTableQueryData(queryHomeStats,[]).then((ressqlData:any)=>{
            for(let i=0;i<ressqlData.rows.length;i++){
                  console.log("ressqlData ----",ressqlData.rows.item(i));
                  if(ressqlData.rows.item(i).target_for == 'cement_vol_switching'){
                      this.switchingTodayTarget = (isNaN(ressqlData.rows.item(i).todays_target)) ? 0: ressqlData.rows.item(i).todays_target;
                      this.switchingTodayAchievementTarget = (isNaN(ressqlData.rows.item(i).todays_achievement)) ? 0: ressqlData.rows.item(i).todays_achievement;
                      this.switchingMonthlyTarget = (isNaN(ressqlData.rows.item(i).monthly_target)) ? 0: ressqlData.rows.item(i).monthly_target;
                      this.achieved_target = (isNaN(ressqlData.rows.item(i).achieved_target)) ? 0: ressqlData.rows.item(i).achieved_target;
                      this.estimatedTarget = (isNaN(ressqlData.rows.item(i).estimated_target)) ? 0: ressqlData.rows.item(i).estimated_target;

                        if(this.achieved_target != null && this.switchingMonthlyTarget != null){
                            this.switchingMonthlyTargetAchievPerc = Math.ceil((( this.achieved_target/this.switchingMonthlyTarget ) * 100));
                            if(isFinite(this.switchingMonthlyTargetAchievPerc) == false){
                                this.switchingMonthlyTargetAchievPerc = 0;
                            }
                            if(this.switchingMonthlyTargetAchievPerc > 999){
                                this.switchingMonthlyTargetAchievPerc = 999;
                            }else if(this.switchingMonthlyTargetAchievPerc < 0){
                                this.switchingMonthlyTargetAchievPerc = 0;
                            }
                        }
                        let remainingDays = moment().daysInMonth();
                        let currentDay:any = moment().format('D');
                        
                        console.log("reminingDays",remainingDays,"currentDay",currentDay);
                        this.todayActualPerc = Math.ceil((currentDay/(remainingDays))*100);
                        console.log("todayActualPerc",this.todayActualPerc);

                        if(this.switchingTodayTarget != null && this.switchingTodayAchievementTarget != null){
                            this.switchingTodayTargetAchievPerc = Math.ceil((( this.switchingTodayAchievementTarget/this.switchingTodayTarget ) * 100));
                            if(isFinite(this.switchingTodayTargetAchievPerc) == false){
                                this.switchingTodayTargetAchievPerc = 0;
                            }
                            if(this.switchingTodayTargetAchievPerc > 999){
                                this.switchingTodayTargetAchievPerc = 999;
                            }else if(this.switchingTodayTargetAchievPerc < 0){
                                this.switchingTodayTargetAchievPerc = 0;
                            }
                        }
                  }
            }
      });
      
      }

}
