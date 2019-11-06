import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ALL_MESSAGE } from '../../providers/constant';
import { SqlServices } from '../../providers/sqlService';
import { ShareService } from "../../providers/ShareService";
import { Monthly_statsApi   }  from '../../shared/loopback_sdk';
import * as moment from 'moment';
import async from 'async'; 
declare var selectedDistrict;

/**
 * Generated class for the ProductStatsAcTlhPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-product-stats-ac-tlh',
  templateUrl: 'product-stats-ac-tlh.html',
})
export class ProductStatsAcTlhPage {

  busy:any;
  currentUserData={};
  prodArrObj:any = [];
  tempProdArrObj:any = [];
  dist_subdist:any = '';
  constructor(private events:Events,private monthlyStats:Monthly_statsApi,private shareS:ShareService,private sqlS:SqlServices,public navCtrl: NavController, public navParams: NavParams) {
    this.currentUserData=this.shareS.getshareData('currSessionUserData');
    this.dist_subdist = this.navParams.get('dist_subdist');
    console.log("this.dist_subdist=>",this.dist_subdist);
    console.log("currentUserData=>",this.currentUserData);
    events.subscribe('refreshAcStats', () => {
       this.busy =  this.firstFunction();
    })
  }

  ionViewDidEnter(){
      let masterSync = this.shareS.getshareData('masterSync'); 
      console.log(" master sync status ionViewDidEnter ac ProductStatsAcTlhPage",masterSync);
      if(!masterSync){
          this.busy = this.firstFunction();      
      }
  }

  firstFunction() {
    return new Promise((resolve,reject)=>{
      console.log('ionViewDidEnter ProductStatsAcTlhPage');
      this.prodArrObj = [];
      this.tempProdArrObj = [];
      let target_for:any = [];
      this.monthlyStats.getDistinctTargetLabel().subscribe((resDatas)=>{
       console.log("resDatas['result'].length=>",resDatas['result']);
        for(let k = 0;k < resDatas['result'].length;k++){
          if(k>0){
            target_for += "','"+resDatas['result'][k]['target_for'];
          }else{
            target_for = resDatas['result'][k]['target_for'];
          }
        }
        console.log("target_for =>",target_for);
       
        let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;
        let dataArr=[];      
        let queryHomeStatsDist;
    
          if(selectedDistrict == 'all' || selectedDistrict == false){
            queryHomeStatsDist = "SELECT DISTINCT(uid) FROM user_data, json_tree("+this.dist_subdist+") where role = '$sph'";
          }else if(isNaN(selectedDistrict) == false){
            queryHomeStatsDist = "SELECT DISTINCT(uid) FROM user_data, json_tree("+this.dist_subdist+") where json_tree.key = 'id' and json_tree.value IN ("+selectedDistrict+") and role = '$sph'";    
          }
          
          this.sqlS.selectTableQueryData(queryHomeStatsDist,dataArr).then((ressqlDataN:any)=>{
                let sphIds:any = [];
                for(let j=0;j<ressqlDataN.rows.length;j++){
                    sphIds.push(ressqlDataN.rows.item(j).uid);
                    
                    console.log(" sphIds ",sphIds,j,ressqlDataN.rows.length);
                    if(j == ressqlDataN.rows.length-1){
                        sphIds = sphIds.join();
    
                        let queryHomeStats = "select * from home_stats_ac_tlh where target_for IN ('"+target_for+"') and sphid IN ("+sphIds+")";
                        console.log(" product_stats queryProductStats --",queryHomeStats);
                        this.sqlS.selectTableQueryData(queryHomeStats,dataArr).then((ressqlData:any)=>{
                                
                            for(let i=0;i<ressqlData.rows.length;i++){
                                console.log("ressqlData ----",ressqlData.rows.item(i));
                                if(!this.tempProdArrObj[ressqlData.rows.item(i).target_for]){
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for] = {};
    
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['target_for'] =  (!(ressqlData.rows.item(i).target_for)?0:ressqlData.rows.item(i).target_for);
    
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductTodayT'] =  ((isNaN(ressqlData.rows.item(i).todays_target))?0:ressqlData.rows.item(i).todays_target);
                                  
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductTodayA'] =  ((isNaN(ressqlData.rows.item(i).todays_achievement))?0:ressqlData.rows.item(i).todays_achievement);
                                  
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductMonthlyT'] = ((isNaN(ressqlData.rows.item(i).monthly_target))?0:ressqlData.rows.item(i).monthly_target);
                                  
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductMonthlyA'] = ((isNaN(ressqlData.rows.item(i).achieved_target))? 0:ressqlData.rows.item(i).achieved_target);
                                  
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempEstimatedT'] = ((isNaN(ressqlData.rows.item(i).estimated_target)) ? 0: ressqlData.rows.item(i).estimated_target);
                                }else{
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductTodayT'] = this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductTodayT'] + ((isNaN(ressqlData.rows.item(i).todays_target))?0:ressqlData.rows.item(i).todays_target);
                                  
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductTodayA'] = this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductTodayA'] + ((isNaN(ressqlData.rows.item(i).todays_achievement))?0:ressqlData.rows.item(i).todays_achievement);
                                  
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductMonthlyT'] =  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductMonthlyT'] + ((isNaN(ressqlData.rows.item(i).monthly_target))?0:ressqlData.rows.item(i).monthly_target);
                                  
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductMonthlyA'] = this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempProductMonthlyA'] + ((isNaN(ressqlData.rows.item(i).achieved_target))? 0:ressqlData.rows.item(i).achieved_target);
                                  
                                  this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempEstimatedT'] = this.tempProdArrObj[ressqlData.rows.item(i).target_for]['tempEstimatedT'] + ((isNaN(ressqlData.rows.item(i).estimated_target)) ? 0: ressqlData.rows.item(i).estimated_target);
                                }
                            }
                            console.log("this.tempProdArrObj=>",this.tempProdArrObj);
                            console.log("Object.keys(this.tempProdArrObj)=>",Object.keys(this.tempProdArrObj).length);
                            let tempData = [];
                            for(let i = 0;i<Object.keys(this.tempProdArrObj).length;i++){
                              tempData[i] = this.tempProdArrObj[Object.keys(this.tempProdArrObj)[i]];
                            }
                            console.log("tempData=>",tempData);
                            for(let i = 0;i<tempData.length;i++){
                              
                              this.prodArrObj[i] = {};
                              this.prodArrObj[i]['target_for'] = (!(tempData[i].target_for))?0:((tempData[i].target_for).charAt(0).toUpperCase()+(tempData[i].target_for).slice(1)).replace(/_/g, ' ');
                              this.prodArrObj[i]['productsTodayTarget'] = (isNaN(tempData[i].tempProductTodayT))?0:Math.round(tempData[i].tempProductTodayT * 100)/100;
                              this.prodArrObj[i]['productsTodayAchievementTarget'] = (isNaN(tempData[i].tempProductTodayA))?0:Math.round(tempData[i].tempProductTodayA * 100)/100;
                              this.prodArrObj[i]['productsMonthlyTarget'] = (isNaN(tempData[i].tempProductMonthlyT))?0:Math.round(tempData[i].tempProductMonthlyT * 100)/100;
                              this.prodArrObj[i]['achieved_target'] = (isNaN(tempData[i].tempProductMonthlyA))? 0:Math.round(tempData[i].tempProductMonthlyA * 100)/100;
                              this.prodArrObj[i]['estimatedTarget'] = (isNaN(tempData[i].tempEstimatedT)) ? 0:Math.round(tempData[i].tempEstimatedT * 100)/100;
                            
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
                            resolve(true);
                        });
                    }
                }
          });
      },(err)=>{
        resolve(true);
      });
    });
  }

}
