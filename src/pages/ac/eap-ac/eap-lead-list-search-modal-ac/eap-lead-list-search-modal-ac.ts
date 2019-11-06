import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';



@Component({
  selector: 'eap-lead-list-search-modal-ac',
  templateUrl: 'eap-lead-list-search-modal-ac.html',
})
export class EapLeadSearchModalAc {

  constructor(public navCtrl: NavController,public viewCtrl:ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EapLeadSearchModal');
  }

  closeSearch(){
    let dataObjFilter={};
    this.viewCtrl.dismiss(dataObjFilter);
  }

}
