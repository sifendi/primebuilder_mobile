import { HomePage } from '../../home/home';
import { ALL_MESSAGE } from '../../../providers/constant';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { App_projectsApi }  from '../../../shared/loopback_sdk';
import async from 'async'; 
import * as moment from 'moment';
declare var cordova;
declare var debugDataCustom;
declare var globalInternetCheckConnection;
declare var sessionUserGlobalData;

@Component({
  selector: 'ac-page-project-edit',
  templateUrl: 'ac-project-edit.html',
})
export class AcProjectEditPage {
   

busyMessage:any="Please Wait...";  
busy:any;
projData:any={};
@ViewChild('ProjectCompletionDate') ProjectCompletionDate: any; 
@ViewChild('ProjectCompletionDateMob') ProjectCompletionDateMob: any; 
@ViewChild('ProjectQuantityEstimation') ProjectQuantityEstimation: any; 
submitted:boolean=false;
 dateSettingsG:any={
    theme: 'material',
    display: 'center',
    dateFormat:'dd/mm/yy'
};

public MaxDate: any;

constructor(public navCtrl: NavController,public appProjApi:App_projectsApi,public params:NavParams,public viewCtrl:ViewController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public events:Events) {
  console.log('params',this.params.get('projectData'));
  this.projData = this.params.get('projectData');
  this.projData['project_completion_date']=this.appCom.timeStampToDateMMMnewM(this.projData['project_completion_date']).toISOString();
  this.busy=this.initFormData();
}


initFormData(){
  return new Promise((resolve,reject)=>{
    // let tempDateS=this.dateSettingsG;
    // tempDateS['max']=new Date(moment().add(20,'years').format());
    // tempDateS['min']=new Date(moment().add(1, 'days').format());
    // this.dateSettingsG=tempDateS;
    // this.ProjectCompletionDateMob.instance.option(tempDateS);
    // this.MaxDate = new Date(moment().add(20,'years').format());
    // this.MinDate=moment(new Date()).format();
    this.MaxDate=moment().add(20,'years').format(); 
    resolve(true);
  });
}

dismiss(){
    this.viewCtrl.dismiss({}); 
}

submit(){
      console.log('submit...');
      this.submitted=true;
      let valid = this.ProjectCompletionDate.valid && this.ProjectQuantityEstimation.valid;
      if(valid){
        let id = this.projData['project_id'];
        let dataObj = {};
        dataObj['project_completion_date']=this.appCom.dateToTimeStamp(this.projData['project_completion_date']);
        dataObj['project_quantity_estimation']=this.projData['project_quantity_estimation'];
        this.busy=this.appProjApi.addEditProject(dataObj,id).subscribe((respData:any)=>{
              console.log('addEditProject respData',respData);      
                if(respData['result']['id']>0){
                    this.viewCtrl.dismiss({'refresh':true}).then(()=>{
                         this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.PROJ_UPDATE_SUCCESS,"Ok","");                                                                   
                    });
                }else{
                  this.appCom.showAlert(ALL_MESSAGE.SERVER_MESSAGE.COMMON_ERROR,"Ok","");               
                }
        },(error)=>{
            console.log('addEditProject error',error);
            this.appCom.showAlert(ALL_MESSAGE.SERVER_MESSAGE.COMMON_ERROR,"Ok","");         
        });
       
      }else{
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_FIELDS_FORM_ERR,"Ok","");         
      }
}

}
