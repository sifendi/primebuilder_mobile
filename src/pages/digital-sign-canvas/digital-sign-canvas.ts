import { ALL_MESSAGE } from '../../providers/constant';
import { appCommonMethods } from '../../providers/appCommonMethods';
import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { timeout } from 'rxjs/operator/timeout';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';




@Component({
  selector: 'page-digital-sign-canvas',
  templateUrl: 'digital-sign-canvas.html',
})
export class DigitalSignCanvasPage {
   @ViewChild(SignaturePad) public signaturePad : SignaturePad;
    @ViewChild("ionContent") public ionContent : any;
     @ViewChild("footbutton") public footbutton : any;
      @ViewChild("header") public header : SignaturePad;

  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 700

  };

  canvasHeightParameters:any;
  canvasWidthParameters:any;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public events:Events,public appCom:appCommonMethods) {
  
  }

  ionViewDidLoad() {
     console.log("signaturePad",this.signaturePad);

      console.log("ionContent",this.ionContent);
       console.log("footbutton",this.footbutton);
        console.log("header",this.header);
      console.log("Reset Model Screen");
     
     setTimeout(()=> {
      this.canvasHeightParameters = this.ionContent._elementRef.nativeElement.offsetHeight;
      this.canvasWidthParameters=this.ionContent._elementRef.nativeElement.offsetWidth;
      
      console.log("canvasHeightParameters",this.canvasHeightParameters);
      console.log("canvasWidthParameters",this.canvasWidthParameters);
      this.signaturePadOptions['canvasWidth']=this.canvasWidthParameters;
      this.signaturePadOptions['canvasHeight']=this.canvasHeightParameters;

       this
      .signaturePad
      .clear();
      this.canvasResize();
     }, 300);
     

  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this
      .signaturePad
      .set('minWidth', 1);
      console.log(canvas.offsetWidth);
    this
      .signaturePad
      .set('canvasWidth', this.canvasWidthParameters);

    this
      .signaturePad
      .set('canvasHeight', this.canvasHeightParameters);
    console.log("canvas.offsetHeight", this.canvasHeightParameters)
  }



  save(){
      
     var check= this.signaturePad.isEmpty(); 
      if(!check){
          var data = this.signaturePad.toDataURL('image/png');
          data= data.replace(/^data:image\/[a-z]+;base64,/, "");
          this.events.publish('getbase64Image', { "base64Image": data,"photo_source":"digital_sign"  });
          this.viewCtrl.dismiss({ "base64Image": data,"photo_source":"digital_sign"});  
      }else{
          //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.SIGN_PAD_BLANK_ERR,"middle");
           this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.SIGN_PAD_BLANK_ERR,"Ok","");
      }
      
  }

  clear(){
      this.signaturePad.clear();
  }

  

  dismiss(){
     this.viewCtrl.dismiss(); 
  }


}
