import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { AcProjectsPendingPage } from "../ac-projects-pending/ac-projects-pending";
import { AcProjectsAllPage } from "../ac-projects-all/ac-projects-all";
import { AcProjectFilterPage } from "../ac-project-filter/ac-project-filter";


@Component({
  selector: 'page-ac-projects-tab',
  templateUrl: 'ac-projects-tab.html',
})
export class AcProjectsTabPage {

  tabType:any='pending';  
  projFilterArr:any={
     subDistrict:null,
     projectStage:null,
     projectType:null,
     isSrku:null,
     tabType:"pending"
  } 
  page1: any = AcProjectsPendingPage;
  page2: any = AcProjectsAllPage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public events:Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TlhProjectsTabPage');
  }

    openProjectFilter(){
       
        let selFilterData={ 
            tabType:this.tabType,
            projFilterArr:this.projFilterArr
        };
        let filterPageD = this.modalCtrl.create(AcProjectFilterPage,{selFilterData:selFilterData});
        filterPageD.onDidDismiss((fDataRes:any)=>{
            if( this.tabType=="pending" ){
                this.projFilterArr=fDataRes['projFilterArr'];
                this.events.publish("acProjectPListFilter",fDataRes);
                
            }else if( this.tabType=="all" ){
                this.projFilterArr=fDataRes['projFilterArr'];
                this.events.publish("acProjectAListFilter",fDataRes); 
            }
            
        });
        filterPageD.present();
  }

  onTabSelect(ev: any) {
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
     if(ev.index==0){
        this.tabType="pending";
        this.projFilterArr={};
        this.projFilterArr['subDistrict']=null;
        this.projFilterArr['projectStage']=null;
        this.projFilterArr['projectType']=null;
        this.projFilterArr['isSrku']=1;  
        this.projFilterArr['tabType']="pending";
        this.events.publish("clearacProjectPListFilter"); 
     }else{
        this.tabType="all";
        this.projFilterArr={};
        this.projFilterArr['subDistrict']=null;
        this.projFilterArr['projectStage']=null;
        this.projFilterArr['projectType']=null;
        this.projFilterArr['isSrku']=null;
        this.projFilterArr['tabType']="all";
        this.events.publish("clearacProjectAListFilter"); 
     }
    
  }

}
