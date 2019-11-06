import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AcAchievementsSphPage } from '../../ac/ac-achievements-sph/ac-achievements-sph';
import { AcAchievementsTlhPage } from '../../ac/ac-achievements-tlh/ac-achievements-tlh';
/**
 * Generated class for the AchivementsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-achivements',
  templateUrl: 'ac-achievements-tab.html',
})
export class AcAchievementsTabPage {
  page1: any = AcAchievementsSphPage;
  page2: any = AcAchievementsTlhPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AchivementsPage');
  }

}
