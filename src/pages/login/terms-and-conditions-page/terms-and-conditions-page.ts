import { Component } from '@angular/core';
import { NavController, NavParams, App,Platform, ViewController } from 'ionic-angular';


@Component({
  selector: 'terms-and-conditions-page',
  templateUrl: 'terms-and-conditions-page.html'
})
export class TermsAndConditon {
  itemDatas:any;
  unregisterBackButtonAction:any;
   constructor( public navCtrl: NavController,private platform:Platform, private viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TendersFilterResultPage');
  }

acceptCondtion(acceptFlag){
  this.viewCtrl.dismiss(acceptFlag);
}

dismiss(acceptFlag){
     this.viewCtrl.dismiss(false); 
}

}
