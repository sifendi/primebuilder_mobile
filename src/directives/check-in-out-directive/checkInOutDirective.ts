import { Attribute, Directive, EventEmitter, forwardRef, Output } from '@angular/core';
import { ElementRef, HostListener, Input, Renderer } from '@angular/core';
import { NavController,AlertController,Events } from 'ionic-angular';
import { DistributorRetailerDetailPage } from "../../pages/distributor-retailer-page/distributor-retailer-detail-page/distributor-retailer-detail-page";
import { SqlServices } from "../../providers/sqlService";
import { ALL_MESSAGE } from "../../providers/constant";
import { appCommonMethods } from '../../providers/appCommonMethods';
declare var cordova;

@Directive({
 selector:'[checkInOut]'
})

export class CheckInOutDirective  {
     
    //INITIALIZE GLOBAL CHECK-IN OBJECT 
    globalCheckInData:any={
        checkinFlag:false,
        checkinType:"",
        insertId:null,
        checkinDetails: {
            check_in_out_user_id:null,
            check_in_out_type:null,
            check_in_out_type_id:null,
            check_in_latitude:null,
            check_in_longitude:null,
            check_in_datetime:null,
            check_out_latitude:null,
            check_out_longitude:null,
            check_out_datetime:null,
            generated_by:null,
           
        }
    };

    @Input('data-cdata') cdata : any; 
    @Input('data-ctype') ctype : any; 
    @Input('data-cdataid') cdataid : any; 
    @Input('data-cdisplay') cdisplay : any; 
    @Output() open: EventEmitter<any> = new EventEmitter();
    constructor(public events:Events,private el:ElementRef,private renderer:Renderer,private appCom:appCommonMethods,private navCtrl:NavController,private sqlS:SqlServices,public alertCtrl:AlertController){ 
        
    }
    ngOnInit() {
        this.setElement();
    }

    ngOnChanges(){
            //     this.setElement();
    }


    setElement(){
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj:any)=>{
            if(checkinObj['checkinDetails']['check_in_out_type_id'] == this.cdataid &&   this.globalCheckInData['checkinDetails']['check_in_out_type'] == this.ctype ){
                    this.el.nativeElement.innerText="Check Out";   
             }else{              
                 this.el.nativeElement.innerText="Check IN";   
            }
        });
    }


    @HostListener('click', ['$event']) 
    onClick(e) {    
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj:any)=>{
             if(checkinObj['checkinFlag'] == false ){
                   this.el.nativeElement.innerText="Check Out"; 
             }else{
                    if(checkinObj['checkinDetails']['check_in_out_type_id'] == this.cdataid &&   this.globalCheckInData['checkinDetails']['check_in_out_type'] == this.ctype ){
                            this.el.nativeElement.innerText="Check In";   
                    }else{              
                            this.appCom.showAlert('Please Check Out',"Ok",""); 
                    }
             }
             this.events.publish("checkInOutCheckConditionRerender");
        }); 
    }


}