import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AmAchievementsSphPage } from "../am-achievements-sph/am-achievements-sph";
import { AmAchievementsTlhPage } from "../am-achievements-tlh/am-achievements-tlh";
/**
 * Generated class for the AchivementsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-achivements',
  templateUrl: 'am-achievements-tab.html',
})
export class AmAchievementsTabPage {
  page1: any = AmAchievementsSphPage;
  page2: any = AmAchievementsTlhPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AchivementsPage');
  }

}
