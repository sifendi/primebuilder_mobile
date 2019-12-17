import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { AppPreferences } from '@ionic-native/app-preferences';
import {Injectable} from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import CryptoJS from 'crypto-js';

import { ALL_KEYS, ALL_MESSAGE, SITE_API,ALL_CONSTANTS } from "./constant";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Device } from '@ionic-native/device';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { SqlServices } from "./sqlService";
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import async from 'async'; 
import * as moment from 'moment';
import { Http, Response,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { LoopBackAuth }  from '../shared/loopback_sdk';
declare var window;
declare var cordova:any
declare var sessionUserGlobalData;
declare var globalInternetCheckConnection;
declare var await;
declare var allAppPendRejObj;
@Injectable()
export class appCommonMethods {
  public globaLoader;
  public currCcode:any='';
  alertVar:any;
  headers : any;
  constructor(private iab: InAppBrowser,private loopBackAuth:LoopBackAuth,private network: Network,private device:Device,private translateS:TranslateService,private fileOpener: FileOpener,public http: Http,private sqlS:SqlServices,private filePath: FilePath,private fileChooser: FileChooser,public loadingCtrl: LoadingController,public toastCtrl: ToastController,public file: File,public sanitizer: DomSanitizer,public nativeGeocoder: NativeGeocoder,public appPreferences: AppPreferences,public geolocation: Geolocation,public alertCtrl: AlertController,private transfer: Transfer, public platform: Platform ) {
    this.headers = new Headers(); 
    this.headers.append('Content-Type', 'application/json');
    this.globaLoader=this.loadingCtrl.create({
    });
  }

    getCurrCCode(){
        return ALL_CONSTANTS.COUNTRY_ID_CODE;
    }

    async getTranslatedTxt(txt:any):Promise<any> {
        return new Promise<any>((resolve,reject)=>{
        
            this.translateS.get(txt.toUpperCase()).subscribe((val)=>{
                console.log('getTranslatedTxt ok',txt,val);   
                resolve(val);
            },(err)=>{
                console.log('getTranslatedTxt error',err,txt);
                resolve(txt);
            });
            
        });
    }

    get(endpoint: string, body: any,type?:any) {
        //return this.http.post(endpoint, body, {headers: this.headers}).map(res => res.json());
        return this.http.get(endpoint).map(res => res.json());
    }

    post(endpoint: string, body: any,type?:any) {
		
		return this.http.post(endpoint, body, {headers: this.headers}).map(res => res.json());
	}

    async showToast(title,position){
    
        let toast = this.toastCtrl.create({
            message: await this.getTranslatedTxt(title),
            duration: 5000,
            position: position,
        });

        toast.present();

    }

    showLoader(message?:string)  {
        let content=message!=null && message!='' &&  message!='undefined'?message:"Please wait...";
        this.globaLoader = this.loadingCtrl.create({
        content: content
        });
        this.globaLoader.present().catch(onerror=>{console.log("err")});
    }

    hideLoader() {
            try{
            this.globaLoader.dismiss().catch(onerror=>{console.log("err")});
            }catch(error){
            console.log('error',error);
            }
    }

    async showAlert(title,buttonsText,roleAc) {

       let alertLen = document.getElementsByTagName("ion-alert").length;
        if(alertLen > 0 ){
                return false;
        }
        let textTitle = await this.getTranslatedTxt(title);

        this.alertVar = this.alertCtrl.create({
            cssClass: 'confirm', 
            title: textTitle,
            buttons: [{text:buttonsText,
                        role:'null',
                            handler: () => {
                                
                            }
            
                        }],
            enableBackdropDismiss: false
            });
        this.alertVar.present();
        //this.events.publish('alertOpen');  
    }

    dismissAlert(){
    //this.alertCtrl.dismiss 
    this.alertVar.dismiss(); 
    }

    showBusyInfinite(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(true);
            },200000)
        })
    }

    showPrompt(title,label,buttonsText,roleAc){
        this.alertVar = this.alertCtrl.create({
            cssClass: 'prompt',
            title: title,
            inputs: [
                {
                    name: label,
                    placeholder: label
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: buttonsText,
                    handler: data => {
                        console.log(" data ",data);
                        if (data) {
                            return data;
                        } else {
                            return false;
                        }
                    }
                }
            ],
            enableBackdropDismiss: false
        });
        this.alertVar.present();
    }

    clearLocalStorageItem(key) {
            return new Promise((resolve, reject) => {
            try{
                window.localStorage.removeItem(key);
                resolve(true);
            }catch(e){
                reject(e);
            }
            });
    } 

    setLocalStorageItem(key,value) {
        return new Promise((resolve, reject) => {
            try{
                let obj = CryptoJS.AES.encrypt(JSON.stringify(value), ALL_KEYS.LOCAL_STORE_KEY).toString();           
                window.localStorage.setItem(key,obj);
                resolve(true);
            }catch(e){
                reject(e);
            }
        });
    }

    setLocalStorageSingleItem(key,value) {
        return new Promise((resolve, reject) => {
            try{
                let obj = CryptoJS.AES.encrypt(JSON.stringify(value),  ALL_KEYS.LOCAL_STORE_KEY).toString();
                window.localStorage.setItem(key,obj);
                resolve(true);
            }catch(e){
                reject(e);
            }
        });
    }

    getLocalStorageItem(key) {
        return new Promise((resolve, reject) => {
            try{    
                let resJson=window.localStorage.getItem(key);
                if(resJson){
                    let bytes  = CryptoJS.AES.decrypt(resJson,  ALL_KEYS.LOCAL_STORE_KEY);
                    let resData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                    resolve(resData);   
                }else{
                    resolve(false);
                }
            }catch(e){
                reject(e);
            }
        });
    }

    getLocalStorageSingleItem(key) {
        return new Promise((resolve, reject) => {
                try{
                let resData=window.localStorage.getItem(key);
                if(resData){
                    let bytes  = CryptoJS.AES.decrypt(resData,  ALL_KEYS.LOCAL_STORE_KEY);
                    resData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                    resolve(resData);
                }else{
                    resolve(false);
                }
            }catch(e){
                reject(e);
            }
        });
    }

    openTNC(url){
        const browser = this.iab.create(encodeURI(url),'_blank', 'location=no');
    }

    jsonParseCityName(val){
        let cityNames = [];

        if(val != null && val != ''){
            let temp = JSON.parse(val);
            for(let i=0;i<temp.length;i++){
                cityNames.push(temp[i].name);
            }
            let city = cityNames.join();
            return city;
        }else{
            return false;
        }
    }

    jsonParseInTempl(val){
        if(val != null && val != ''){
            let temp = JSON.parse(val);
            return temp;
        }else{
            return false;
        }
    }

    fileOpen(fileName){
        let fileMime;
        console.log('fileOpen fileName',fileName);
        var extension = null;
        try{
            extension = fileName.split('.').pop(); 
        }catch(e){
            if(fileName['changingThisBreaksApplicationSecurity']){
                let sFileName = fileName['changingThisBreaksApplicationSecurity'];
                 extension = sFileName.split('.').pop(); 
                 fileName = fileName['changingThisBreaksApplicationSecurity'];
            }
        }
        

        fileMime = this.getMineTypes(extension);
        console.log(" fileMime ",fileMime," fileName ",fileName,' location info ',cordova.file.applicationDirectory);
        
        //const browser = this.iab.create(encodeURI(fileName),'_blank', 'location=no');
        if(extension && extension!=""){
            this.fileOpener.open(fileName,fileMime)
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error openening file', e));
        }

    }

    onlineFileOpen(file){   
        console.log('fileOpen file',file);
        //var extension = file.split('.').pop(); 
        var extension = "";
        try{
            extension = file.split('.').pop(); 
        }catch(e){
            if(file['changingThisBreaksApplicationSecurity']){
                let sFileName = file['changingThisBreaksApplicationSecurity'];
                 extension = sFileName.split('.').pop(); 
                 file = file['changingThisBreaksApplicationSecurity'];
            }
        }

        if(extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'doc' || extension.toLowerCase() == 'xlsx'){
            //window.open(encodeURI('https://docs.google.com/gview?embedded=true&url='+file), '_blank', 'location=yes,EnableViewPortScale=yes');
            const browser = this.iab.create(encodeURI('https://docs.google.com/gview?embedded=true&url='+file),'_blank', 'location=no');
        }else{
            const browser = this.iab.create(encodeURI(file),'_blank', 'location=no');
        }
    }

        // SAVE IMAGE TO LOCAL FROM BASE64
    b64toBlob(b64Data, contentType, sliceSize?:any) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    savebase64AsImageFile(filename,content,contentType){
        return new Promise((resolve, reject) => {
            const fs:string = this.file.dataDirectory;
            var DataBlob = this.b64toBlob(content,contentType);
            this.file.checkDir(fs, '').then((data) => {
                this.file.writeFile(fs, filename, DataBlob, {replace: true}).then((data) => {
                    let path = fs+data.name;
                    resolve(path);
                },(error)=>{
                
                    reject(error); 
                }); 
            },(error)=>{
            
                reject(error);
            });
        }); 
    }


    saveFile(container?:any){
        return new Promise((resolve, reject) => {
            if( this.platform.is('ios') ) {
                window.FilePicker.pickFile( (filePath)=>{
                    let extension = filePath.split('.').pop();
                    if(extension){
                        extension=extension.toLowerCase();
                    }
                    if(extension == 'xlsx' || extension == 'xls' || extension == 'pdf' || extension == 'jpg' || extension == 'png' || extension == 'doc' || extension == 'docx') {
                        let fileP = filePath.split('/').slice(0,-1);
                        let filePa = fileP.join('/');
                        let t="file://";
                        let fileName = filePath.substring(filePath.lastIndexOf('/')+1);
                        let splitFile = fileName.split(".");
                        let ext = splitFile[1]; 
                        let newFileName = 'file-'+this.getCurrentTimeStamp()+'.'+ext;
                        console.log('newFileName --',newFileName,' -- oldfilename-- ',fileName,' -- filePath-- ',filePa,' -- dataDirectory-- ', this.file.dataDirectory);
                        this.file.copyFile(t+filePa, fileName, this.file.dataDirectory, newFileName).then((data?:any) => {
                            //console.log(" copy file ",data);
                            let filePathNew = this.file.dataDirectory+newFileName;
                            console.log(" filePathNew ---- ",filePathNew);

                            let t ={};
                            t['path'] = filePathNew;
                            t['name'] = newFileName;
                            t['display_name'] = fileName;
                            t['container'] = container;
                            t['fileType'] = extension;
                            t['sync_status'] = 0;
                            t['serverPath'] = "";

                            let temp = {};
                            temp['filepath'] = this.urlSanitizer(filePathNew);
                            temp['fileArr'] = t;

                            resolve(temp);
                        }).catch(err => { 
                            this.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ENCODING_ERR,'OK',null);
                            console.log('copy error',err.message,err); reject(err); }
                        );
                    }else{
                        resolve(false);
                        //this.showAlert("Only images,pdfs,excel and doc files allowed.",'OK',null);
                    }
                },
                (errorCallback)=>{
                    // (path)=>{
                    console.log("You errorCallback this file: " + errorCallback);
                    resolve(errorCallback);
                    // }
                });
            } else {
                this.fileChooser.open().then(uri =>{
                this.filePath.resolveNativePath(uri)
                    .then(filePath => {
                        let extension = filePath.split('.').pop();
                        if(extension == 'xlsx' || extension == 'xls' || extension == 'pdf' || extension == 'jpg' || extension == 'png' || extension == 'doc' || extension == 'docx'){
                            let fileP = filePath.split('/').slice(0,-1);
                            let filePa = fileP.join('/');
                            let fileName = filePath.substring(filePath.lastIndexOf('/')+1);
                            let splitFile = fileName.split(".");
                            let ext = splitFile[1]; 
                            let newFileName = 'file-'+this.getCurrentTimeStamp()+'.'+ext;
                            console.log('newFileName --',newFileName,' -- oldfilename-- ',fileName,' -- filePath-- ',filePa,' -- dataDirectory-- ', this.file.dataDirectory);
                            this.file.copyFile(encodeURI(filePa), fileName, this.file.dataDirectory, newFileName).then((data?:any) => {
                                //console.log(" copy file ",data);
                                let filePathNew = this.file.dataDirectory+newFileName;
                                console.log(" filePathNew ---- ",filePathNew);

                                let t ={};
                                t['path'] = filePathNew;
                                t['name'] = newFileName;
                                t['display_name'] = fileName;
                                t['container'] = container;
                                t['fileType'] = extension;
                                t['sync_status'] = 0;
                                t['serverPath'] = "";

                                let temp = {};
                                temp['filepath'] = this.urlSanitizer(filePathNew);
                                temp['fileArr'] = t;

                                resolve(temp);
                            }).catch(err => { 
                                this.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ENCODING_ERR,'OK',null);
                                console.log('copy error',err.message,err); reject(err); }
                            );
                        }else{
                            resolve(false);
                            //this.showAlert("Only images,pdfs,excel and doc files allowed.",'OK',null);
                        }
                    }).catch(err => { console.log('resolveNativePath error',err.message,err); reject(err); });
                }).catch(e => { console.log('fileChooser error',e.message,e); reject(e); });
            }
        }); 
    }

    getMineTypes(extType){

            let mimeType="image/jpeg";

            if(extType=="jpeg" || extType=="jpg"){
                mimeType="image/jpeg";
            }else if(extType=="png"){
                mimeType="image/png";
            }else if(extType=="gif"){
                mimeType="image/gif";
            }else if(extType=="pdf"){
                mimeType="application/pdf";
            }else if(extType=="doc"){
                mimeType="application/msword";
            }else if(extType=="doc"){
                mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }else if(extType=="doc"){
                mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }else if(extType=="xls"){
                mimeType="application/vnd.ms-excel";
            }else if(extType=="xlsx"){
                mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }

            return mimeType;
    }


    getAddressByLatLong(lat,long){
            return new Promise((resolve, reject) => {
                let apiFullUrl=SITE_API.GOOGLE_ADDRESS_API+"?latlng="+lat+","+long+"&&sensor=true&key="+SITE_API.GOOGLE_ADDRESS_KEY;
                    console.log('apiFullUrl',apiFullUrl);
                this.http.get(apiFullUrl).subscribe((respData:Response)=>{
                        let addRDataB = respData.json();  
                        let addRData = addRDataB;
                        console.log('addRData',addRData);
                        if (addRData.results.length > 0) {
                            let address = addRData.results[0].formatted_address?addRData.results[0].formatted_address:"";
                            console.log('address',address);
                            resolve(address);
                        }else{
                            reject(false); 
                        }
                    },(error)=>{
                            reject(error); 
                    });
        });
    }

    getAddressByLatLongOld(lat,long){
        console.log("lat------>",lat);
        console.log("lat------>",long);
            return new Promise((resolve, reject) => {
                try{
                    this.nativeGeocoder.reverseGeocode(lat, long)
                    .then((result: NativeGeocoderReverseResult) => {
                        let addr ="";
                        addr +=  (result.houseNumber)?( result.houseNumber +', '):""; 
                        addr +=  (result.street)?( result.street  +', '):"";
                        addr +=  (result.city)?result.city:"" ;
                        resolve(addr);
                    })
                    .catch((error: any) => {              
                        reject(error); 
                    });
            }catch(e){
                reject(e);
            }
        });

    }
    getAddressOfCurrLocation(){
        return new Promise((resolve, reject) => {    
                    this.geolocation.getCurrentPosition().then(pos => {            
                            
                        
                        this.getAddressByLatLong(pos.coords.latitude,pos.coords.longitude).then((retD:any)=>{
                                resolve(retD);
                        },(error)=>{
                                reject(error);
                        });
                                                        
                    });

                setTimeout(()=>{
                    resolve();
                },9000);  
        });
    }

    getAddressOfCurrLocationOld(){
        return new Promise((resolve, reject) => {
                try{              
                    this.geolocation.getCurrentPosition().then(pos => {            
                                this.nativeGeocoder.reverseGeocode(pos.coords.latitude, pos.coords.longitude)
                                        .then((result: NativeGeocoderReverseResult) => {
                                            console.log(" geo data ",result)
                                            let addr ="";
                                            addr +=  (result.houseNumber)?( result.houseNumber +', '):""; 
                                            addr +=  (result.street)?( result.street  +', '):"";
                                            addr +=  (result.district)?result.district+', ':"" ;
                                            addr +=  (result.city)?" "+result.city+'.':"" ;
                                            addr +=  (result.countryName)?" "+result.countryName:"" ;
                                            addr +=  (result.postalCode)?","+result.postalCode:"" ;
                                            resolve(addr);
                                        })
                                        .catch((error: any) => {              
                                            reject(error); 
                                        });                                     
                    });

                }catch(e){
                    reject(e);
                }  

                setTimeout(()=>{
                    resolve();
                },9000);  
        });
    }


    urlSanitizer(url){
        var final_url = this.sanitizer.bypassSecurityTrustUrl(url);
        return final_url;
    }

    generateRandomString(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 8; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        }     
        return text+ Date.now().toString();
    }


    getCurrentTimeStamp(){
        let newDateUnix = moment().valueOf();
        return newDateUnix;
    }

    dateToTimeStamp(date){
        let newDateUnix = moment(date).valueOf();
        return newDateUnix;
    }


    timeStampToDate(date){
        let newDateF = moment(date).format("DD MMM YYYY");
        return newDateF;
    }



    timeStampToDateMMM(date){
        let newDateF = moment(date).format("YYYY-MM-DD");
        return newDateF;
    }

    timeStampToDateMMMnewM(date){
        let newDateF = moment(date).format("YYYY-MM-DD");
        return new Date(newDateF);
    }


    storeAppPreference(key,value){
        let obj = CryptoJS.AES.encrypt(JSON.stringify(value), ALL_KEYS.LOCAL_STORE_KEY).toString();
        return this.appPreferences.store(key, obj);
    }

    getAppPreference(key){
        return new Promise<any>((resolve,reject)=>{
            this.appPreferences.fetch(key).then(res => {
                let resData = null;
                //console.log(" appprefrence ------- resJson ",res);
                if(res){
                    let bytes  = CryptoJS.AES.decrypt(res,  ALL_KEYS.LOCAL_STORE_KEY);
                    resData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                }
                //console.log(" appprefrence res ",resData);
                resolve(resData);
            },(err)=>{
                reject(false);
            });
        });   
    }

    getGeoLocationCordinates(action?:any){
        return new Promise((resolve,reject)=>{
                let geoAnalytics = {};
                let data_capture = false;
                //this.busy=this.api.post(ALL_CONSTANTS.MOBILE_VERIFY_API,{'mobile':this.login.value.userphone,'imei':uuid},'static').subscribe(data => {
                //let Url = "https://hpb-id.hssanet.com/api/gps_logins/addEditGpslogin?access_token="+this.loopBackAuth.getAccessTokenId();
                geoAnalytics['user_id'] = sessionUserGlobalData['userId'];
                geoAnalytics['action'] = action;
                geoAnalytics['mobile_os_version'] = this.device.version;
                geoAnalytics['device_name'] = this.device.manufacturer;
                geoAnalytics['device_hardware'] = this.device.model;
                geoAnalytics['network_type'] = this.network.type;
                // geoAnalytics['NetworkStrength'] = ;
                geoAnalytics['timestamp_before_position'] = this.getCurrentTimeStamp();
                
                    try{              
                        this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((pos) => {
                            console.log("getGeoLocationCordinates true=>",pos);
                            console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
                            geoAnalytics['timestamp_after_position'] = this.getCurrentTimeStamp();
                            geoAnalytics['time_acquire_position'] = geoAnalytics['timestamp_after_position'] - geoAnalytics['timestamp_before_position'];
                            geoAnalytics['high_accuracy'] = 'success';
                            geoAnalytics['low_accuracy'] = 'na';
                            geoAnalytics['gps_accuracy'] = pos.coords.accuracy;
                            data_capture = true;
                            console.log("geoAnalytics=====>",geoAnalytics);
                            resolve(pos);
                            // this.post(Url,geoAnalytics,'static').subscribe(data => {
                            //     console.log("geoloc data=>",data);
                            //     resolve(pos);
                            // },err => {
                            //     console.log("error while inserting data --------",err);
                            //     resolve(pos);
                            // });
                            
                        },(error)=>{
                            console.log("geoloc error=>",error);
                        });
                    }catch(err){
                        try{              
                            this.geolocation.getCurrentPosition({enableHighAccuracy: false}).then(pos => {
                                console.log("getGeoLocationCordinates false=>",pos);
                                console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
                                geoAnalytics['timestamp_after_position'] = this.getCurrentTimeStamp();
                                geoAnalytics['time_acquire_position'] = geoAnalytics['timestamp_after_position'] - geoAnalytics['timestamp_before_position'];
                                geoAnalytics['high_accuracy'] = 'failure';
                                geoAnalytics['low_accuracy'] = 'success';
                                geoAnalytics['gps_accuracy'] = pos.coords.accuracy;
                                console.log("geoAnalytics=====>",geoAnalytics);
                                data_capture = true;
                                resolve(pos);
                                // this.post(Url,geoAnalytics,'static').subscribe(data => {
                                //     console.log("geoloc data=>",data);
                                //     resolve(pos);
                                // },err => {
                                //     console.log("error while inserting data --------",err);
                                //     resolve(pos);
                                // });
                            });
                        }catch(err){
                            geoAnalytics['timestamp_after_position'] = 0;
                            geoAnalytics['time_acquire_position'] = 0;
                            geoAnalytics['high_accuracy'] = 'failure';
                            geoAnalytics['low_accuracy'] = 'failure';
                            geoAnalytics['gps_accuracy'] = 0;
                            data_capture = true;
                            console.log("geoAnalytics=====>",geoAnalytics);
                            reject(err);
                            // this.post(Url,geoAnalytics,'static').subscribe(data => {
                            //     console.log("geoloc data=>",data);
                            //    reject(err); 
                            // },err => {
                            //     console.log("error while inserting data --------",err);
                            //    reject(err); 
                            // });
                            
                        }
                    }
    
                    setTimeout(()=> {
                        if(!data_capture){
                            geoAnalytics['timestamp_after_position'] = 0;
                            geoAnalytics['time_acquire_position'] = 0;
                            geoAnalytics['high_accuracy'] = 'timeout';
                            geoAnalytics['low_accuracy'] = 'timeout';
                            geoAnalytics['gps_accuracy'] = 0;
                            console.log("geoAnalytics=====>",geoAnalytics);
                            reject(false);
                            // this.post(Url,geoAnalytics,'static').subscribe(data => {
                            //     console.log("geoloc data=>",data);
                            //    reject(false); 
                            // },err => {
                            //     console.log("error while inserting data --------",err);
                            //    reject(false); 
                            // });
                        }else{
                            reject(false);
                        }
                    }, 30000);
        });   
    }

    updateMyPlanStats(hpb_type_value){
        console.log(" hpb_type_value ",hpb_type_value);
        let currDate = moment().format("YYYY-MM-DD").toString(); 
        let localDate = this.getCurrentTimeStamp();
        let hpb_type = hpb_type_value;              // contractor or mason

        let newMemberFlag;
        let visitFlag;
        let maintainFlag;
        let switchingFlag;
        let srkuFlag;
        
        if(hpb_type == 'mason'){
            newMemberFlag = 'myPlan_mason_new_member';
            visitFlag = 'myPlan_mason_visit';
            maintainFlag = 'myPlan_mason_maintain';
            switchingFlag = 'myPlan_mason_switching';
            srkuFlag = 'myPlan_mason_srku';
        }else if(hpb_type == 'contractor'){
            newMemberFlag = 'myPlan_contractor_new_member';
            visitFlag = 'myPlan_contractor_visit';
            maintainFlag = 'myPlan_contractor_maintain';
            switchingFlag = 'myPlan_contractor_switching';
            srkuFlag = 'myPlan_contractor_srku';
        }

        let newMemberTotal = 0;
        let visitTotal = 0;
        let switchingTotal = 0;
        let maintainTotal = 0;
        let srkuTotal = 0;
        let allData = [];
        
        this.getAppPreference("userCreds").then((resDataU)=>{
                
                if( resDataU != undefined && resDataU != '' ){
                        let uid=resDataU['userId'];

                        //  New member added today by sph    
                        let queryNewMember = "select count(*) as Total from hpb_master where created_by = '"+uid+"' and date(datetime(local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hpb_type = '"+hpb_type+"'";
                        let dataAr=[];

                        console.log(" queryNewMember ",queryNewMember);
                        
                        this.sqlS.selectTableQueryData(queryNewMember,dataAr).then((ressqlData:any)=>{
                            newMemberTotal = ressqlData.rows.item(0).Total;

                            let queryGetTodaysTotalCheckinsHpb = "INSERT OR REPLACE INTO todays_temp_target ( for, achieved, local_created_date) VALUES ('"+newMemberFlag+"',"+newMemberTotal+","+localDate+");";
                            console.log('queryGetTodaysTotalCheckinsHpb newMemberFlag----',queryGetTodaysTotalCheckinsHpb);
                            this.sqlS.selectTableQueryData(queryGetTodaysTotalCheckinsHpb,[]).then((resHpbData:any)=>{
                                console.log("insert data success",resHpbData.rows.item(0));
                            })

                        },(error)=>{
                            console.log('error',error);
                        });
                        
                        //  Todays total visits
                        //let queryGetTodaysTotalCheckins = "select pm.*,hm.* from hpb_master as hm JOIN project_master as pm ON hm.server_hpb_id = pm.server_hpb_id JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id where cio.check_in_out_user_id = '"+uid+"' and date(datetime(cio.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') GROUP BY hm.server_hpb_id and hm.hpb_type = '"+hpb_type+"'";
                        
                        let queryGetTodaysTotalCheckins = "select pm.*,hm.* from hpb_master as hm JOIN project_master as pm ON hm.server_hpb_id = pm.server_hpb_id JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id where cio.check_in_out_user_id = '"+uid+"' and date(datetime(cio.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' GROUP BY pm.project_id";

                        console.log(" queryGetTodaysTotalCheckins ",queryGetTodaysTotalCheckins);

                        let allDataMasonTodayList=[];
                        console.log(" queryGetTodaysTotalCheckins mason ",queryGetTodaysTotalCheckins);
                        this.sqlS.selectTableQueryData(queryGetTodaysTotalCheckins,[]).then((ressqlData:any)=>{
                            let hpbUsers = [];
                            if(ressqlData.rows.length > 0){
                                for(let i=0;i<ressqlData.rows.length;i++){
                                    visitTotal++;

                                    if(i == ressqlData.rows.length-1){
                                        let queryGetTodaysTotalCheckinsHpb = "INSERT OR REPLACE INTO todays_temp_target ( for, achieved, local_created_date) VALUES ('"+visitFlag+"',"+visitTotal+","+localDate+");";
                
                                        this.sqlS.selectTableQueryData(queryGetTodaysTotalCheckinsHpb,[]).then((resHpbData:any)=>{
                                            console.log("insert data visits",resHpbData.rows.item(0));
                                        })
                                        
                                    }
                                }
                            }
                        },(error)=>{
                            console.log('error',error);
                        });

                        // Data for maintain and switching
                        let queryGetTodaysTotalConsumption = "select pm.*,hm.*,prm.*,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' order by local_created_date DESC limit 1) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' order by local_created_date DESC limit 1) AS sa_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' order by local_created_date DESC limit 1) AS ac_approval from hpb_master as hm JOIN product_receipt_master as prm ON hm.server_hpb_id = prm.server_hpb_id JOIN product_master AS pm ON pm.server_product_id = prm.product_id where prm.created_by = '"+uid+"' and date(datetime(prm.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_status IN('maintain','switching') and hm.hpb_type = '"+hpb_type+"' and pm.is_cement = 1";
                        
                        console.log(" maintain and switching ",queryGetTodaysTotalConsumption);
                        this.sqlS.selectTableQueryData(queryGetTodaysTotalConsumption,[]).then((ressqlData:any)=>{
                            for(let i=0;i<ressqlData.rows.length;i++){
                                
                                if(ressqlData.rows.item(i).tlh_approval != -1 && ressqlData.rows.item(i).sa_approval != -1 && ressqlData.rows.item(i).ac_approval != -1){
                                    if(ressqlData.rows.item(i).hpb_status == 'switching'){
                                        let temp = (ressqlData.rows.item(i).quantity * ressqlData.rows.item(i).product_unit_value)/1000;
                                        switchingTotal = switchingTotal + temp;
                                    }else if(ressqlData.rows.item(i).hpb_status == 'maintain'){
                                        let temp = (ressqlData.rows.item(i).quantity * ressqlData.rows.item(i).product_unit_value)/1000;
                                        maintainTotal = maintainTotal + temp;                                
                                    }
                                }

                                if(i == ressqlData.rows.length-1){
                                    let queryTemp = "INSERT OR REPLACE INTO todays_temp_target ( for, achieved, local_created_date) VALUES ('"+switchingFlag+"',"+switchingTotal+","+localDate+"),('"+maintainFlag+"',"+maintainTotal+","+localDate+");";
                        
                                    this.sqlS.selectTableQueryData(queryTemp,[]).then((resHpbData:any)=>{
                                        console.log("insert data",resHpbData.rows.item(0));
                                    })
                                }
                            }
                        },(error)=>{
                            console.log('error',error);
                        });


                        // is srku projects
                        //let queryGetTodaysTotalSRKUConsumption = "select prodm.*,pm.*,prm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' order by local_created_date DESC limit 1) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' order by local_created_date DESC limit 1) AS sa_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' order by local_created_date DESC limit 1) AS ac_approval from hpb_master as hm JOIN project_master as pm ON hm.server_hpb_id = pm.server_hpb_id LEFT JOIN product_receipt_master as prm ON pm.project_id = prm.project_id JOIN product_master as prodm ON prodm.server_product_id = prm.product_id where prm.created_by = '"+uid+"' and date(datetime(prm.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' and pm.status = 1 and pm.is_srku = 1";
                        
                        let queryGetTodaysTotalSRKUConsumption = "select prodm.*,pm.*,prm.*,hm.hpb_name,hm.primary_mobile_no,hm.domicile_city,hm.hpb_status,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' order by local_created_date DESC limit 1) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' order by local_created_date DESC limit 1) AS sa_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' order by local_created_date DESC limit 1) AS ac_approval from hpb_master as hm JOIN project_master as pm ON hm.server_hpb_id = pm.server_hpb_id LEFT JOIN product_receipt_master as prm ON pm.project_id = prm.project_id JOIN product_master as prodm ON prodm.server_product_id = prm.product_id where prm.created_by = '"+uid+"' and date(datetime(prm.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' and pm.is_srku = 1 and prodm.is_cement = 1";

                        console.log( "queryGetTodaysTotalSRKUConsumption" ,queryGetTodaysTotalSRKUConsumption);
                        this.sqlS.selectTableQueryData(queryGetTodaysTotalSRKUConsumption,[]).then((ressqlData:any)=>{
                            for(let i=0;i<ressqlData.rows.length;i++){
                                if(ressqlData.rows.item(i).tlh_approval != -1 && ressqlData.rows.item(i).sa_approval != -1 && ressqlData.rows.item(i).ac_approval != -1){
                                    console.log(" is srku data ",ressqlData.rows.item(i));
                                    let temp = (ressqlData.rows.item(i).quantity * ressqlData.rows.item(i).product_unit_value) / 1000;
                                    srkuTotal = srkuTotal + temp;
                                    
                                }
                                if(i == ressqlData.rows.length-1){
                                        let queryTempSrku = "INSERT OR REPLACE INTO todays_temp_target ( for, achieved, local_created_date) VALUES ('"+srkuFlag+"',"+srkuTotal+","+localDate+");";
                                        console.log('queryTemp maintain ----',queryTempSrku);
                                        this.sqlS.selectTableQueryData(queryTempSrku,[]).then((resHpbData:any)=>{
                                            console.log("insert data",resHpbData.rows.item(0));
                                        })
                                    }
                            }
                        },(error)=>{
                            console.log('error',error);
                        });

                }else{
                    let uid="";
                }
            },(err)=>{
                console.log('err ref',err);
            });
    }

    updateMasonContractorStats(hpb_type_value){
        console.log('updateMasonContractorStats',hpb_type_value);
        let massonCurrTodayVisitTotal = 0;
        let forFlag,visitTodayTotal;
        let localDate = this.getCurrentTimeStamp();
        let visitTotal = 0;
        let allDataHome = [];
        let massonTodayVisitTotal,contractorTodayVisitTotal,retailerTodayVisitTotal,distTodayVisitTotal;

        let hpb_type = hpb_type_value;
        
        if(hpb_type == 'mason'){
            forFlag = 'mason_stats';
        }else if(hpb_type == 'contractor'){
            forFlag = 'contractor_stats';
        }
        
        let currDate = moment().format("YYYY-MM-DD").toString(); 
        
        let uid;

        this.getAppPreference("userCreds").then((resDataU)=>{
        
        if( resDataU != undefined && resDataU != '' ){
            uid=resDataU['userId'];

                // hpb type count 
                let queryAll = "select * from monthly_forecast_target where date(datetime(target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and visitor_type = '"+hpb_type+"' GROUP BY visitor_id";
                let dataArr=[];

                //console.log(" mason contractor query 1 ",queryAll);
                this.sqlS.selectTableQueryData(queryAll,dataArr).then((ressqlData:any)=>{
                    if(ressqlData.rows.length > 0){

                        for(let i=0;i<ressqlData.rows.length;i++){
                            let tempObj=ressqlData.rows.item(i);
                            allDataHome.push(tempObj);
                            if(tempObj['visitor_type']=='mason'){
                                visitTotal++;
                            }else if(tempObj['visitor_type']=='contractor'){
                                visitTotal++;
                            }
                            
                            if(i == ressqlData.rows.length-1){
                                //  Todays total visits
                                let queryGetTodaysTotalCheckins = "select pm.*,hm.* from hpb_master as hm JOIN project_master as pm ON hm.server_hpb_id = pm.server_hpb_id JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id where cio.check_in_out_user_id = '"+uid+"' and date(datetime(cio.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' GROUP BY pm.project_id";
                                let allDataMasonTodayList=[];
                                
                                //console.log(" mason contractor query 2 ",queryGetTodaysTotalCheckins);
                                this.sqlS.selectTableQueryData(queryGetTodaysTotalCheckins,[]).then((ressqlGetData:any)=>{
                                    let hpbUsers = [];
                                    
                                    for(let k=0;k<ressqlGetData.rows.length;k++){
                                        massonCurrTodayVisitTotal++;

                                        //console.log("visitTotal----",visitTotal);
                                        if(k==ressqlGetData.rows.length-1){
                                            if(isFinite(massonCurrTodayVisitTotal) == false){
                                                //console.log(" returned false ",visitTotal)
                                                return false;
                                            }
                                            let queryTempSrku = "INSERT OR REPLACE INTO todays_temp_target ( for, target,achieved, local_created_date) VALUES ('"+forFlag+"','"+visitTotal+"',"+massonCurrTodayVisitTotal+","+localDate+");";
                                            //console.log('queryTemp maintain mason dist ----',queryTempSrku);
                                            this.sqlS.selectTableQueryData(queryTempSrku,[]).then((resHpbData:any)=>{
                                                //console.log("insert data",resHpbData.rows.item(0));
                                            },(error)=>{
                                                //console.log(" query error ",error,error.message);
                                            });
                                        }
                                    }

                                
                                    if(ressqlGetData.rows.length == 0){
                                        if(typeof(visitTodayTotal) == 'undefined'){
                                            visitTodayTotal = 0;
                                        }
                                        if(isFinite(visitTodayTotal) == false){
                                            return false;
                                        }

                                        let queryTempSrku = "INSERT OR REPLACE INTO todays_temp_target ( for, target,achieved, local_created_date) VALUES ('"+forFlag+"','"+visitTotal+"',"+visitTodayTotal+","+localDate+");";
                                        
                                        //console.log(" insert temp query ",queryTempSrku);
                                        this.sqlS.selectTableQueryData(queryTempSrku,[]).then((resHpbData:any)=>{
                                            console.log("insert data",resHpbData.rows.item(0));
                                        },(error)=>{
                                            console.log(" query error ",error,error.message);
                                        });
                                    }
                                },(error)=>{
                                    console.log('error',error);
                                });

                            }

                        }
                    }else{
                        let queryGetTodaysTotalCheckins = "select pm.*,hm.* from hpb_master as hm JOIN project_master as pm ON hm.server_hpb_id = pm.server_hpb_id JOIN check_in_out as cio ON pm.project_id = cio.check_in_out_type_id where cio.check_in_out_user_id = '"+uid+"' and date(datetime(cio.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and hm.hpb_type = '"+hpb_type+"' GROUP BY pm.project_id";
                        let allDataMasonTodayList=[];
                        
                        //console.log(" mason contractor query 21 ",queryGetTodaysTotalCheckins);
                        this.sqlS.selectTableQueryData(queryGetTodaysTotalCheckins,[]).then((ressqlGetData:any)=>{
                            let hpbUsers = [];
                            
                            for(let k=0;k<ressqlGetData.rows.length;k++){
                                
                                massonCurrTodayVisitTotal++;
                                visitTodayTotal++;

                                if(k == ressqlGetData.rows.length-1){
                                    if(isFinite(massonCurrTodayVisitTotal) == false){
                                        return false;
                                    }
                                    
                                    let queryTempSrku = "INSERT OR REPLACE INTO todays_temp_target ( for, target,achieved, local_created_date) VALUES ('"+forFlag+"','"+visitTotal+"',"+massonCurrTodayVisitTotal+","+localDate+");";
                                    //console.log('queryTemp maintain mason dist ----',queryTempSrku);
                                    this.sqlS.selectTableQueryData(queryTempSrku,[]).then((resHpbData:any)=>{
                                        console.log("insert data",resHpbData.rows.item(0));
                                    },(error)=>{
                                        console.log(" query error ",error,error.message);
                                    });
                                }
                            }

                            if(ressqlData.rows.length == 0){
                                if(isFinite(visitTodayTotal) == false){
                                    return false;
                                }
                                let queryTempSrku = "INSERT OR REPLACE INTO todays_temp_target ( for,target, achieved, local_created_date) VALUES ('"+forFlag+"','0',"+visitTodayTotal+","+localDate+");";
                                
                                this.sqlS.selectTableQueryData(queryTempSrku,[]).then((resHpbData:any)=>{
                                    console.log("insert data",resHpbData.rows.item(0));
                                },(error)=>{
                                    console.log(" query error ",error,error.message);
                                });
                            }
                        },(error)=>{
                            console.log('error',error);
                        });

                    }
                    //console.log('allDataHome',allDataHome)
                },(error)=>{
                    console.log('error',error);
                });
            }else{
                uid="";
            }

        },(error)=>{
            console.log('error',error);
        });

    }


    updateRetailerDistStats(visitor_type_value){
        let visitor_type=visitor_type_value;        // retailer or distributor
        let forFlag,targetflag,acheivedFlag,uid;

        let localDate = this.getCurrentTimeStamp();

        if(visitor_type == 'retailer'){
            forFlag = 'retailer_stats';
        }else if(visitor_type == 'distributor'){
            forFlag = 'distributor_stats';
        }
        let currDate = moment().format("YYYY-MM-DD").toString(); 

                let visitTotal=0;
                let visitTodayTotal=0;
                let allDataDistTodayList = [];
                let allDataVisitedList = [];
                let allCheckInOutDatas=[];
                let nonVisitedData = [];
                let allDataMasonTodayList = [];
                let allData = [];

                this.getAppPreference("userCreds").then((resDataU)=>{
                //console.log("resDataUser",resDataU);
                if( resDataU != undefined && resDataU != '' ){
                    uid=resDataU['userId'];
                
                    // get all visited, non visited data
                    //let queryVisitedData = "select mft.*,cio.check_in_datetime,rdm.rds_name,rdm.rds_mobile,rdm.rds_phone,rdm.rds_city_name from retailer_distributor_master as rdm JOIN monthly_forecast_target as mft ON rdm.server_rds_id = mft.visitor_id LEFT JOIN check_in_out as cio ON mft.visitor_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) where mft.sph_id = '"+uid+"' and date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and rdm.rds_type = '"+visitor_type+"' and rdm.rds_status=1 GROUP BY mft.visitor_id";
                    
                    //let queryVisitedData = "select mft.*,cio.check_in_datetime,rdm.*,rdm.rds_name,rdm.rds_mobile,rdm.rds_phone,rdm.rds_city_name from retailer_distributor_master as rdm LEFT JOIN monthly_forecast_target as mft ON rdm.server_rds_id = mft.visitor_id LEFT JOIN check_in_out as cio ON rdm.server_rds_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where rdm.rds_type = '"+visitor_type+"' and rdm.rds_status=1 GROUP BY rdm.server_rds_id";

                    let queryVisitedData = "select mft.*,cio.check_in_datetime,rdm.*,rdm.rds_name,rdm.rds_mobile,rdm.rds_phone,rdm.rds_city_name from retailer_distributor_master as rdm LEFT JOIN monthly_forecast_target as mft ON rdm.server_rds_id = mft.visitor_id and date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') LEFT JOIN check_in_out as cio ON rdm.server_rds_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where rdm.rds_type = '"+visitor_type+"' and (cio.check_in_datetime IS NOT NULL OR mft.visitor_id IS NOT NULL) and rdm.rds_status=1 GROUP BY rdm.server_rds_id";
                    

                    console.log(" queryVisitedData -  ",queryVisitedData);
                    allDataVisitedList=[];
                    nonVisitedData = [];
                    this.sqlS.selectTableQueryData(queryVisitedData,[]).then((ressqlData:any)=>{
                        for(let i = 0;i<ressqlData.rows.length;i++){
                            if(ressqlData.rows.item(i).check_in_datetime != null){
                                visitTodayTotal++;
                                ressqlData.rows.item(i).proPic = '';
                                allDataVisitedList.push(ressqlData.rows.item(i));
                            }else{
                                ressqlData.rows.item(i).proPic = '';
                                nonVisitedData.push(ressqlData.rows.item(i));
                            }
                            if(ressqlData.rows.item(i).visitor_id != null){
                                visitTotal++;
                            }
                            
                            allData.push(ressqlData.rows.item(i));
                            
                            //console.log('visitTodayTotal',visitTodayTotal);
                            if(i == ressqlData.rows.length-1){
                                let queryTempSrku = "INSERT OR REPLACE INTO todays_temp_target ( for,target, achieved, local_created_date) VALUES ('"+forFlag+"',"+visitTotal+","+visitTodayTotal+","+localDate+");";
                                //console.log('queryTemp retailer distributor ----',queryTempSrku);
                                this.sqlS.selectTableQueryData(queryTempSrku,[]).then((resHpbData:any)=>{
                                    console.log("insert data",resHpbData.rows.item(0));
                                })
                            }
                        }
                    },(error)=>{
                        console.log('error',error);
                    });

                }else{
                    uid="";
                }
            },(err)=>{
                console.log('err ref',err);
            });

    }

    updateHomeSliderStats(){
        
        /*    let currDate = moment().format("YYYY-MM-DD").toString(); 
            let uid;
            let srkuTodayAchievementTarget = 0;
            let maintainTodayAchievementTarget = 0;
            let switchingTodayAchievementTarget = 0;
            let memberMonthlyCurrentTarget = 0;
            this.getAppPreference("userCreds").then((resDataU)=>{
            
            if( resDataU != undefined && resDataU != '' ){
                uid=resDataU['userId'];

                    // is srku slider content 
                    let todaysAchievedHomeStats = "SELECT prodm.*,prt.*,prt.receipt_id,prt.receipt_id,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'TLH' order by local_created_date DESC limit 1) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'SA' order by local_created_date DESC limit 1) AS sa_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'AC' order by local_created_date DESC limit 1) AS ac_approval FROM product_receipt_master AS prt JOIN product_master as prodm ON prodm.server_product_id = prt.product_id JOIN project_master AS pm ON prt.server_project_id = pm.server_project_id where pm.is_srku = 1 and prt.server_receipt_id IS NOT NULL and date(datetime(prt.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"')";
                            
                    //console.log(" todaysAchievedHomeStatsSrku --",todaysAchievedHomeStats);
                    this.sqlS.selectTableQueryData(todaysAchievedHomeStats,[]).then((ressqlDataQ:any)=>{
                        for(let i=0;i<ressqlDataQ.rows.length;i++){
                        
                            if((ressqlDataQ.rows.item(i).tlh_approval == 1) && (ressqlDataQ.rows.item(i).sa_approval != -1 && ressqlDataQ.rows.item(i).ac_approval != -1)){
                                if(ressqlDataQ.rows.item(i).quantity != null && ressqlDataQ.rows.item(i).quantity != 0){
                                    let tempCon = 0; 
                                    tempCon = (ressqlDataQ.rows.item(i).quantity * ressqlDataQ.rows.item(i).product_unit_value)/1000;
                                    srkuTodayAchievementTarget = srkuTodayAchievementTarget + tempCon;
                                }
                            }
                            if(i == ressqlDataQ.rows.length-1){
                                let queryTempSrku = "Update home_stats set todays_achievement = '"+srkuTodayAchievementTarget+"' where target_for = 'srku_vol'";
                                //console.log('queryTemp home slider isSrku ----',queryTempSrku);
                                this.sqlS.selectTableQueryData(queryTempSrku,[]).then((resHpbData:any)=>{
                                    console.log("insert data",resHpbData.rows.item(0));
                                },(error)=>{
                                    console.log(" query error srku ",error,error.message);
                                });
                            }

                        }
                    });

                    // maintain switching srku slider content 
                    let todaysAchievedHomeStatsMaintainDistribute = "SELECT hm.*,prodm.*,prt.*,prt.receipt_id,prt.receipt_id,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'TLH' order by local_created_date DESC limit 1) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'SA' order by local_created_date DESC limit 1) AS sa_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'AC' order by local_created_date DESC limit 1) AS ac_approval FROM product_receipt_master AS prt JOIN product_master as prodm ON prodm.server_product_id = prt.product_id JOIN project_master AS pm ON prt.server_project_id = pm.server_project_id JOIN hpb_master AS hm ON hm.server_hpb_id = pm.server_hpb_id where hm.hpb_status IN('switching','maintain') and prt.server_receipt_id IS NOT NULL and date(datetime(prt.local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"')";
                            
                    //console.log(" todaysAchievedHomeStatsMaintainDistribute --",todaysAchievedHomeStatsMaintainDistribute);
                    this.sqlS.selectTableQueryData(todaysAchievedHomeStatsMaintainDistribute,[]).then((ressqlDataQ:any)=>{
                        for(let i=0;i<ressqlDataQ.rows.length;i++){
                        
                            if((ressqlDataQ.rows.item(i).tlh_approval == 1) && (ressqlDataQ.rows.item(i).sa_approval != -1 && ressqlDataQ.rows.item(i).ac_approval != -1)){
                                if(ressqlDataQ.rows.item(i).quantity != null && ressqlDataQ.rows.item(i).quantity != 0){
                                    if(ressqlDataQ.rows.item(i).hpb_status == 'maintain'){
                                        let tempCon = 0; 
                                        tempCon = (ressqlDataQ.rows.item(i).quantity * ressqlDataQ.rows.item(i).product_unit_value)/1000;
                                        maintainTodayAchievementTarget = maintainTodayAchievementTarget + tempCon;
                                        //console.log(" maintainTodayAchievementTarget ",maintainTodayAchievementTarget,tempCon,ressqlDataQ.rows.item(i));
                                    }else if(ressqlDataQ.rows.item(i).hpb_status == 'switching'){
                                        let tempCon = 0; 
                                        tempCon = (ressqlDataQ.rows.item(i).quantity * ressqlDataQ.rows.item(i).product_unit_value)/1000;
                                        switchingTodayAchievementTarget = switchingTodayAchievementTarget + tempCon;
                                        //console.log(" switchingTodayAchievementTarget ",switchingTodayAchievementTarget,tempCon,ressqlDataQ.rows.item(i));
                                    }
                                }
                            }
                            if(i == ressqlDataQ.rows.length-1){
                                let queryTempSrku = "Update home_stats SET todays_achievement = '"+maintainTodayAchievementTarget+"' where target_for = 'cement_vol_maintain'";
                                //console.log('queryTemp home slider maintainTodayAchievementTarget ----',queryTempSrku);
                                this.sqlS.selectTableQueryData(queryTempSrku,[]).then((resHpbData:any)=>{
                                    console.log("insert data",resHpbData.rows.item(0));
                                },(error)=>{
                                    console.log(" query error srku ",error,error.message);
                                });

                                let queryTemp = "Update home_stats SET todays_achievement = '"+switchingTodayAchievementTarget+"' where target_for = 'cement_vol_switching'";
                                //console.log('queryTemp home slider switchingTodayAchievementTarget ----',queryTemp);
                                this.sqlS.selectTableQueryData(queryTemp,[]).then((resHpbData:any)=>{
                                    console.log("insert data",resHpbData.rows.item(0));
                                },(error)=>{
                                    console.log(" query error srku ",error,error.message);
                                });
                            }

                        }
                    });

                    let todaysAchievedHomeStatsNewMember = "select count(*) as Total from hpb_master where created_by = '"+uid+"' and date(datetime(local_created_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"')";
                    
                    //console.log(" todaysAchievedHomeStatsNewMember --",todaysAchievedHomeStatsNewMember);
                    this.sqlS.selectTableQueryData(todaysAchievedHomeStatsNewMember,[]).then((ressqlDataQ:any)=>{
                        memberMonthlyCurrentTarget = ressqlDataQ.rows.item(0).Total;
                        
                        let queryTemp = "Update home_stats SET todays_achievement = '"+memberMonthlyCurrentTarget+"' where target_for = 'new_switching_hpb'";
                        //console.log('queryTemp home slider new memebers ----',queryTemp);
                        this.sqlS.selectTableQueryData(queryTemp,[]).then((resHpbData:any)=>{
                            console.log("insert data",resHpbData.rows.item(0));
                        },(error)=>{
                            console.log(" query error srku ",error,error.message);
                        });

                    });
                    
                }else{
                    uid="";
                }

            },(error)=>{
                console.log('error',error);
            });
            

        */
    }

    projectAddCheckPrvSRKUApp(){
        return new Promise((resolve,reject)=>{
        
            let checkPSDate=new Date();  
            checkPSDate.setDate(1);
            checkPSDate.setHours(-1);
            let checkPSDate1 = checkPSDate;
            checkPSDate1.setHours(23,59,59,0);
            let checkEndPSDateT=moment(checkPSDate1).valueOf();

            let startMonthDate = checkPSDate1;
            startMonthDate.setDate(1);
            startMonthDate.setHours(0,1,1,0);
            let checkStartPSDateT=moment(startMonthDate).valueOf();

            let llMonthLastDate = startMonthDate;
            llMonthLastDate.setHours(-1);
            let llMonthLastDate1 = llMonthLastDate;
            llMonthLastDate1.setHours(23,59,59,0);
            let checkEndEndPSDateT=moment(llMonthLastDate1).valueOf();

            console.log('checkSPSDateT',checkStartPSDateT);
            console.log('checkEPSDateT',checkEndPSDateT);
            console.log('checkEndEndPSDateT',checkEndEndPSDateT);
            let queryLLm=" SELECT pm.project_id FROM project_master pm JOIN srku_approval_status_tbl sast ON pm.project_id=sast.project_id WHERE pm.status=1 AND sast.is_closed=0 AND sast.srku_approval_status=0 AND created_by="+sessionUserGlobalData['userId']+" AND ( pm.created_date <= "+checkEndEndPSDateT+" or pm.local_created_date  <= "+checkEndEndPSDateT+" ) ";
            this.sqlS.queryExecuteSql(queryLLm,[]).then((resData:any)=>{
                    console.log('queryLLms',queryLLm);
                    if(resData.rows.length>0){
                        console.log('resData.rows',resData.rows.item(0));
                        resolve(false);
                    }else{


                        let currD = new Date();
                        let currDay = currD.getDate();
                        console.log(currDay,'currDay');
                        if(currDay>2){
                        let queryLm=" SELECT pm.project_id FROM project_master pm JOIN srku_approval_status_tbl sast ON pm.project_id=sast.project_id WHERE pm.status=1 AND sast.is_closed=0 AND sast.srku_approval_status=0 AND ( ( pm.created_date >= "+checkStartPSDateT+" AND pm.created_date  <= "+checkEndPSDateT+" ) or (pm.local_created_date >= "+checkStartPSDateT+" AND pm.local_created_date  <= "+checkEndPSDateT+" ) ) ";
                        console.log('queryLm',queryLm);
                        this.sqlS.queryExecuteSql(queryLm,[]).then((resDataC:any)=>{
                                    if(resDataC.rows.length>0){
                                            console.log('resDataC.rows',resDataC.rows.item(0));
                                        resolve(false);
                                    }else{
                                        resolve(true);
                                    }
                        },(error1)=>{
                            console.log('error1',error1);
                            resolve(true);
                        });
                            
                        }else{
                            resolve(true);
                        }

                    
                    }

            },(error)=>{
                console.log('error',error);
                resolve(true);
            });
        


        });
    }

    renderTHAppStatusARP(appData){
        let returnHtml = ``;
        if(appData){
            // if(appData['tlh']){
            //     let title='';
            //     let titleColor='';
            //     let iconName='';

            //     if(appData['tlh']['approval_status']==0){
            //         // title='Pending';
            //         title = allAppPendRejObj.p;
            //         titleColor='pColor';
            //         iconName='pending';
            //     }else if(appData['tlh']['approval_status']==1){
            //         // title='Approved';
            //         title = allAppPendRejObj.a;
            //         titleColor='dColor';
            //         iconName='approved';
            //     }else if(appData['tlh']['approval_status']==-1){
            //         // title='Rejected';
            //         title = allAppPendRejObj.r;
            //         titleColor='fColor';
            //         iconName='failed';
            //     }

            //     returnHtml+=`<div class="col" >
            //                     <div class="projectWrap" >
            //                         <p class="title">${title}</p>
            //                         <span class="gridValue ${titleColor}"><i class="icon-${iconName}"></i>AC</span>
            //                     </div>
            //                 </div>`;

            //     if(appData['tlh']['approval_status']==-1){
            //     return returnHtml; 
            //     }  

            // }

            if(appData['ac']){
                let title='';
                let titleColor='';
                let iconName='';

                if(appData['ac']['approval_status']==0){
                    // title='Pending';
                    title = allAppPendRejObj.p;
                    titleColor='pColor';
                    iconName='pending';
                }else if(appData['ac']['approval_status']==1){
                    // title='Approved';
                    title = allAppPendRejObj.a;
                    titleColor='dColor';
                    iconName='approved';
                }else if(appData['ac']['approval_status']==-1){
                    // title='Rejected';
                    title = allAppPendRejObj.r;
                    titleColor='fColor';
                    iconName='failed';
                }

                returnHtml+=`<div class="col" >
                                <div class="projectWrap" >
                                    <p class="title">${title}</p>
                                    <span class="gridValue ${titleColor}"><i class="icon-${iconName}"></i>AC</span>
                                </div>
                            </div>`;

                if(appData['ac']['approval_status']==-1){
                return returnHtml; 
                } 

            }

            if(appData['sa']){
                let title='';
                let titleColor='';
                let iconName='';

                if(appData['sa']['approval_status']==0){
                    // title='Pending';
                    title = allAppPendRejObj.p;
                    titleColor='pColor';
                    iconName='pending';
                }else if(appData['sa']['approval_status']==1){
                    // title='Approved';
                    title = allAppPendRejObj.a;
                    titleColor='dColor';
                    iconName='approved';
                }else if(appData['sa']['approval_status']==-1){
                    // title='Rejected';
                    title = allAppPendRejObj.r;
                    titleColor='fColor';
                    iconName='failed';
                }

                returnHtml+=`<div class="col" >
                                <div class="projectWrap" >
                                    <p class="title">${title}</p>
                                    <span class="gridValue ${titleColor}"><i class="icon-${iconName}"></i>Admin</span>
                                </div>
                            </div>`;
            }

        }
        return returnHtml;
    }


    renderSPHAppStatusARP(appData){
        let returnHtml = ``;
        if(appData){
            // if(appData['tlh_approval'] != undefined && appData['tlh_approval'] != null ){
            //     appData['tlh_approval']=parseInt(appData['tlh_approval']); 
            //     let title='';
            //     let titleColor='';
            //     let iconName='';

            //     if(appData['tlh_approval']==0){
            //         //title='Pending';
            //         title = allAppPendRejObj.p;
            //         titleColor='pColor';
            //         iconName='pending';
            //     }else if(appData['tlh_approval']==1){
            //         //title='Approved';
            //         title = allAppPendRejObj.a;
            //         titleColor='dColor';
            //         iconName='approved';
            //     }else if(appData['tlh_approval']==-1){
            //     // title='Rejected';
            //         title = allAppPendRejObj.r;
            //         titleColor='fColor';
            //         iconName='failed';
            //     }
            

            //     returnHtml+=`<div class="col" >
            //                     <div class="projectWrap" >
            //                         <p class="title">${title}</p>
            //                         <span class="gridValue ${titleColor}"><i class="icon-${iconName}"></i>TLH</span>
            //                     </div>
            //                 </div>`;

            //     // returnHtml+=`<div class="col" >
            //     //                 <div class="projectWrap" >
            //     //                     <p class="title">${title}</p>
            //     //                     <span class="gridValue ${titleColor}"><ion-icon name="${iconName}"></ion-icon>AC</span>
            //     //                 </div>
            //     //             </div>`;

            //     if(appData['tlh_approval']==-1){
            //         return returnHtml; 
            //     }  

            // }

            if(appData['ac_approval'] != undefined && appData['ac_approval'] != null ){
                appData['ac_approval']=parseInt(appData['ac_approval']); 
                let title='';
                let titleColor='';
                let iconName='';

                if(appData['ac_approval']==0){
                    // title='Pending';
                    title = allAppPendRejObj.p;
                    titleColor='pColor';
                    iconName='pending';
                }else if(appData['ac_approval']==1){
                    // title='Approved';
                    title = allAppPendRejObj.a;
                    titleColor='dColor';
                    iconName='approved';
                }else if(appData['ac_approval']==-1){
                    // title='Rejected';
                    title = allAppPendRejObj.r;
                    titleColor='fColor';
                    iconName='failed';
                }

                returnHtml+=`<div class="col" >
                                <div class="projectWrap" >
                                    <p class="title">${title}</p>
                                    <span class="gridValue ${titleColor}"><i class="${iconName}"></i>AC</span>
                                </div>
                            </div>`;

                if(appData['ac_approval']==-1){
                    return returnHtml; 
                } 

            }

            if(appData['sa_approval'] != undefined && appData['sa_approval'] != null ){
                appData['sa_approval']=parseInt(appData['sa_approval']); 
                let title='';
                let titleColor='';
                let iconName='';

                if(appData['sa_approval']==0){
                    // title='Pending';
                    title = allAppPendRejObj.p;
                    titleColor='pColor';
                    iconName='pending';
                }else if(appData['sa_approval']==1){
                    // title='Approved';
                    title = allAppPendRejObj.a;
                    titleColor='dColor';
                    iconName='approved';
                }else if(appData['sa_approval']==-1){
                    // title='Rejected';
                    title = allAppPendRejObj.r;
                    titleColor='fColor';
                    iconName='failed';
                }

                returnHtml+=`<div class="col" >
                                <div class="projectWrap" >
                                    <p class="title">${title}</p>
                                    <span class="gridValue ${titleColor}"><i class="${iconName}"></i>Admin</span>
                                </div>
                            </div>`;
            }

        }
        return returnHtml;
    }

    renderSPHProjectAppStatusARP(appData){
        let returnHtml = ``;
            
            if( appData != undefined && appData != null ){
                appData=parseInt(appData); 
                let title='';
                let titleColor='';
                let iconName='';

                if(appData==0){
                    // title='Pending';
                    title = allAppPendRejObj.p;
                    titleColor='pColor';
                    iconName='pending';
                }else if(appData==1){
                    // title='Approved';
                    title = allAppPendRejObj.a;
                    titleColor='dColor';
                    iconName='approved';
                }else if(appData==-1){
                    // title='Rejected';
                    title = allAppPendRejObj.r;
                    titleColor='fColor';
                    iconName='failed';
                }

                returnHtml+=`<div class="col" >
                                <div class="projectWrap" >
                                    <p class="title">${title}</p>
                                    <span class="gridValue ${titleColor}"><i class="icon-${iconName}"></i>TLH</span>
                                </div>
                            </div>`;


            }
            
        return returnHtml;
    }


    getCurrentActiveUserName(){
        let currName=false;
        try{
            currName=sessionUserGlobalData['activeUserName'];
        }catch(e){

        }
        return currName;
    }


    isGpsLocationEnabledC(cf1,cf2) {
        if( this.platform.is('ios') ) {
            cordova.plugins.diagnostic.isLocationEnabled((successCallback)=>{
                cf1(successCallback);
            },(err)=>{
                console.log(err);
                cf2(err);
            });
        } else {
            cordova.plugins.diagnostic.isGpsLocationEnabled((successCallback)=>{
                cf1(successCallback);
            },(err)=>{
                console.log(err);
                cf2(err);
            });
        }
    }

    getLocationModeC(cf1,cf2) {
        if( this.platform.is('ios') ) {
            cordova.plugins.diagnostic.getLocationAuthorizationStatus((res) => {
                //if(res == 'authorized_when_in_use' || res == 'authorized' ){
                    res = 'high_accuracy';
                //}
                cf1(res);
            },(err)=>{
                console.log(err);
                cf2(err);
            });
        } else {
            cordova.plugins.diagnostic.getLocationMode((res) => {
                cf1(res);
            },(err)=>{
                console.log(err);
                cf2(err);
            });
        }

    }

    getImageLocalPathFull(imageObj) {
        if( this.platform.is('ios') ) {
            let IOS_IMG_PATH:any = cordova.file.dataDirectory; 
            if( imageObj && imageObj['name'] ){
                console.log("this.IOS_IMG_PATH+imageObj['name']---->",IOS_IMG_PATH+imageObj['name']);
                return ""+IOS_IMG_PATH+imageObj['name'];
            }else{
                return "";
            }
        } else {
            if( imageObj && imageObj['path'] ) {
                console.log("image_path=>",imageObj['path']);
                //let path = this.urlSanitizer(imageObj['path']);
                let path = imageObj['path'];
                console.log("ret image_path=>",path);
                return path;
            } else {
                return "";
            }
        }
    }


}