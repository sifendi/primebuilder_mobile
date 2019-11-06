import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ALL_MESSAGE } from '../../providers/constant';
import { SqlServices } from '../../providers/sqlService';
import { ShareService } from "../../providers/ShareService";
import * as moment from 'moment';
import async from 'async'; 

@Component({
  selector: 'page-srku',
  templateUrl: 'srku.html',
})
export class SrkuPage {
  srkuTodayTarget:any=0;
  srkuTodayAchievementTarget:any=0;
  srkuTodayTargetAchievPerc:any=0;
  srkuMonthlyTarget:any=0;
  achieved_target:any=0;
  srkuMonthlyCurrentTarget:any=0;
  srkuMonthlyTargetAchievPerc:any=0;
  currentUserData={};
  percentageAchie:any = 0;
  estimatedTarget:any;
  todayActualPerc:any=0;
  monthlyActualPerc:any=0;

  constructor(private events:Events,private shareS:ShareService,private sqlS:SqlServices,public navCtrl: NavController, public navParams: NavParams) {
      this.currentUserData=this.shareS.getshareData('currSessionUserData');
        events.subscribe('refreshSphStats', () => {
            this.ionViewDidEnter();
        })
  }

  ionViewDidEnter() {
      console.log('ionViewDidLoad SrkuPage');
      this.srkuMonthlyTarget=0;
      this.srkuTodayTarget=0;
      this.achieved_target = 0;
      this.percentageAchie = 0;
      this.srkuTodayAchievementTarget = 0;
      this.estimatedTarget = 0;

      let currDateMonth = parseInt(moment().format("MM").toString()); 
      let currDateYear = parseInt(moment().format("YYYY").toString()); 
      let currDate = moment().format("YYYY-MM-DD").toString(); 
      let lableVal='srku_vol';
      let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;
      //let queryAll = "select sum(target_value) as 'Total' from monthly_actual_target where target_month="+currDateMonth+" and target_year="+currDateYear+" and target_label='"+lableVal+"' and status=1 and sph_id="+currSphId+"";
      let dataArr=[];
      //console.log("queryAll monthly----",queryAll);
      

      let queryHomeStats = "select * from home_stats where target_for = 'srku_vol' and date(datetime(stats_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"')";
      console.log(" home_stats srku --",queryHomeStats);
      this.sqlS.selectTableQueryData(queryHomeStats,dataArr).then((ressqlData:any)=>{
            for(let i=0;i<ressqlData.rows.length;i++){
                  console.log("ressqlData ----",ressqlData.rows.item(i));
                  if(ressqlData.rows.item(i).target_for == 'srku_vol'){
                        this.srkuTodayTarget = (isNaN(ressqlData.rows.item(i).todays_target))?0:ressqlData.rows.item(i).todays_target;
                        this.srkuTodayAchievementTarget = (isNaN(ressqlData.rows.item(i).todays_achievement))?0:ressqlData.rows.item(i).todays_achievement;
                        this.srkuMonthlyTarget = (isNaN(ressqlData.rows.item(i).monthly_target))?0:ressqlData.rows.item(i).monthly_target;
                        this.achieved_target = (isNaN(ressqlData.rows.item(i).achieved_target))? 0:ressqlData.rows.item(i).achieved_target;
                        this.estimatedTarget = (isNaN(ressqlData.rows.item(i).estimated_target)) ? 0:ressqlData.rows.item(i).estimated_target;

                        if(this.achieved_target != null && this.srkuMonthlyTarget != null){
                            this.srkuMonthlyTargetAchievPerc = Math.ceil(( this.achieved_target/this.srkuMonthlyTarget ) * 100);
                            if(isFinite(this.srkuMonthlyTargetAchievPerc) == false){
                                this.srkuMonthlyTargetAchievPerc = 0;
                            }
                            if(this.srkuMonthlyTargetAchievPerc > 999){
                                this.srkuMonthlyTargetAchievPerc = 999;
                            }else if(this.srkuMonthlyTargetAchievPerc < 0){
                                this.srkuMonthlyTargetAchievPerc = 0;
                            }
                        }
                        let remainingDays = moment().daysInMonth();
                        let currentDay:any = moment().format('D');
                        
                        console.log("reminingDays",remainingDays,"currentDay",currentDay);
                        this.todayActualPerc = Math.ceil((currentDay/(remainingDays))*100);
                        console.log("todayActualPerc",this.todayActualPerc);
                        
                        if(this.srkuTodayAchievementTarget != null && this.srkuTodayTarget != null){
                            this.srkuTodayTargetAchievPerc = Math.ceil(( this.srkuTodayAchievementTarget/this.srkuTodayTarget ) * 100);
                            if(this.srkuTodayTargetAchievPerc > 999){
                                this.srkuTodayTargetAchievPerc = 999;
                            }
                            if(isFinite(this.srkuTodayTargetAchievPerc) == false){
                                this.srkuTodayTargetAchievPerc = 0;
                            }else if(this.srkuTodayTargetAchievPerc < 0){
                                this.srkuTodayTargetAchievPerc = 0;
                            }
                        }
                  }
            }
      });
      
  }

}
