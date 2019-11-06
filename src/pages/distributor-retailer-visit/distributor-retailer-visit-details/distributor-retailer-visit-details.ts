import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DistributorRetailerVisitDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-distributor-retailer-visit-details',
  templateUrl: 'distributor-retailer-visit-details.html',
})
export class DistributorRetailerVisitDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DistributorRetailerVisitDetailsPage');
  }

}
