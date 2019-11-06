import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { MasonRedeemListPage } from '../redeem-list/redeem-list';
import { MasonRedeemHistoryPage } from '../redeem-history/redeem-history';
/**
 * Generated class for the MasonRedeemTabPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-mason-redeem-tab',
  templateUrl: 'mason-redeem-tab.html',
})
export class MasonRedeemTabPage {
  page1: any = MasonRedeemListPage;
  page2: any = MasonRedeemHistoryPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
  }

}
