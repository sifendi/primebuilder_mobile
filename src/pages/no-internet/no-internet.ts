import { Component, NgZone } from "@angular/core";
import { ViewController, NavController, NavParams, Events } from "ionic-angular";
//import {HomePage} from '../../pages/home-page/home-page';
import { ShareService } from "../../providers/ShareService";

declare var navigator: any;
declare var Connection: any;
@Component({
  selector: "no-internet",
  templateUrl: "no-internet.html"
})
export class NoInternet {
  currView: any;
  checkInternetConnectionFlag: boolean = true;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public params: NavParams,
    public zone: NgZone,
    public events: Events,
    public shareS:ShareService
  ) {
    this.currView = params.get("instance");
    console.log("instance is", this.currView);

    this.events.subscribe('checkInternet', () => {
      this.checkInternetConnection();      
    });
  }


  ionViewDidLoad() {}

  checkInternetConnection() {
      let netCon = this.shareS.getshareData('netConnection');
      if(netCon){
          this.dismiss();
      }else{
          //this.relaodPage();
      }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
