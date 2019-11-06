import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { TlhProjectsAllPage } from '../tlh-projects-all/tlh-projects-all';
import { TlhProjectsPendingPage } from "../tlh-projects-pending/tlh-projects-pending";
import { TlhProjectFilterPage } from "../tlh-project-filter/tlh-project-filter";

@Component({
  selector: 'page-tlh-projects-tab',
  templateUrl: 'tlh-projects-tab.html',
})
export class TlhProjectsTabPage {

  tabType:any='pending'; 
  projFilterArr:any={
     subDistrict:null,
     projectStage:null,
     projectType:null,
     isSrku:null,
     tabType:"pending"
  } 

  page1: any = TlhProjectsPendingPage;
  page2: any = TlhProjectsAllPage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public events:Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TlhProjectsTabPage');
  }

  ionViewDidEnter(){
    console.log('ionViewDidEnter TlhProjectsTabPage');
  }

    openProjectFilter(){
       
        let selFilterData={ 
            tabType:this.tabType,
            projFilterArr:this.projFilterArr
        };
        let filterPageD = this.modalCtrl.create(TlhProjectFilterPage,{selFilterData:selFilterData});
        filterPageD.onDidDismiss((fDataRes:any)=>{
            if( this.tabType=="pending" ){
                this.projFilterArr=fDataRes['projFilterArr'];
                this.events.publish("tlhProjectPListFilter",fDataRes);
                
            }else if( this.tabType=="all" ){
                this.projFilterArr=fDataRes['projFilterArr'];
                this.events.publish("tlhProjectAListFilter",fDataRes); 
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
        this.events.publish("cleartlhProjectPListFilter"); 
     }else{
        this.tabType="all";
        this.projFilterArr={};
        this.projFilterArr['subDistrict']=null;
        this.projFilterArr['projectStage']=null;
        this.projFilterArr['projectType']=null;
        this.projFilterArr['isSrku']=null;
        this.projFilterArr['tabType']="all";
        this.events.publish("cleartlhProjectAListFilter"); 
     }
    
  }

}
