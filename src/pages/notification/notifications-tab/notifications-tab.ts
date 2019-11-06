import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationsNewPage } from '../notifications-new/notifications-new';
import { NotificationsArchivePage } from '../notifications-archive/notifications-archive';

@Component({
  selector: 'page-notifications-tab',
  templateUrl: 'notifications-tab.html',
})
export class NotificationsTabPage {
  page1: any = NotificationsNewPage;
  page2: any = NotificationsArchivePage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsTabPage');
  }

}
