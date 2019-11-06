import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ALL_MESSAGE } from '../../providers/constant';
import { SqlServices } from '../../providers/sqlService';
import { ShareService } from "../../providers/ShareService";
import * as moment from 'moment';
import async from 'async'; 

@Component({
  selector: 'page-new-member',
  templateUrl: 'new-member.html',
})
export class NewMemberPage {
  memberTodayTarget:any=0;
  memberTodayAchievementTarget:any=0;
  memberTodayTargetAchievPerc:any=0;
  memberMonthlyTarget:any=0;
  memberMonthlyCurrentTarget:any=0;
  memberMonthlyTargetAchievPerc:any=0;
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
      console.log('ionViewDidLoad NewMemberPage');
      this.memberTodayTarget=0;
      this.memberMonthlyTarget=0;
      this.memberMonthlyCurrentTarget = 0;

      let currDateMonth = parseInt(moment().format("MM").toString()); 
      let currDateYear = parseInt(moment().format("YYYY").toString());
      let currDate = moment().format("YYYY-MM-DD").toString(); 
 
      console.log('currDate',currDateMonth);
      console.log('currDate',currDateYear);
      let lableVal='new_switching_hpb';
      let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;
    

      let queryHomeStats = "select * from home_stats where target_for = 'new_switching_hpb' and date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"')";
      console.log(" home_stats --",queryHomeStats);
      this.sqlS.selectTableQueryData(queryHomeStats,[]).then((ressqlData:any)=>{
            for(let i=0;i<ressqlData.rows.length;i++){
                  console.log("ressqlData ----",ressqlData.rows.item(i));
                  if(ressqlData.rows.item(i).target_for == 'new_switching_hpb'){
                      this.memberTodayTarget = (isNaN(ressqlData.rows.item(i).todays_target)) ? 0: ressqlData.rows.item(i).todays_target;
                      this.memberMonthlyCurrentTarget = (isNaN(ressqlData.rows.item(i).todays_achievement)) ? 0: ressqlData.rows.item(i).todays_achievement;
                      this.memberMonthlyTarget = (isNaN(ressqlData.rows.item(i).monthly_target)) ? 0: ressqlData.rows.item(i).monthly_target;
                      this.achieved_target = (isNaN(ressqlData.rows.item(i).achieved_target)) ? 0: ressqlData.rows.item(i).achieved_target;
                      this.estimatedTarget = (isNaN(ressqlData.rows.item(i).estimated_target)) ? 0: ressqlData.rows.item(i).estimated_target;

                        if(this.achieved_target != null && this.memberMonthlyTarget != null){
                            this.memberMonthlyTargetAchievPerc = Math.ceil((( this.achieved_target/this.memberMonthlyTarget ) * 100));
                            console.log(" this.memberMonthlyTargetAchievPerc --- ",this.memberMonthlyTargetAchievPerc);
                            if(isFinite(this.memberMonthlyTargetAchievPerc) == false){
                                this.memberMonthlyTargetAchievPerc = 0;
                            }
                            if(this.memberMonthlyTargetAchievPerc > 999){
                                this.memberMonthlyTargetAchievPerc = 999;
                            }else if(this.memberMonthlyTargetAchievPerc < 0){
                                this.memberMonthlyTargetAchievPerc = 0;
                            }
                        }
                        let remainingDays = moment().daysInMonth();
                        let currentDay:any = moment().format('D');
                        
                        console.log("reminingDays",remainingDays,"currentDay",currentDay);
                        this.todayActualPerc = Math.ceil((currentDay/(remainingDays))*100);
                        console.log("todayActualPerc",this.todayActualPerc);


                        if(this.memberTodayTarget != null && this.memberMonthlyCurrentTarget != null){
                            this.memberTodayTargetAchievPerc = Math.ceil((( this.memberMonthlyCurrentTarget/this.memberTodayTarget ) * 100));
                            console.log(" this.memberTodayTargetAchievPerc --- ",this.memberTodayTargetAchievPerc);
                            if(isFinite(this.memberTodayTargetAchievPerc) == false){
                                this.memberTodayTargetAchievPerc = 0;
                            }
                            if(this.memberTodayTargetAchievPerc > 999){
                                this.memberTodayTargetAchievPerc = 999;
                            }else if(this.memberTodayTargetAchievPerc < 0){
                                this.memberTodayTargetAchievPerc = 0;
                            }
                        }
                      
                  }
            }
      });

  }

}
