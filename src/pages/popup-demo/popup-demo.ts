import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { MbscModule} from '../../lib/mobiscroll/js/mobiscroll.custom.min.js';
/**
 * Generated class for the PopupDemoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-popup-demo',
  templateUrl: 'popup-demo.html',
})
export class PopupDemoPage {
  items = [{
        selected: true,
        icon: 'home',
        text: 'Home'
    }, {
        icon: 'pencil',
        text: 'Pencil'
    }, {
        disabled: true,
        icon: 'office',
        text: 'Office'
    }, {
        icon: 'pencil',
        text: 'Pencil'
    }, {
        disabled: true,
        icon: 'office',
        text: 'Office'
    }, {
        icon: 'pencil',
        text: 'Pencil'
    }, {
        disabled: true,
        icon: 'office',
        text: 'Office'
    }, {
        icon: 'pencil',
        text: 'Pencil'
    }, {
        disabled: true,
        icon: 'office',
        text: 'Office'
    }, {
        icon: 'pencil',
        text: 'Pencil'
    }, {
        disabled: true,
        icon: 'office',
        text: 'Office'
    }, {
        icon: 'pencil',
        text: 'Pencil'
    }, {
        disabled: true,
        icon: 'office',
        text: 'Office'
    }, {
        icon: 'pencil',
        text: 'Pencil'
    }, {
        disabled: true,
        icon: 'office',
        text: 'Office'
    }, {
        icon: 'pencil',
        text: 'Pencil'
    }, {
        disabled: true,
        icon: 'office',
        text: 'Office'
    }, {
        icon: 'pencil',
        text: 'Pencil'
    }, {
        disabled: true,
        icon: 'office',
        text: 'Office'
    }];
  options = {
        display: 'inline',
        select: 'single'
    };
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopupDemoPage');
  }
  presentConfirm() {
  let alert = this.alertCtrl.create({
    cssClass: 'confirm',
    title: '<p>You are now activated as SPH and can perform all activites on behalf of selected SPH.</p><p> To deactivate go to menu and select deactivate.</p>',
    enableBackdropDismiss:false,
    buttons: [
      {
        text: 'No',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Yes',
        handler: () => {
          console.log('Buy clicked');
        }
      }
    ]
  });
  alert.present();
}

presentPrompt() {
  let alert = this.alertCtrl.create({
    cssClass: 'prompt',
    title: 'Reason for Rejection',
    enableBackdropDismiss:false,
    inputs: [
      {
        name: 'comment',
        placeholder: 'Comment here',
      }
    ],
    buttons: [
      {
        text: 'Submit',
        handler: data => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  alert.present();
}

}
