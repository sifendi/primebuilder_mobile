import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';






@Component({
  selector: 'page-image-select-pop',
  templateUrl: 'image-select-pop.html',
})
export class ImageSelectPopPage {

cam_options:CameraOptions;
gall_options:CameraOptions
photo_source:any="";
allowCamPhotoSource:any;
allowGalleryPhotoSource:any;
allowFileSource:any; 

  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public camera: Camera,public events:Events) {
  
  this.photo_source= this.navParams.get("photo_source");
  
  if( this.photo_source == 'profile_pic' || this.photo_source == 'invoice_photo' || this.photo_source == 'id_card_photo' || this.photo_source == 'nmc_doc_photo' || this.photo_source == 'project_photo' || this.photo_source == 'bank_doc_photo' || this.photo_source == 'rem_proof_pics' ){
    this.allowCamPhotoSource = true;
  } 

  if( this.photo_source == 'id_card_photo' || this.photo_source == 'nmc_doc_photo' || this.photo_source == 'project_photo' || this.photo_source == 'bank_doc_photo' || this.photo_source == 'invoice_photo' || this.photo_source == 'rem_proof_pics' ){
    this.allowGalleryPhotoSource = true;
  }
  
  if(  this.photo_source == 'invoice_photo' ||   this.photo_source == 'nmc_doc_photo'  || this.photo_source == 'bank_doc_photo'   ){ //|| this.photo_source == 'rem_proof_pics'
    this.allowFileSource = true;
  }
   

  this.cam_options = {
    targetWidth:1000,
    targetHeight:1000,  
    quality: 80,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: false,
  }

  this.gall_options = {
    targetWidth:1000,
    targetHeight:1000,  
    quality: 80,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    allowEdit: false,
  }



  }
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageSelectPopPage');
  }
 
  //OPENS GALLERY
  SelectGallery(){
      this.camera.getPicture(this.gall_options).then((imageData) => {
      let base64Image =  imageData;
      this.events.publish('getbase64Image', { "base64Image": base64Image,"photo_source":this.photo_source  });
      this.viewCtrl.dismiss();
      }, (err) => {
      console.log(err);
      });
  }
  
  //OPENS CAMERA
  SelectCamera(){
    this.camera.getPicture(this.cam_options).then((imageData) => {
    let base64Image =  imageData;
    this.events.publish('getbase64Image', { "base64Image": base64Image,"photo_source":this.photo_source  });
    this.viewCtrl.dismiss();
    }, (err) => {
    console.log(err);
    });

  }

  selectFromDocuments(){
    
    if( this.photo_source == "invoice_photo" ){
        this.events.publish('getbase64Image', { "base64Image": "","photo_source":"doc"  });
       
    }else if( this.photo_source == "nmc_doc_photo" ){
        this.events.publish('getbase64Image', { "base64Image": "","photo_source":"docNmc"  });
    }else if( this.photo_source == "bank_doc_photo" ){
        this.events.publish('getbase64Image', { "base64Image": "","photo_source":"docBank"  });
    }else if( this.photo_source == "rem_proof_pics" ){
        this.events.publish('getbase64Image', { "base64Image": "","photo_source":"rem_proof"  });
    }
    this.viewCtrl.dismiss();  
    
  }



}
