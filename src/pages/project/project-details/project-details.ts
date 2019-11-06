import { ALL_MESSAGE } from '../../../providers/constant';
import { ProductReceiptsFormPage } from '../../product-receipts/product-receipts-form/product-receipts-form';
import { AddProjectPage } from '../add-project/add-project';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'project-details',
  templateUrl: 'project-details.html',
})
export class ProjectDetailsPage {
  
  projData:any=[];
  projPhotoObj:any=[];
  nmcPhotoObj:any=[];
  bankPhotoObj:any=[];
  projCompletionDate:any;
  paramsData:any;
  hpbName:any="";
  hpbId:any="";
  busyMessage:any="Please Wait...";  
  busy:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods) {
  

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectDetailsPage');

    this.projData=[];
    this.projPhotoObj=[];
    this.nmcPhotoObj=[];
    this.bankPhotoObj=[];

    this.paramsData=this.navParams.data;
    console.log("params data",this.paramsData); 
    this.hpbId = this.paramsData['hpbId']; //this is server_hpb_id
    this.hpbName =  this.paramsData['hpbName'];   
    var projId = this.paramsData['projId'];         

    var where =" `project_id` = " +projId;

    let query="SELECT projm.project_photo,ptt.project_type,nmct.nmc_type,pst.project_stage,projm.project_completion_date,projm.project_province,projm.project_city,projm.project_sub_district,projm.srku_owner_mobile_no,projm.srku_province,projm.srku_city,projm.srku_sub_district,projm.srku_pincode,projm.floor_size,projm.number_of_units,projm.is_micro_credit,projm.additional_comments, projm.hpb_digital_sign,projm.hpb_id,projm.server_hpb_id,projm.project_completion_date,projm.project_quantity_estimation,projm.project_address,projm.project_stage_mid,projm.project_sub_district,projm.project_pincode,projm.is_srku,projm.srku_owner_name,projm.srku_owner_address,projm.srku_owner_mobile_no,projm.non_micro_credit_type,projm.non_micro_credit_type_mid,projm.bank_name,projm.nmc_document,projm.bank_document,projm.assigned_to,projm.created_by,projm.updated_by,projm.sync_status,projm.status,projm.local_created_date,projm.local_updated_date,projm.project_id,projm.server_project_id,projm.project_name,projm.project_address,projm.is_srku,hm.hpb_name,hm.server_hpb_id,hm.hpb_id,(SELECT sast.srku_approval_status FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_approval,(SELECT sast.srku_rejection_reason FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_rejection_res FROM project_master projm LEFT JOIN hpb_master hm ON projm.server_hpb_id = hm.server_hpb_id LEFT JOIN project_type_tbl ptt ON projm.project_type_mid = ptt.server_id LEFT JOIN project_stage_tbl pst ON projm.project_stage_mid = pst.server_id LEFT JOIN nmc_tbl nmct ON projm.non_micro_credit_type_mid = nmct.server_id where projm.project_id = "+projId ;
    this.busy=this.sqlS.queryExecuteSql(query,[]).then((data) => {
    this.projData= data['rows'].item(0) ;     
    console.log(" projData ----",this.projData);



  /* un-coment to allow signature capture            
                if(  this.projData.hpb_digital_sign !=undefined && this.projData.hpb_digital_sign !='' ){
                   let ds = [];
                   ds = JSON.parse( this.projData.hpb_digital_sign );
                   console.log('ds',ds);
                   try{
                     this.projData.hpb_digital_sign = this.appCom.urlSanitizer(ds[0]['path']);
                   }catch(e){
                     this.projData.hpb_digital_sign = "";
                   }
            
                }else{
                   this.projData.hpb_digital_sign = "";
                }

	*/
              console.log("this.projData.project_photo detail---------->",this.projData.project_photo);  
              var projPhoto = JSON.parse(this.projData.project_photo);      
              console.log("projPhoto detail---------->",projPhoto);
              if( projPhoto !=undefined && projPhoto !=''  ){
                for( var i=0;i<projPhoto.length;i++ ){
                      //this.projPhotoObj.push(  projPhoto[i]['path'] ); 
                      this.projPhotoObj.push(  this.appCom.getImageLocalPathFull(projPhoto[i]) );  
                }
              }

              if( this.projData.is_micro_credit == 0 ){
                  var nmcPhoto = JSON.parse(this.projData.nmc_document);      
                  
                  if( nmcPhoto !=undefined && nmcPhoto !=''  ){
                    for( var i=0;i<nmcPhoto.length;i++ ){
                       if(nmcPhoto[i]['fileType'] == 'jpg' || nmcPhoto[i]['fileType'] == 'png' || nmcPhoto[i]['fileType'] == 'jpeg'){   
                          let tempDocArr:any = {};
                          //tempDocArr.path = nmcPhoto[i].path;
                          //tempDocArr.display = nmcPhoto[i].path;
                          
                          tempDocArr.path = this.appCom.getImageLocalPathFull(nmcPhoto[i]);
                          tempDocArr.display = this.appCom.getImageLocalPathFull(nmcPhoto[i]);

                          this.nmcPhotoObj.push( tempDocArr );  
                       }else{
                          let tempDocArr:any = {};
                          //tempDocArr.path = nmcPhoto[i].path;

                          tempDocArr.path = this.appCom.getImageLocalPathFull(nmcPhoto[i]);
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
                          //tempDocArr.path = bankPhoto[i].path;
                          //tempDocArr.display = bankPhoto[i].path; 

                          tempDocArr.path = this.appCom.getImageLocalPathFull(bankPhoto[i]);
                          tempDocArr.display = this.appCom.getImageLocalPathFull(bankPhoto[i]);

                          this.bankPhotoObj.push( tempDocArr );  
                        }else{
                          let tempDocArr:any = {};
                          //tempDocArr.path = bankPhoto[i].path;
                          tempDocArr.path = this.appCom.getImageLocalPathFull(bankPhoto[i]);
                          tempDocArr.display = 'assets/images/document.jpg'; 
                            this.bankPhotoObj.push( tempDocArr );  
                        }
                          
                    }
                  }
              }
             
        console.log("detail page obj",this.projData); 
        if( this.projData['project_completion_date'] !=undefined && this.projData['project_completion_date'] !='' ){
            this.projCompletionDate=this.appCom.timeStampToDate( (this.projData['project_completion_date'])) ;
        } 
        
    
    }, (error) => {
        console.log('Error', error);
        
    });
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

  openFile(file){
      console.log(" pro file ",file)
      this.appCom.fileOpen(file);
  }

  editProject(){
    this.navCtrl.push(AddProjectPage,{
      "projData":this.projData,
      "action":"edit"
    });
  }

    goToProductReceiptForm(projId){
      if( this.hpbId !=undefined && this.hpbId != '' && this.hpbId >0 ){
          this.navCtrl.push(ProductReceiptsFormPage,{
            "projId":projId,
          });
      }else{
         this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.NO_HPB_ERR,"Ok","");   
      }
     
   }


}
