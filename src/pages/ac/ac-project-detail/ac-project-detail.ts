import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { App_projectsApi, App_srku_approvalApi } from "../../../shared/loopback_sdk/index";
import { SqlServices } from "../../../providers/sqlService";
import { Subscription } from "rxjs/Rx";
import * as moment from 'moment';
import { ALL_MESSAGE } from "../../../providers/constant";
import { AcProjectEditPage } from "../ac-project-edit/ac-project-edit";

@Component({
  selector: 'page-ac-project-detail',
  templateUrl: 'ac-project-detail.html',
})
export class AcProjectDetailPage {
   
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
  constructor(public navCtrl: NavController,public modalCtrl:ModalController, public navParams: NavParams,public projectApi:App_projectsApi,public appCom:appCommonMethods,public alertCtrl:AlertController,public sqlS:SqlServices,public projectApprovalapi:App_srku_approvalApi) {
  }

   ionViewDidLoad() {
      this.initDataDisplay();
   }

 initDataDisplay() {
    this.nmcPhotoObj=[];
    this.bankPhotoObj=[];
    this.projPhotoObj=[];
    console.log('ionViewDidLoad acProjectDetailPage');
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
          if( this.projData['app']['ac'] != undefined && this.projData['app']['ac'] != "" ){
            this.srkuApprovalId=this.projData['app']['ac']['id'];
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
      
      if(  this.srkuApprovalId > 0 && this.projData['app'] != undefined && this.projData['app'] != '' && this.projData['app']['ac']['approval_status'] == 0 ){
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
    let titleYes = await this.appCom.getTranslatedTxt("Yes");
    let title = await this.appCom.getTranslatedTxt("Are you sure you want to approve ?");
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
                    this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.SRKU_APPROVED_SUCCESS,"Ok",null);
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
      let titleYes = await this.appCom.getTranslatedTxt("Yes");
      let title = await this.appCom.getTranslatedTxt("Are you sure you want to reject ?");
      let titleNo = await this.appCom.getTranslatedTxt("No");
      let titlePlaceHolder=await this.appCom.getTranslatedTxt("write here");
      let alert = this.alertCtrl.create({
        cssClass: 'confirm',
        title: title,
        enableBackdropDismiss:false,
        inputs: [
        {
            name: "reason",
            placeholder: titlePlaceHolder,
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
                    this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.SRKU_REJECT_SUCCESS,"Ok",null);
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
 
  editProject(){

    console.log('Project Edit');
    let modelEditProject = this.modalCtrl.create(AcProjectEditPage,{projectData:this.projData});
    modelEditProject.onDidDismiss((resD:any)=>{
        console.log('resD',resD);
        if(resD['refresh']){
            this.initDataDisplay();
        }
    });
    modelEditProject.present();
  }


}
