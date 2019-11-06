import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Subscription } from "rxjs/Rx";
import * as moment from 'moment';
import { App_projectsApi } from "../../../../shared/loopback_sdk/index";
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../../providers/constant";



@Component({
  selector: 'tlh-hpb-project-detail',
  templateUrl: 'tlh-hpb-project-detail.html',
})
export class TlhHpbProjectDetailPage {
   
  approvalData={
    project_id:null,
    srku_approval_status:null,
    srku_rejection_reason:null,
    approved_by:null,
  }

  userName:any;
  uId:number;
  projectId:number;
  busy: Subscription;
  busyMessage: any;
  projData:any=[];
  isSrku:number=1
  digitalSignPath:any=[];
  nmcPhotoObj:any=[];
  bankPhotoObj:any=[];
  projPhotoObj:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public projectApi:App_projectsApi,public appCom:appCommonMethods,public alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TlhHpbProjectDetailPage');
    this.appCom.getAppPreference("userCreds").then(
      resDataU => {
        this.userName = resDataU.user.realm;
        let uId = resDataU.userId;
        this.uId = parseInt(uId);
       
      },
    err => {
        console.log("err ref", err);
    });

      let paramData = this.navParams.data;
      console.log("paramData",paramData);
      this.projectId= parseInt(paramData['projId']); 
      console.log("this.projectId",this.projectId);
      this.busy = this.projectApi.getProjectWithApp(null,this.projectId).subscribe(resData => {    
      this.projData= resData.result[0];

        console.log("this.projData", this.projData);

        if( this.projData.is_micro_credit == 0 ){
            var nmcPhoto = JSON.parse(this.projData.nmc_document);      
            if( nmcPhoto !=undefined && nmcPhoto !=''  ){
              for( var i=0;i<nmcPhoto.length;i++ ){
                  if(nmcPhoto[i]['fileType'] == 'jpg' || nmcPhoto[i]['fileType'] == 'png' || nmcPhoto[i]['fileType'] == 'jpeg'){   
                    let tempDocArr:any = {};
                    tempDocArr.path = nmcPhoto[i].serverPath;
                    tempDocArr.display = nmcPhoto[i].serverPath;
                    this.nmcPhotoObj.push( tempDocArr );  
                  }else{
                    let tempDocArr:any = {};
                    tempDocArr.path = nmcPhoto[i].serverPath;
                    tempDocArr.display = 'assets/images/document.jpg';
                    this.nmcPhotoObj.push( tempDocArr );  
                  }
              }
            }
        }

        if( this.projData.is_micro_credit == 1 ){
            var bankPhoto = JSON.parse(this.projData.bank_document);   
            console.log(" bankPhoto ",bankPhoto);   
            if( bankPhoto !=undefined && bankPhoto !=''  ){
              for( var i=0;i<bankPhoto.length;i++ ){
                  if(bankPhoto[i]['fileType'] == 'jpg' || bankPhoto[i]['fileType'] == 'png' || bankPhoto[i]['fileType'] == 'jpeg'){
                    let tempDocArr:any = {};
                    tempDocArr.path = bankPhoto[i].serverPath;
                    tempDocArr.display = bankPhoto[i].serverPath;  
                    this.bankPhotoObj.push( tempDocArr );  
                  }else{
                     let tempDocArr:any = {};
                      tempDocArr.path = bankPhoto[i].serverPath;
                     tempDocArr.display = 'assets/images/document.jpg';  
                      this.bankPhotoObj.push( tempDocArr );  
                  }   
              }
            }
        }
/* un-coment to allow signature capture  
        if( this.projData.hpb_digital_sign != undefined && this.projData.hpb_digital_sign != "" ){
            var hpb_digi_sign=JSON.parse(this.projData.hpb_digital_sign);   
            if(hpb_digi_sign.length > 0){
              this.digitalSignPath=hpb_digi_sign[0]['serverPath']; 
            }
        }
*/
        if( this.projData.project_photo != undefined && this.projData.project_photo != "" ){
            var projPhoto = JSON.parse(this.projData.project_photo);      
              if( projPhoto !=undefined && projPhoto !=''  ){
                for( var i=0;i<projPhoto.length;i++ ){
                      this.projPhotoObj.push(  projPhoto[i]['serverPath'] );  
                }
              }
        }
      
      },
      error => {
        console.log("error", error);
      });

  }
  
   async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

  timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
  }

  openFile(file){
    console.log(" file ",file);
    this.appCom.onlineFileOpen(file);
  }
}
