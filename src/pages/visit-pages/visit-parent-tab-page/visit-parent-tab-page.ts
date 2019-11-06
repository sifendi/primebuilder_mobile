import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VisitContractorListPage } from "../visit-contractor-list-page/visit-contractor-list-page";
import { VisitMasonListPage } from "../visit-mason-list-page/visit-mason-list-page";
import { DistributorListVisitPage } from "../visit-distributor-list-page/visit-distributor-list-page";
import { RetailerListVisitPage } from "../visit-retailer-list-page/visit-retailer-list-page";
import { HpbListPage } from "../../hpb-pages/hpb-list/hpb-list";
import { DistributorRetailerDetailPage } from "../../distributor-retailer-page/distributor-retailer-detail-page/distributor-retailer-detail-page";
import { ProjectListPage } from "../../project/project-list/project-list";
import { SuperTabsController, SuperTabs } from "ionic2-super-tabs/dist";
import { DistributorRetailerListPage } from "../../distributor-retailer-page/distributor-retailer-list/distributor-retailer-list";

@Component({
  selector: 'visit-parent-tab-page',
  templateUrl: 'visit-parent-tab-page.html',
})
export class VisitParentTabsPage {
  nav:any;
  page1: any = VisitMasonListPage;
  page2: any = VisitContractorListPage;
  page3: any = DistributorListVisitPage;
  page4: any = RetailerListVisitPage;
  paramsData:any;
  selectedIndex:any =0;
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  constructor(private superTabsCtrl: SuperTabsController,public navCtrl: NavController, public navParams: NavParams) {
    this.selectedIndex = (this.navParams.data && this.navParams.data['tabNumber'])?this.navParams.data['tabNumber']:0;
    this.page1 = VisitMasonListPage;
    this.page2 = VisitContractorListPage; 
    this.page3 = DistributorListVisitPage; 
    this.page4 = RetailerListVisitPage; 
  }

  ionViewDidEnter(){
    
  }

  onTabSelect($event){
      console.log('Tab selected', 'Index: ' + $event.index, 'Unique ID: ' + $event.id);
      this.selectedIndex = $event.index;
  }

  onAddVisitClick(){
    console.log(" this.selectedIndex ",this.selectedIndex);
    if( this.selectedIndex ==0  ){
        this.navCtrl.push(ProjectListPage); 
    }else if( this.selectedIndex ==1  ){
          this.navCtrl.push(ProjectListPage); 
    }else if( this.selectedIndex ==2 ){
        this.navCtrl.push(DistributorRetailerListPage);
    }else if( this.selectedIndex ==3 ){
         this.navCtrl.push(DistributorRetailerListPage);
    }
  }

}
