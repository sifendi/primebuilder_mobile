import { ActivationRegisterPage } from '../activation-register/activation-register';
import { Component } from '@angular/core';
import { NavController,MenuController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import {  App_loginApi }  from '../../../shared/loopback_sdk';
import { ShareService } from '../../../providers/ShareService';
import {Subscription} from 'rxjs';
import { ALL_MESSAGE } from "../../../providers/constant";
declare var appTypeMainTran;
@Component({
	selector: 'page-otp',
	templateUrl: 'otp.html'
})
export class OtpPage {
	busy: Subscription;
	busyMessage:any;
	userData : any;
	userPhone : any;
	commonFunctions : any;
	pin : any;
	error : any;
	errorcount : any;
	interval : any;
	data : any;
	otpWait : any;
	otpcount : any;

	constructor(private menu: MenuController,private app_loginApi:App_loginApi,private appCom:appCommonMethods,private shareS:ShareService,public navCtrl: NavController, public navParams: NavParams) {
		this.pin = '';
		this.otpcount = 0;
		this.otpWait = 60;
		this.menu.enable(false);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad OtpPage');
		
	}

	ionViewWillLeave(){
		
	}

	add(val){
		if(this.pin.length < 6){
			this.pin = this.pin + val;
			this.error = "";
			if(this.pin.length == 6){
				//if(this.userData.otp == this.pin){
			//		this.userData.page = 'Otp';
			
				let currUserMob = this.shareS.getshareData('currUserMobile');
				console.log('currUserMob',currUserMob);
				let creads = {username:currUserMob,"twofactor":this.pin};
				console.log('creads',creads);

			   this.busyMessage = ALL_MESSAGE.COMMON_MESSAGE.PLEASE_WAIT;
			   this.busy = this.app_loginApi.loginWithCode(creads).subscribe((res)=>{
					console.log(res);
					this.shareS.setshareData('currFullUserData',res);
					this.navCtrl.setRoot(ActivationRegisterPage);
					this.pin='';
				},(err)=>{
					console.log(err);
					this.appCom.showAlert('Please enter a valid OTP','Ok',null);
					this.pin='';
				});

		
			//	}else{
				//	this.error = "Wrong otp entered";
				//	this.errorcount = this.errorcount + 1;
				//	this.pin = '';
				//}
			}
		}
	}
	
	removeBack(){
		if(this.pin.length > 0){
			this.pin = this.pin.slice(0, -1);
		}
	}

	sendOtp(){
	
		let currUserMob = this.shareS.getshareData('currUserMobile');
		let creads = {username:currUserMob};
		this.busyMessage = ALL_MESSAGE.COMMON_MESSAGE.PLEASE_WAIT;
		this.busy = this.app_loginApi.requestCode(creads).subscribe((res)=>{
					console.log(res);
					if(appTypeMainTran=="training"){
						this.appCom.showToast('Your otp is '+res['response']['otpcode'],'bottom');
					}
					this.timer();
			},(err)=>{
				console.log(err);
				this.appCom.showAlert('Please check internet connection','Ok',null);
		});

	}

	timer(){
		this.interval = setInterval(() => { 
			this.otpWait = this.otpWait - 1;
			if(this.otpWait == 0){
				this.otpWait = 60;
				clearInterval(this.interval);
			}
		}, 1000);
	}

}
