import { Component } from '@angular/core';
import { IonicPage, NavController,App, NavParams, AlertController } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { App_projectsApi, App_srku_approvalApi } from "../../../shared/loopback_sdk/index";
import { TlhProjectsPendingPage } from "../../../pages/tlh/tlh-projects-pending/tlh-projects-pending";
import { TlhProjectsTabPage } from "../../../pages/tlh/tlh-projects-tab/tlh-projects-tab";
import { SqlServices } from "../../../providers/sqlService";
import { Subscription } from "rxjs/Rx";
import * as moment from 'moment';
import { ALL_MESSAGE } from "../../../providers/constant";


@Component({
  selector: 'page-tlh-project-detail',
  templateUrl: 'tlh-project-detail.html',
})
export class TlhProjectDetailPage {
   
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
  showApproveBtnFlag:any=true;
  srkuApprovalId:number=0;
  constructor(public navCtrl: NavController,public app :App, public navParams: NavParams,public projectApi:App_projectsApi,public appCom:appCommonMethods,public alertCtrl:AlertController,public sqlS:SqlServices,public projectApprovalapi:App_srku_approvalApi) {
    
  }

  ionViewDidLoad() {
    this.nmcPhotoObj=[];
    this.bankPhotoObj=[];
    this.projPhotoObj=[];
    console.log('ionViewDidLoad TlhProjectDetailPage');
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
      this.projectId= parseInt(paramData['projectId']);
      console.log("this.projectId",this.projectId);
      this.busy = this.projectApi.getProjectWithApp(null,this.projectId,null,null,null,null,null,null,null,null,null,null,null,null,null,null).subscribe(resData => {    
      this.projData= resData.result[0];

      console.log("this.projData", this.projData);
       if(this.projData['app']){
         if( this.projData['app']['tlh'] != undefined && this.projData['app']['tlh'] != "" ){
            this.srkuApprovalId=this.projData['app']['tlh']['id'];
         }
     }
     
      
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
                    tempDocArr.display ='assets/images/document.jpg'; 
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

      //digitalSignPath
      /*if( this.projData.hpb_digital_sign != undefined && this.projData.hpb_digital_sign != "" ){
          var hpb_digi_sign=JSON.parse(this.projData.hpb_digital_sign);   
          this.digitalSignPath=hpb_digi_sign[0]['serverPath']; 
      }*/

      if( this.projData.project_photo != undefined && this.projData.project_photo != "" ){
        var projPhoto = JSON.parse(this.projData.project_photo);      
        if( projPhoto !=undefined && projPhoto !=''  ){
          for( var i=0;i<projPhoto.length;i++ ){
                this.projPhotoObj.push(  projPhoto[i]['serverPath'] );  
          }
             console.log("projPhotoObj",this.projPhotoObj);
        }
      }
      
      if(  this.srkuApprovalId > 0 && this.projData['app'] != undefined && this.projData['app'] != '' && this.projData['app']['tlh']['approval_status'] == 0 ){
        this.showApproveBtnFlag=true;
      }else{
        this.showApproveBtnFlag=false; 
      }
    

      },
      error => {
        console.log("error", error);
      });

  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }
  
  openFile(file){
    console.log(" file ",file);  
    this.appCom.onlineFileOpen(file);
  }

  timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
  }

  async approve(){
    let title = await this.appCom.getTranslatedTxt("Are you sure you want to approve ?");
    let titleYes = await this.appCom.getTranslatedTxt("Yes");
    let titleNo = await this.appCom.getTranslatedTxt("No");
    let alert = this.alertCtrl.create({
          cssClass: 'confirm',
          title: title,
          enableBackdropDismiss:false,
          buttons: [
          {
            text: titleYes,
            handler: () => {

                    let  approvalData={
                      project_id:null,
                      srku_approval_status:null,
                      srku_rejection_reason:null,
                      approved_by:null,
                    } 

                    approvalData['project_id']=this.projData['project_id'];
                    approvalData['srku_approval_status']=1;
                    approvalData['local_updated_date']=this.appCom.getCurrentTimeStamp(); 
                    approvalData['approved_by']=this.uId;
                    console.log("approvalData",approvalData);
                    console.log("srkuApprovalId----------",this.srkuApprovalId);
                    this.busy = this.projectApprovalapi.addEditSrkuApproval(approvalData,this.srkuApprovalId).subscribe(resData => {
                    console.log("approved",resData);
                    this.ionViewDidLoad();
                    this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.SRKU_APPROVED_SUCCESS,"Ok",null).then(()=>{
                      
                      this.app.getRootNav().push(TlhProjectsTabPage).then(() => {
                        const startIndex = this.navCtrl.getActive().index - 2;
                        console.log("startIndex=>",startIndex);
                        this.navCtrl.remove(startIndex, 2);
                      });
                    });
                    });  
            
            }
          },
          {
            text: titleNo,
            handler: () => {
            console.log('Cancel clicked');
            

            }
          }
          ]
    });
    alert.present();

  }

   async reject(){
      let title = await this.appCom.getTranslatedTxt("Are you sure you want to reject ?");
      let titleYes = await this.appCom.getTranslatedTxt("Yes");
      let titleNo = await this.appCom.getTranslatedTxt("No");
      let titlePlaceHold = await this.appCom.getTranslatedTxt("write here");
      let alert = this.alertCtrl.create({
        cssClass: 'confirm',
        title: title,
        enableBackdropDismiss:false,
        inputs: [
        {
            name: 'reason',
            placeholder: titlePlaceHold,
        }
        ],
        buttons: [
        {
            text: titleYes,
                handler: (data) => {
              
                var c = "";
                c=data['reason'].trim();
                //c=c.trim();
                if( c != undefined &&  c != "" ){

                   let  approvalData={
                        project_id:null,
                        srku_approval_status:null,
                        srku_rejection_reason:null,
                        approved_by:null
                      } 

                    approvalData['project_id']=this.projData['project_id'];
                    approvalData['srku_approval_status']= -1;
                    approvalData['srku_rejection_reason']=c;
                    approvalData['local_updated_date']=this.appCom.getCurrentTimeStamp(); 
                    approvalData['approved_by']=this.uId;  
                    this.busy = this.projectApprovalapi.addEditSrkuApproval(approvalData,this.srkuApprovalId).subscribe(resData => {
                    console.log("approved",resData);
                    this.ionViewDidLoad();
                    this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.SRKU_REJECT_SUCCESS,"Ok",null).then(()=>{
                      
                      this.app.getRootNav().push(TlhProjectsTabPage).then(() => {
                        const startIndex = this.navCtrl.getActive().index - 2;
                        console.log("startIndex=>",startIndex);
                        this.navCtrl.remove(startIndex, 2);
                      });
                    });
                    });                
                                                                    
                }else{
                    
                      this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.PROJ_SRKU_APPROVAL_REJECT_REASON,"middle");
                      return false;   
                }
            }
        }, 
        {
            text: titleNo,
            handler: () => {
            console.log('Cancel clicked');
          
            }
        }]
    });
    alert.present();

  }
 

}
