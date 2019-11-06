import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-tlh-sph-list',
  templateUrl: 'tlh-sph-list.html',
})
export class TlhSphListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TlhSphListPage');
  }

}
