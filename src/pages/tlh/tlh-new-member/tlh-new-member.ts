import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ALL_MESSAGE } from '../../../providers/constant';
import { SqlServices } from '../../../providers/sqlService';
import { ShareService } from "../../../providers/ShareService";
import * as moment from 'moment';
import async from 'async'; 
declare var selectedDistrict;

@Component({
  selector: 'page-new-member',
  templateUrl: 'tlh-new-member.html',
})
export class tlhNewMemberPage {
    srkuTodayTarget:any=0;
  srkuTodayAchievementTarget:any=0;
  srkuTodayTargetAchievPerc=0;
  srkuMonthlyTarget:any=0;
  achieved_target:any=0;
  srkuMonthlyCurrentTarget:any=0;
  srkuMonthlyTargetAchievPerc:any=0;
  currentUserData={};
  percentageAchie:any = 0;
  estimatedTarget:any;
  todayActualPerc:any =0;
  constructor(private events:Events,private shareS:ShareService,private sqlS:SqlServices,public navCtrl: NavController, public navParams: NavParams) {
    
    events.subscribe('refreshStats', () => {
        this.firstFunction();
    })
  }

    ionViewDidEnter(){
      let masterSync = this.shareS.getshareData('masterSync'); 
      console.log(" master sync status ionViewDidEnter tlh NewMemberPage",masterSync);
      if(!masterSync){
        this.firstFunction();      
      }
    }

  firstFunction() {
      this.currentUserData=this.shareS.getshareData('currSessionUserData');
      console.log('ionViewDidLoad tlh NewMemberPage');
    this.srkuMonthlyTarget=0;
      this.srkuTodayTarget=0;
      this.achieved_target = 0;
      this.percentageAchie = 0;
      this.srkuTodayAchievementTarget = 0;
      this.estimatedTarget = 0;


      let currDateMonth = parseInt(moment().format("MM").toString()); 
      let currDateYear = parseInt(moment().format("YYYY").toString());
      let currDate = moment().format("YYYY-MM-DD").toString(); 
 
      console.log('currDate',currDateMonth);
      console.log('currDate',currDateYear);
      let lableVal='new_switching_hpb';
      let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;

      let queryHomeStatsDist;
      if(selectedDistrict == 'all' || selectedDistrict == false){
        queryHomeStatsDist = "SELECT DISTINCT(uid) FROM user_data, json_tree(user_data.subdistrict) where role = '$sph'";
      }else if(isNaN(selectedDistrict) == false){
        queryHomeStatsDist = "SELECT DISTINCT(uid) FROM user_data, json_tree(user_data.subdistrict) where json_tree.key = 'id' and json_tree.value IN ("+selectedDistrict+") and role = '$sph'";    
      }
      
      this.sqlS.selectTableQueryData(queryHomeStatsDist,[]).then((ressqlDataN:any)=>{
            let sphIds:any = [];
            for(let j=0;j<ressqlDataN.rows.length;j++){
                sphIds.push(ressqlDataN.rows.item(j).uid);
                
                console.log(" sphIds ",sphIds,j,ressqlDataN.rows.length);
                if(j == ressqlDataN.rows.length-1){
                    sphIds = sphIds.join();

                    let queryHomeStats = "select * from home_stats_ac_tlh where target_for = 'new_switching_hpb' and sphid IN ("+sphIds+")";
                    console.log(" home_stats queryHomeStats --",queryHomeStats);
                    this.sqlS.selectTableQueryData(queryHomeStats,[]).then((ressqlData:any)=>{
                            let tempSrkuTodayT = 0;
                            let tempSrkuTodayA = 0;
                            let tempSrkuMonthlyT = 0;
                            let tempSrkuMonthlyA = 0;
                            let tempEstimatedT = 0;
                            for(let i=0;i<ressqlData.rows.length;i++){
                                console.log("ressqlData ----",ressqlData.rows.item(i));
                                console.log(" stats ",tempSrkuTodayT,tempSrkuTodayA,
                                tempSrkuMonthlyT,tempSrkuMonthlyA);
                                
                                tempSrkuTodayT = tempSrkuTodayT + ((isNaN(ressqlData.rows.item(i).todays_target))?0:ressqlData.rows.item(i).todays_target);
                                
                                tempSrkuTodayA = tempSrkuTodayA + ((isNaN(ressqlData.rows.item(i).todays_achievement))?0:ressqlData.rows.item(i).todays_achievement);
                                
                                tempSrkuMonthlyT = tempSrkuMonthlyT + ((isNaN(ressqlData.rows.item(i).monthly_target))?0:ressqlData.rows.item(i).monthly_target);
                                
                                tempSrkuMonthlyA = tempSrkuMonthlyA + ((isNaN(ressqlData.rows.item(i).achieved_target))? 0:ressqlData.rows.item(i).achieved_target);
                                
                                tempEstimatedT = tempEstimatedT + ((isNaN(ressqlData.rows.item(i).estimated_target)) ? 0: ressqlData.rows.item(i).estimated_target);

                                if(i == ressqlData.rows.length-1){
                                    
                                    this.srkuTodayTarget = Math.round(tempSrkuTodayT * 100)/100;
                                    this.srkuTodayAchievementTarget = Math.round(tempSrkuTodayA * 100)/100;
                                    this.srkuMonthlyTarget = Math.round(tempSrkuMonthlyT * 100)/100;
                                    this.achieved_target = Math.round(tempSrkuMonthlyA * 100)/100;
                                    this.estimatedTarget = Math.round(tempEstimatedT * 100)/100;

                                    if(this.achieved_target != null && this.srkuMonthlyTarget != null){
                                        this.srkuMonthlyTargetAchievPerc = Math.ceil((( this.achieved_target/this.srkuMonthlyTarget ) * 100));
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
                                        this.srkuTodayTargetAchievPerc = Math.ceil((( this.srkuTodayAchievementTarget/this.srkuTodayTarget ) * 100));
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
      });

  }

}
