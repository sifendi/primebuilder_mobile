import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Cement_bag_removals_tblApi } from "../../../shared/loopback_sdk/index";
import * as moment from 'moment';
import { ALL_MESSAGE } from "../../../providers/constant";
import { appCommonMethods } from "../../../providers/appCommonMethods";


@Component({
  selector: 'page-ac-cement-bag-removal-detail',
  templateUrl: 'ac-cement-bag-removal-detail.html',
})
export class AcCementBagRemovalDetailPage {
  remBagId:any;
  busy: any;
  busyMessage: any;
  cBagRemovData:any={};
  proofPhotoObj:any=[];
  digitalSignPath:any=[];


  constructor(private appCom:appCommonMethods,public navCtrl: NavController, public navParams: NavParams,public getCementBagRemApi:Cement_bag_removals_tblApi) {
    let paramsData=this.navParams.data
    this.remBagId=paramsData['receiptId'];
  }
 //removal_id
  ionViewDidLoad() {
    console.log('ionViewDidLoad AcCementBagRemovalDetailPage');
    this.busy =  this.getCementBagRemApi.getCementBagRemoval(this.remBagId,null,null,null,null,null,null,null,null,null).subscribe(resData => { 
            if(resData){
               this.cBagRemovData= resData.result[0];
            }

            var proofImage = ( this.cBagRemovData['attach_picture'] && this.cBagRemovData['attach_picture'] != '' )?JSON.parse(this.cBagRemovData['attach_picture']):[];
            if( proofImage !=undefined && proofImage !='' && proofImage.length > 0 ){
                  for( var i=0;i<proofImage.length;i++ ){
                      if(proofImage[i].fileType == 'jpeg' || proofImage[i].fileType == 'jpg' || proofImage[i].fileType == 'png'){  
                        let tempDocArr:any = {};
                        tempDocArr.path = proofImage[i].serverPath;
                        tempDocArr.display = proofImage[i].serverPath;  
                        this.proofPhotoObj.push( tempDocArr );  
                      }else{
                        let tempDocArr:any = {};
                        tempDocArr.path = proofImage[i].serverPath;
                        tempDocArr.display = 'assets/images/document.jpg';  
                        this.proofPhotoObj.push( tempDocArr );
                      }
                  }
            }
            console.log("proofPhotoObj",this.proofPhotoObj);

            if( this.cBagRemovData['digital_sign'] != undefined && this.cBagRemovData['digital_sign'] != '' ){
                let path= JSON.parse(this.cBagRemovData['digital_sign']);
                this.digitalSignPath = path[0]?path[0]['serverPath']:"";          
            }
            console.log("digitalSignPath",this.digitalSignPath); 
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
