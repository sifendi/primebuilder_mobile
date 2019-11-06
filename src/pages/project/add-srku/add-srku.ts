import { ShareService } from '../../../providers/ShareService';
import { SqlServices } from '../../../providers/sqlService';
import { ALL_MESSAGE } from '../../../providers/constant';
import { DigitalSignCanvasPage } from '../../digital-sign-canvas/digital-sign-canvas';
import { ImageSelectPopPage } from '../../image-select-pop/image-select-pop';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, ModalController, NavController, NavParams, PopoverController, Platform } from 'ionic-angular';
import { ProjectListPage } from "../project-list/project-list";
import { SyncServices } from '../../../providers/syncServices';
declare var cordova;
declare var globalInternetCheckConnection;
declare var sessionUserGlobalData;
declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;
@Component({
    selector: 'add-srku',
    templateUrl: 'add-srku.html',
})
export class addSrkuPage {

    projData: any = {};
    isSrkuFlag: any = false;
    submitted: any = false;
    digitalSignPath: any;
    showLocateBtn: boolean = false;
    filePathNew: any;

    @ViewChild('SrkuOwnerName') SrkuOwnerName: any;
    @ViewChild('SrkuOwnerAddress') SrkuOwnerAddress: any;
    @ViewChild('SrkuProvince') SrkuProvince: any;
    @ViewChild('SrkuCity') SrkuCity: any;
    @ViewChild('SrkuSubDistrict') SrkuSubDistrict: any;
    @ViewChild('SrkuPincode') SrkuPincode: any;
    @ViewChild('SrkuOwnerMobileNumber') SrkuOwnerMobileNumber: any;
    @ViewChild('FloorSize') FloorSize: any;
    @ViewChild('NumberOfUnit') NumberOfUnit: any;
    @ViewChild('IsMicroCredit') IsMicroCredit: any;

    @ViewChild('BankName') BankName: any;
    @ViewChild('BankDocument') BankDocument: any;
    @ViewChild('NonMicroCreditType') NonMicroCreditType: any;
    @ViewChild('NonMicroCreditTypeMid') NonMicroCreditTypeMid: any;
    @ViewChild('NMCDocument') NMCDocument: any;
    @ViewChild('AdditionalComments') AdditionalComments: any;
    @ViewChild('HpbDigitalSign') HpbDigitalSign: any;
    @ViewChild('pincodeMob') pincodeMob: any;  
    @ViewChild('ProvinceMob') ProvinceMob: any;  
    @ViewChild('CityMob') CityMob: any;  
    @ViewChild('SubDistrictMob') SubDistrictMob: any;

    bankDocPhotosObj: any = [];
    nmcDocPhotosObj: any = [];
    disableFieldsFlag: any = false;

    allAddressDataG: any = [];
    postalCodeArrG: any = [];
    provinceArrG: any = [];
    municipalityArrG: any = [];
    subDistrictArrG: any = [];

    allAddressDataF: any = [];
    postalCodeArrF: any = [];
    provinceArrF: any = [];
    municipalityArrF: any = [];
    subDistrictArrF: any = [];

    NMCTypes: any = [];

    check: any = false;
    busy: Promise < any > ;
    busy1: Promise < any > ;
    busyMessage: any;
    base64subscription: any;
    signatureShow: any = true; //DEPENDS ON IF IF HPB ASSIGNED 
    userId: any;
    serverHpbId: any = [];



    /* F Address Mater : Start */

    mobiScollSrkuProvinceSettings: any = {
        inputClass: 'text-input',
        theme: 'material',
        showOnFocus: true,
        group: false,
        filter: true,
        filterEmptyText:filterEmptyText,
        filterPlaceholderText:filterPlaceholderText,
        placeholder: mobisPlaceHolderWaitTxtTransl,
        rows: 8,
        data: [],
        readonly: false,
        buttons: mobisBtnArr,

        onClear: (event, inst) => {
            this.projData.SrkuCity = null;
            this.projData.SrkuSubDistrict = null;
            this.projData.SrkuPincode = null;
        },
        onSet: (event, inst) => {
            if(event.valueText){
                this.addressDataFiltersF(event.valueText, 'province');
            }else{

            }
            
        },
        // onFilter: (event, inst) => {
        //     let filtered: any[] = [];
        //     let query = event.filterText;
        //     this.provinceArrF = [];
        //     for (let i = 0; i < this.provinceArrG.length; i++) {
        //         let currData = this.provinceArrG[i];
        //         if (query == '' || query == null) {
        //             this.provinceArrF.push({
        //                 text: currData.text,
        //                 value: currData.value,
        //             });
        //             if (i == 50) {
        //                 break;
        //             }
        //         } else if (currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
        //             this.provinceArrF.push({
        //                 text: currData.text,
        //                 value: currData.value,
        //             });
        //             if (i == 50) {
        //                 break;
        //             }
        //         }


        //     }
        // }
    };
    mobiScollSrkuCitySettings: any = {
        inputClass: 'text-input',
        theme: 'material',
        showOnFocus: true,
        group: false,
        filter: true,
        filterEmptyText:filterEmptyText,
        filterPlaceholderText:filterPlaceholderText,
        placeholder: mobisPlaceHolderWaitTxtTransl,
        rows: 8,
        data: [],
        readonly: false,
        buttons: mobisBtnArr,
        onClear: (event, inst) => {
            this.projData.SrkuSubDistrict = null;
            this.projData.SrkuPincode = null;
        },
        onSet: (event, inst) => {
            if(event.valueText){
                this.addressDataFiltersF(event.valueText, 'citykabname');
            }else{

            }
            
        },
        // onFilter: (event, inst) => {
        //     console.log('onFilter ', event);
        //     let filtered: any[] = [];
        //     let query = event.filterText;
        //     this.municipalityArrF = [];
        //     for (let i = 0; i < this.municipalityArrG.length; i++) {
        //         let currData = this.municipalityArrG[i];
        //         if (query == '' || query == null) {
        //             this.municipalityArrF.push({
        //                 text: currData.text,
        //                 value: currData.value,
        //             });
        //             if (i == 50) {
        //                 break;
        //             }
        //         } else if (currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
        //             this.municipalityArrF.push({
        //                 text: currData.text,
        //                 value: currData.value,
        //             });
        //             if (i == 50) {
        //                 break;
        //             }
        //         }


        //     }
        // }
    };
    mobiScollSrkuSubDistrictSettings: any = {
        inputClass: 'text-input',
        theme: 'material',
        showOnFocus: true,
        group: false,
        filter: true,
        filterEmptyText:filterEmptyText,
        filterPlaceholderText:filterPlaceholderText,
        placeholder: mobisPlaceHolderWaitTxtTransl,
        rows: 8,
        data: [],
        readonly: false,
        buttons: mobisBtnArr,
        onClear: (event, inst) => {

            this.projData.SrkuPincode = null;
        },
        onSet: (event, inst) => {
            if(event.valueText){
                this.addressDataFiltersF(event.valueText, 'subdistrict');
            }else{

            }
            
        },
        // onFilter: (event, inst) => {
        //     console.log('onFilter ', event);
        //     let filtered: any[] = [];
        //     let query = event.filterText;
        //     this.subDistrictArrF = [];
        //     for (let i = 0; i < this.subDistrictArrG.length; i++) {
        //         let currData = this.subDistrictArrG[i];
        //         if (query == '' || query == null) {
        //             this.subDistrictArrF.push({
        //                 text: currData.text,
        //                 value: currData.value,
        //             });
        //             if (i == 50) {
        //                 break;
        //             }
        //         } else if (currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
        //             this.subDistrictArrF.push({
        //                 text: currData.text,
        //                 value: currData.value,
        //             });
        //             if (i == 50) {
        //                 break;
        //             }
        //         }


        //     }
        // }
    };
    mobiScollSrkuPincodeSettings: any = {
        inputClass: 'text-input',
        theme: 'material',
        showOnFocus: true,
        group: false,
        filter: true,
        filterEmptyText:filterEmptyText,
        filterPlaceholderText:filterPlaceholderText,
        placeholder: mobisPlaceHolderWaitTxtTransl,
        rows: 8,
        data: [],
        readonly: false,
        buttons: mobisBtnArr,
        onClear: (event, inst) => {

            this.projData.SrkuCity = null;
            this.projData.SrkuSubDistrict = null;
            this.projData.SrkuProvince = null;
            this.postalCodeArrF = [];
            for (let i = 0; i < this.postalCodeArrG.length; i++) {
                this.postalCodeArrF.push({
                    text: this.postalCodeArrG[i].text,
                    value: this.postalCodeArrG[i].value,
                });
                // if (i == 50) {
                //     break;
                // }
            }
            this.pincodeMob.instance.option({
                data: this.postalCodeArrF
              });
            this.provinceArrF = [];
            for (let i = 0; i < this.provinceArrG.length; i++) {
                this.provinceArrF.push({
                    text: this.provinceArrG[i].text,
                    value: this.provinceArrG[i].value,
                });
                // if (i == 50) {
                //     break;
                // }
            }
            this.ProvinceMob.instance.option({
                data: this.provinceArrF
              });
        },
        onSet: (event, inst) => {
            if(event.valueText){
                this.addressDataFiltersF(event.valueText, 'postalcode');
            }else{

            }
        },
        // onFilter: (event, inst) => {
        //     console.log('onFilter ', event);
        //     let filtered: any[] = [];
        //     let query = event.filterText;
        //     this.postalCodeArrF = [];
        //     for (let i = 0; i < this.postalCodeArrG.length; i++) {
        //         let currData = this.postalCodeArrG[i];
        //         if (query == '' || query == null) {
        //             this.postalCodeArrF.push({
        //                 text: currData.text,
        //                 value: currData.value,
        //             });
        //             if (i == 50) {
        //                 break;
        //             }
        //         } else if (currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
        //             this.postalCodeArrF.push({
        //                 text: currData.text,
        //                 value: currData.value,
        //             });
        //             if (i == 50) {
        //                 break;
        //             }
        //         }


        //     }
        // }
    };

    /* F Address Mater : End */

    constructor(private syncS: SyncServices, private platform: Platform, public navCtrl: NavController, public navParams: NavParams, public events: Events, public appCom: appCommonMethods, public popoverCtrl: PopoverController, public modalCtrl: ModalController, public sqlS: SqlServices) {

        //GET CURRENT USER DATA
        this.userId = sessionUserGlobalData['userId'];
    }

    async ionViewDidEnter() {
        this.showLocateBtn = globalInternetCheckConnection;
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
        this.check = false;

        // Get project Types
        var selectField = " `server_id` , `nmc_type` ";
        var where = " status = 1 ";
        var tablename = "nmc_tbl";
        this.sqlS.selectTableData(selectField, tablename, where, "", "").then((data) => {
            for (var i = 0; i < data['rows'].length; i++) {
                this.NMCTypes.push(data['rows'].item(i));
            }
            console.log(" projectTypes ---- ", this.NMCTypes);
        });




        this.projData = [];
        this.projData = this.navParams.get("projData");
        console.log("this.projData", this.projData);

        //CHECK IF PROJECT IS SRKU OR NOT-SRKU
        if (this.projData['IsSrku'] == 'yes') {
            this.isSrkuFlag = true;
        } else if (this.projData['IsSrku'] == 'no') {
            this.isSrkuFlag = false;
        }

        //GET SERVER HPB ID
        if (this.projData['HpbId'] != undefined && this.projData['HpbId'] != "") {
            var selectField = " `server_hpb_id` ";
            var where = " hpb_id = " + this.projData['HpbId'];
            var tablename = "hpb_master";
            this.sqlS.selectTableData(selectField, tablename, where, "", "").then((data) => {
                this.serverHpbId = (data['rows'].item(0));
                console.log(" serverHpbId ---- ", this.serverHpbId);
            });
        }




        setTimeout(() => {
            let action = this.navParams.get("action");
            if (action == 'edit') {
                //edit form

                this.disableFieldsFlag = true;

                console.log("this.projData.BankDocument------->", this.projData.BankDocument);
                if (this.projData.BankDocument != "" && this.projData.BankDocument != undefined && Array.isArray(this.projData.BankDocument)) {
                    var bankPhoto = this.projData.BankDocument;
                    this.projData.BankDocument = this.projData.BankDocument;
                    if (bankPhoto != undefined && bankPhoto != '') {
                        //let tempBObj=[] 
                        for (var i = 0; i < bankPhoto.length; i++) {
                            //tempBObj.push(this.appCom.urlSanitizer(bankPhoto[i]));
                            if (bankPhoto[i]['fileType'] == 'jpg' || bankPhoto[i]['fileType'] == 'png' || bankPhoto[i]['fileType'] == 'jpeg') {
                                //this.bankDocPhotosObj.push(  bankPhoto[i]['path'] );
                                this.bankDocPhotosObj.push(this.appCom.getImageLocalPathFull(bankPhoto[i]));
                            } else {
                                this.bankDocPhotosObj.push('assets/images/document.jpg');
                            }
                        }
                        //this.bankDocPhotosObj.concat(tempBObj);
                    }
                } else if (this.projData.BankDocument != "" && this.projData.BankDocument != undefined) {
                    var bankPhoto = JSON.parse(this.projData.BankDocument);
                    this.projData.BankDocument = JSON.parse(this.projData.BankDocument);
                    if (bankPhoto != undefined && bankPhoto != '') {
                        //let tempBObj=[]
                        for (var i = 0; i < bankPhoto.length; i++) {
                            // tempBObj.push(this.appCom.urlSanitizer(bankPhoto[i]));
                            if (bankPhoto[i]['fileType'] == 'jpg' || bankPhoto[i]['fileType'] == 'png' || bankPhoto[i]['fileType'] == 'jpeg') {
                                //this.bankDocPhotosObj.push(bankPhoto[i]['path']);
                                this.bankDocPhotosObj.push(this.appCom.getImageLocalPathFull(bankPhoto[i]));
                            } else {
                                this.bankDocPhotosObj.push('assets/images/document.jpg');
                            }
                        }
                        //this.bankDocPhotosObj.concat(tempBObj);
                    }
                } else {
                    if (this.projData.BankDocument.length == 0) {
                        this.projData.BankDocument = [];
                    }
                }


                if (this.projData.NMCDocument != "" && this.projData.NMCDocument != undefined && Array.isArray(this.projData.NMCDocument)) {
                    var nmcPhoto = this.projData.NMCDocument;
                    this.projData.NMCDocument = this.projData.NMCDocument;
                    if (nmcPhoto != undefined && nmcPhoto != '') {
                        // let tempNObj=[]
                        for (var i = 0; i < nmcPhoto.length; i++) {
                            // tempNObj.push(this.appCom.urlSanitizer(nmcPhoto[i]));
                            if (nmcPhoto[i]['fileType'] == 'jpg' || nmcPhoto[i]['fileType'] == 'png' || nmcPhoto[i]['fileType'] == 'jpeg') {
                                //this.nmcDocPhotosObj.push(nmcPhoto[i]['path']);
                                this.nmcDocPhotosObj.push(this.appCom.getImageLocalPathFull(nmcPhoto[i]));
                            } else {
                                this.nmcDocPhotosObj.push('assets/images/document.jpg');
                            }
                        }
                    }
                } else if (this.projData.NMCDocument != "" && this.projData.NMCDocument != undefined) {
                    var nmcPhoto = JSON.parse(this.projData.NMCDocument);
                    this.projData.NMCDocument = JSON.parse(this.projData.NMCDocument);
                    if (nmcPhoto != undefined && nmcPhoto != '') {
                        for (var i = 0; i < nmcPhoto.length; i++) {
                            if (nmcPhoto[i]['fileType'] == 'jpg' || nmcPhoto[i]['fileType'] == 'png' || nmcPhoto[i]['fileType'] == 'jpeg') {
                                //this.nmcDocPhotosObj.push(nmcPhoto[i]['path']);
                                this.nmcDocPhotosObj.push(this.appCom.getImageLocalPathFull(nmcPhoto[i]));
                            } else {
                                this.nmcDocPhotosObj.push('assets/images/document.jpg');
                            }
                        }
                    }
                } else {
                    if (this.projData.NMCDocument.length == 0) {
                        this.projData.NMCDocument = [];
                    }
                }
                console.log("this.bankDocPhotosObj---------->", this.bankDocPhotosObj);
                //ds[0]['path']
                let ds = [];
                ds = this.projData.HpbDigitalSign;
                if (this.projData.HpbDigitalSign != undefined && this.projData.HpbDigitalSign != '' && this.projData.HpbDigitalSign.length > 0) {
                    //this.digitalSignPath = this.appCom.urlSanitizer(ds[0]['path']);
                    this.digitalSignPath = this.appCom.getImageLocalPathFull(ds[0]);
                    this.projData.HpbDigitalSign = this.projData.HpbDigitalSign;
                } else {
                    this.digitalSignPath = "";
                }



            } else {


                if (this.projData.BankDocument != "" && this.projData.BankDocument != undefined && Array.isArray(this.projData.BankDocument)) {
                    var bankPhoto = this.projData.BankDocument;
                    this.projData.BankDocument = this.projData.BankDocument;
                    if (bankPhoto != undefined && bankPhoto != '') {
                        //let tempBObj=[] 
                        for (var i = 0; i < bankPhoto.length; i++) {
                            //tempBObj.push(this.appCom.urlSanitizer(bankPhoto[i]));
                            if (bankPhoto[i]['fileType'] == 'jpg' || bankPhoto[i]['fileType'] == 'png' || bankPhoto[i]['fileType'] == 'jpeg') {
                                //this.bankDocPhotosObj.push(bankPhoto[i]['path']);
                                this.bankDocPhotosObj.push(this.appCom.getImageLocalPathFull(bankPhoto[i]));
                            } else {
                                this.bankDocPhotosObj.push('assets/images/document.jpg');
                            }
                        }
                        //this.bankDocPhotosObj.concat(tempBObj);
                    }
                } else if (this.projData.BankDocument != "" && this.projData.BankDocument != undefined) {
                    var bankPhoto = JSON.parse(this.projData.BankDocument);
                    this.projData.BankDocument = JSON.parse(this.projData.BankDocument);
                    if (bankPhoto != undefined && bankPhoto != '') {
                        //let tempBObj=[]
                        for (var i = 0; i < bankPhoto.length; i++) {
                            // tempBObj.push(this.appCom.urlSanitizer(bankPhoto[i]));
                            if (bankPhoto[i]['fileType'] == 'jpg' || bankPhoto[i]['fileType'] == 'png' || bankPhoto[i]['fileType'] == 'jpeg') {
                                //this.bankDocPhotosObj.push(bankPhoto[i]['path']);
                                this.bankDocPhotosObj.push(this.appCom.getImageLocalPathFull(bankPhoto[i]));
                            } else {
                                this.bankDocPhotosObj.push('assets/images/document.jpg');
                            }
                        }
                        //this.bankDocPhotosObj.concat(tempBObj);
                    }
                } else {
                    if (this.projData.BankDocument.length == 0) {
                        this.projData.BankDocument = [];
                    }
                }


                if (this.projData.NMCDocument != "" && this.projData.NMCDocument != undefined && Array.isArray(this.projData.NMCDocument)) {
                    var nmcPhoto = this.projData.NMCDocument;
                    this.projData.NMCDocument = this.projData.NMCDocument;
                    if (nmcPhoto != undefined && nmcPhoto != '') {
                        // let tempNObj=[]
                        for (var i = 0; i < nmcPhoto.length; i++) {
                            // tempNObj.push(this.appCom.urlSanitizer(nmcPhoto[i]));
                            if (nmcPhoto[i]['fileType'] == 'jpg' || nmcPhoto[i]['fileType'] == 'png' || nmcPhoto[i]['fileType'] == 'jpeg') {
                                //this.nmcDocPhotosObj.push(nmcPhoto[i]['path']);
                                this.nmcDocPhotosObj.push(this.appCom.getImageLocalPathFull(nmcPhoto[i]));
                            } else {
                                this.nmcDocPhotosObj.push('assets/images/document.jpg');
                            }
                        }
                    }
                } else if (this.projData.NMCDocument != "" && this.projData.NMCDocument != undefined) {
                    var nmcPhoto = JSON.parse(this.projData.NMCDocument);
                    this.projData.NMCDocument = JSON.parse(this.projData.NMCDocument);
                    if (nmcPhoto != undefined && nmcPhoto != '') {
                        for (var i = 0; i < nmcPhoto.length; i++) {
                            if (nmcPhoto[i]['fileType'] == 'jpg' || nmcPhoto[i]['fileType'] == 'png' || nmcPhoto[i]['fileType'] == 'jpeg') {
                                //this.nmcDocPhotosObj.push(nmcPhoto[i]['path']);
                                this.nmcDocPhotosObj.push(this.appCom.getImageLocalPathFull(nmcPhoto[i]));
                            } else {
                                this.nmcDocPhotosObj.push('assets/images/document.jpg');
                            }
                        }
                    }
                } else {
                    if (this.projData.NMCDocument.length == 0) {
                        this.projData.NMCDocument = [];
                    }
                }

            }
        }, 300);

        //CHECK IF HPB IS ASSIGNED THEN ALLO SIGN..
        if (this.projData['HpbId'] != undefined && this.projData['HpbId'] != '' && this.projData['HpbId']) {
            this.signatureShow = true;
        } else {
            this.signatureShow = false;
        }


        //SUBSCRIPTION FOR CAMERA OR GALLERY PHOTO CAPTURED..
        this.events.unsubscribe("getbase64Image");
        this.base64subscription = this.events.subscribe('getbase64Image', (base64ImgOBJ) => {
            console.log("nmc---->", this.projData.BankDocument);
            console.log("bank---->", this.projData.NMCDocument);

            let base64Image = base64ImgOBJ.base64Image;
            let extType = ".jpeg";
            var filename = this.appCom.generateRandomString() + extType;

            this.appCom.savebase64AsImageFile(filename, base64Image, extType).then((path) => {

                    if (base64ImgOBJ.photo_source == "bank_doc_photo") {
                        //IF BANK DOC MULTIPLE PICS
                        this.bankDocPhotosObj.push(this.appCom.urlSanitizer(path));
                        if (this.projData.BankDocument != undefined && this.projData.BankDocument != "") {
                            let t = {};
                            t['path'] = path;
                            t['name'] = filename;
                            t['fileType'] = "jpeg";
                            t['serverPath'] = "";
                            t['sync_status'] = 0;
                            t['container'] = "doc";
                            this.projData.BankDocument.push(t);
                        } else {
                            this.projData.BankDocument = [];
                            let t = {};
                            t['path'] = path;
                            t['name'] = filename;
                            t['fileType'] = "jpeg";
                            t['serverPath'] = "";
                            t['sync_status'] = 0;
                            t['container'] = "doc";
                            this.projData.BankDocument.push(t);
                        }

                    } else if (base64ImgOBJ.photo_source == "digital_sign") {
                        //IF DIGITAL SIGN PICTURE
                        this.projData.HpbDigitalSign = path;
                        this.digitalSignPath = this.appCom.urlSanitizer(path);
                        let t = {};
                        t['path'] = path;
                        t['name'] = filename;
                        t['fileType'] = "jpeg";
                        t['sync_status'] = 0;
                        t['serverPath'] = "";
                        t['container'] = "doc";
                        let tArr = [];
                        tArr.push(t);
                        this.projData.HpbDigitalSign = (tArr);


                    } else if (base64ImgOBJ.photo_source == "nmc_doc_photo") {
                        //IF NMC DOC MULTIPLE PICS
                        this.nmcDocPhotosObj.push(this.appCom.urlSanitizer(path));
                        if (this.projData.NMCDocument != undefined && this.projData.NMCDocument != "") {
                            let t = {};
                            t['path'] = path;
                            t['name'] = filename;
                            t['fileType'] = "jpeg";
                            t['serverPath'] = "";
                            t['sync_status'] = 0;
                            t['container'] = "doc";
                            this.projData.NMCDocument.push(t);
                        } else {
                            this.projData.NMCDocument = [];
                            let t = {};
                            t['path'] = path;
                            t['name'] = filename;
                            t['fileType'] = "jpeg";
                            t['serverPath'] = "";
                            t['sync_status'] = 0;
                            t['container'] = "doc";
                            this.projData.NMCDocument.push(t);
                        }


                    } else if (base64ImgOBJ.photo_source == "docNmc") {
                        let container = "doc";
                        this.appCom.saveFile(container).then((dataFile ? : any) => {
                            console.log(" file data ", dataFile);
                            if (!dataFile) {
                                this.appCom.showAlert("Only images,pdfs,excel and doc files allowed.", 'OK', null);
                            } else {
                                this.projData.NMCDocument.push(dataFile.fileArr);
                                if (dataFile.fileArr.fileType == 'jpeg' || dataFile.fileArr.fileType == 'jpg' || dataFile.fileArr.fileType == 'png') {
                                    this.nmcDocPhotosObj.push(dataFile.filepath);
                                } else {
                                    this.nmcDocPhotosObj.push('assets/images/document.jpg');
                                }
                            }
                        });
                    } else if (base64ImgOBJ.photo_source == "docBank") {
                        let container = "doc";
                        this.appCom.saveFile(container).then((dataFile ? : any) => {
                            console.log(" file data ", dataFile);
                            if (!dataFile) {
                                this.appCom.showAlert("Only images,pdfs,excel and doc files allowed.", 'OK', null);
                            } else {
                                this.projData.BankDocument.push(dataFile.fileArr);
                                if (dataFile.fileArr.fileType == 'jpeg' || dataFile.fileArr.fileType == 'jpg' || dataFile.fileArr.fileType == 'png') {
                                    this.bankDocPhotosObj.push(dataFile.filepath);
                                } else {
                                    this.bankDocPhotosObj.push('assets/images/document.jpg');
                                }
                            }
                        });
                    }




                }, (error) => {
                    console.log(error);
                }

            );

        });


        this.busy = this.getAddressData().then(() => {

            this.busy = this.addressInitInput().then(() => {

                if (this.projData.SrkuPincode && this.projData.SrkuPincode != '') {
                    this.addressDataFiltersF(this.projData.SrkuPincode, 'postalcode');
                }

            }, () => {

            });

        }, () => {

        });


    }

    /*ionViewDidEnter(){
      this.check=false;
    }*/

    ionViewDidLeave() {
        // console.log("leave page");
        // var b=  this.events.unsubscribe("getbase64Image");  
        // console.log("unsubscribed",b);
    }



    getAddress() {
        this.appCom.isGpsLocationEnabledC((successCallback) => {
            if (successCallback) {
                this.appCom.getLocationModeC((res) => {
                    console.log("res", res);
                    //if (res == 'high_accuracy') {

                        this.busy = this.appCom.getAddressOfCurrLocation().then((address) => {
                            if (address) {
                                this.projData['SrkuOwnerAddress'] = address;
                            }
                        }, (error) => {
                            console.log(error);
                        });


                    // } else {
                    //     //show pop up for set high accuracy..
                    //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR, "Ok", "");
                    //     this.busy = this.appCom.getAddressOfCurrLocation().then((address) => {
                    //         if (address) {
                    //             this.projData['SrkuOwnerAddress'] = address;
                    //         }
                    //     }, (error) => {
                    //         console.log(error);
                    //     });

                    // }
                }, (err) => {
                    console.log(err);
                });
            } else {
                //show alert enable gps
                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR, "Ok", "");

            }

        }, (err) => {
            console.log(err);
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR, "Ok", "");

        });
    }

    addProject() {

        this.submitted = true;
        let isvalid = false;

        if (this.check == false) {
            this.check = false;
            //IF TYPE IS SRKU

            if (this.isSrkuFlag) {
                isvalid = this.SrkuOwnerName.valid && this.SrkuOwnerAddress.valid && this.SrkuProvince.valid && this.SrkuCity.valid && this.SrkuSubDistrict.valid &&
                    this.SrkuPincode.valid && this.SrkuOwnerMobileNumber.valid && this.FloorSize.valid && this.NumberOfUnit.valid && this.IsMicroCredit.valid &&
                    this.SrkuOwnerName.value != undefined && this.SrkuOwnerName.value != "" && this.SrkuOwnerName.value.trim() != undefined && this.SrkuOwnerName.value.trim() != "" &&
                    this.SrkuOwnerAddress.value != undefined && this.SrkuOwnerAddress.value != "" && this.SrkuOwnerAddress.value.trim() != undefined && this.SrkuOwnerAddress.value.trim() != "";

                /* un-coment to allow signature capture

                              if( this.projData['HpbId'] != undefined && this.projData['HpbId'] != '' && this.projData['HpbId'] >0 ){
                                  isvalid = isvalid && this.digitalSignPath !='' && this.digitalSignPath !=undefined;   
                              }else{
                                  //nothing 
                              }
                */

                if (this.IsMicroCredit.value == 1) {
                    isvalid = isvalid && this.BankName.valid && this.bankDocPhotosObj != undefined && this.bankDocPhotosObj != '' &&
                        this.BankName.value != undefined && this.BankName.value != "" && this.BankName.value.trim() != undefined && this.BankName.value.trim() != "";
                    console.log("isvalid2", isvalid);
                } else if (this.IsMicroCredit.value == 0) {
                    isvalid = isvalid && this.NonMicroCreditType.valid && this.nmcDocPhotosObj != undefined && this.nmcDocPhotosObj != '';
                    console.log("isvalid3", isvalid);
                }

                //IF TYPE IS NOT SRKU
            } else if (!this.isSrkuFlag) {
                isvalid = true;
                if (this.projData['HpbId'] != undefined && this.projData['HpbId'] != '' && this.projData['HpbId'] > 0) {
                    /* isvalid = this.digitalSignPath !='' && this.digitalSignPath !=undefined;    un-coment to allow signature capture */
                } else {
                    //nothing
                    console.log("no sign no srku");
                    isvalid = true;
                }
            } else {

            }


            console.log("isvalid4", isvalid);
            if (isvalid) {
                //VALID  
                console.log("projData", this.projData);
                console.log("valid");




                //SAVE PROJECT TO DATABASE
                let insertData = {};
                //insertData['hpb_id']=this.projData['HpbId'];
                insertData['server_hpb_id'] = this.projData['HpbId'];
                insertData['project_name'] = this.projData['ProjectName'].trim();
                insertData['project_completion_date'] = this.appCom.dateToTimeStamp((this.projData['ProjectCompletionDate']));
                insertData['project_quantity_estimation'] = this.projData['ProjectQuantityEstimation'];
                insertData['project_type'] = this.projData['ProjectType'];
                insertData['project_type_mid'] = this.projData['ProjectTypeId'];
                insertData['project_stage'] = this.projData['ProjectStage'];
                insertData['project_stage_mid'] = this.projData['ProjectStageId'];
                console.log(" this.projData.ProjectPhoto while insert", this.projData.ProjectPhoto);
                if (this.projData.ProjectPhoto != undefined && this.projData.ProjectPhoto != '' && this.projData.ProjectPhoto.length > 0) {
                    insertData['project_photo'] = JSON.stringify(this.projData.ProjectPhoto);
                } else {
                    insertData['project_photo'] = '';
                }

                insertData['project_address'] = this.projData['ProjectAddress'].trim();
                insertData['project_province'] = this.projData['ProjectProvince'];
                insertData['project_city'] = this.projData['ProjectCity'];
                insertData['project_sub_district'] = this.projData['ProjectSubDistrict'];
                insertData['project_pincode'] = this.projData['ProjectPincode'];
                insertData['is_srku'] = (this.projData['IsSrku'] == 'no') ? 0 : 1;






                if (this.projData['SrkuOwnerName'] != undefined && this.projData['SrkuOwnerName'] != '') {
                    insertData['srku_owner_name'] = this.projData['SrkuOwnerName'].trim();
                }
                if (this.projData['SrkuOwnerAddress'] != undefined && this.projData['SrkuOwnerAddress'] != '') {
                    insertData['srku_owner_address'] = this.projData['SrkuOwnerAddress'].trim();
                }
                if (this.projData['BankName'] != undefined && this.projData['BankName'] != '') {
                    insertData['bank_name'] = this.projData['BankName'].trim();
                }

                insertData['srku_owner_mobile_no'] = this.projData['SrkuOwnerMobileNumber'];
                insertData['srku_province'] = this.projData['SrkuProvince'];
                insertData['srku_city'] = this.projData['SrkuCity'];
                insertData['srku_sub_district'] = this.projData['SrkuSubDistrict'];
                insertData['srku_pincode'] = this.projData['SrkuPincode'];
                insertData['floor_size'] = this.projData['FloorSize'];
                insertData['number_of_units'] = this.projData['NumberOfUnit'];
                insertData['is_micro_credit'] = this.projData['IsMicroCredit'];


                if (this.projData.BankDocument != undefined && this.projData.BankDocument != '') {
                    insertData['bank_document'] = JSON.stringify(this.projData.BankDocument);
                } else {
                    insertData['bank_document'] = '';
                }

                insertData['non_micro_credit_type'] = this.projData['NonMicroCreditType'];
                insertData['non_micro_credit_type_mid'] = this.projData['NonMicroCreditTypeMid'];

                if (this.projData.NMCDocument != undefined && this.projData.NMCDocument != '') {
                    insertData['nmc_document'] = JSON.stringify(this.projData.NMCDocument);
                } else {
                    insertData['nmc_document'] = '';
                }

                if (this.projData['AdditionalComments'] != undefined && this.projData['AdditionalComments'] != '') {
                    insertData['additional_comments'] = this.projData['AdditionalComments'].trim();
                }
                insertData['hpb_digital_sign'] = JSON.stringify(this.projData['HpbDigitalSign']);
                // insertData['latitude']=this.projData['latitude'];
                // insertData['longitude']= this.projData['longitude'];


                console.log("insert/update data", insertData);

                if (this.projData['ProjectId'] > 0) {

                    insertData['updated_by'] = sessionUserGlobalData['userIdG'] ? sessionUserGlobalData['userIdG'] : this.userId;
                    //Clear srku data if not srku selected
                    if (insertData['is_srku'] == 0) {
                        insertData['srku_owner_name'] = "";
                        insertData['srku_owner_address'] = "";
                        insertData['srku_owner_mobile_no'] = "";
                        insertData['srku_province'] = "";
                        insertData['srku_city'] = "";
                        insertData['srku_sub_district'] = "";
                        insertData['srku_pincode'] = "";
                        insertData['floor_size'] = "";
                        insertData['number_of_units'] = "";
                        insertData['is_micro_credit'] = "";
                        insertData['bank_name'] = "";
                        insertData['bank_document'] = '';
                        insertData['non_micro_credit_type'] = "";
                        insertData['nmc_document'] = "";


                        // this.projData['IsSrku']=null;
                        // this.projData.SrkuOwnerName=null
                        // this.projData.SrkuOwnerAddress=null
                        // this.projData.SrkuProvince=null
                        // this.projData.SrkuCity=null
                        // this.projData.SrkuSubDistrict=null
                        // this.projData.SrkuPincode=null
                        // this.projData.SrkuOwnerMobileNumber=null
                        // this.projData.FloorSize=null
                        // this.projData.NumberOfUnit=null
                        // this.projData.IsMicroCredit=null
                        // this.projData.BankName=null
                        // this.projData.BankDocument=[]
                        // this.projData.NonMicroCreditType=null

                    }

                    //UPDATE EXISTING PROJECT DATA

                    let currentTime = this.appCom.getCurrentTimeStamp();
                    insertData['local_updated_date'] = currentTime;
                    insertData['sync_status'] = 0;

                    insertData['updated_date'] = Date.now();
                    var whereCond = " `project_id` = " + this.projData['ProjectId'];
                    this.sqlS.updateData(insertData, "project_master", whereCond).then((data) => {


                        this.srkuApprovalAddUpdateCheck(this.projData['ProjectId']).then(() => {
                            this.events.publish('globalSync');
                        }, () => {
                            this.events.publish('globalSync');
                        });





                        //this.appCom.showToast(ALL_MESSAGE.SUCCESS_MESSAGE.PROJ_UPDATE_SUCCESS,"middle");

                        this.events.publish('refreshProjList');

                        this.check = false;
                        this.busy = this.syncS.syncHpbDExtra().then(() => {
                            this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.PROJ_UPDATE_SUCCESS, "Ok", "");

                            this.navCtrl.push(ProjectListPage).then(() => {
                                let currView = this.navCtrl.getActive();
                                let index = this.navCtrl.indexOf(currView);
                                let a = this.navCtrl.getViews();
                                this.navCtrl.remove(index - 2, 2, null);
                            });
                        }, () => {
                            this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.PROJ_UPDATE_SUCCESS, "Ok", "");
                            this.navCtrl.push(ProjectListPage).then(() => {
                                let currView = this.navCtrl.getActive();
                                let index = this.navCtrl.indexOf(currView);
                                let a = this.navCtrl.getViews();
                                this.navCtrl.remove(index - 2, 2, null);
                            });
                        });




                    }, (error) => {
                        console.log('Error', error);
                        this.check = false
                            //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.PROJ_UPDATE_ERR,"middle");
                        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.PROJ_UPDATE_ERR, "Ok", "");
                    });
                } else {
                    //INSERT NEW PROJECT DATA
                    let currentDate = this.appCom.getCurrentTimeStamp();
                    insertData['local_created_date'] = currentDate;
                    insertData['local_updated_date'] = currentDate;
                    insertData['created_by'] = this.userId;
                    insertData['assigned_to'] = this.userId;
                    insertData['generated_by'] = sessionUserGlobalData['userIdG'] ? sessionUserGlobalData['userIdG'] : this.userId;
                    insertData['updated_by'] = sessionUserGlobalData['userIdG'] ? sessionUserGlobalData['userIdG'] : this.userId;
                    this.appCom.isGpsLocationEnabledC((successCallback) => {
                        if (successCallback) {
                            this.appCom.getLocationModeC((res) => {
                                console.log("res", res);
                                //if (res == 'high_accuracy') {

                                    this.busy = this.appCom.getGeoLocationCordinates("addProject").then((geoCordinates) => {
                                        this.addprojGeoLoc(geoCordinates,insertData);

                                    }, (error) => {
                                        console.log(error);
                                        this.check = false
                                        //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR, "Ok", "");
                                        this.addprojGeoLoc('',insertData);
                                    });

                                // } else {
                                //     //show pop up for set high accuracy..
                                //     this.check = false
                                //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR, "Ok", "");
                                //     this.addprojGeoLoc('',insertData);
                                // }
                            }, (err) => {
                                this.check = false
                                console.log(err);
                            });
                        } else {
                            //show alert enable gps
                            this.check = false
                            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR, "Ok", "");

                        }

                    }, (err) => {
                        console.log(err);
                        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR, "Ok", "");

                    });

                }

            } else {
                //INVALID  
                this.check = false
                console.log("invalid");
                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_FIELDS_FORM_ERR, "Ok", "");
            }
        } else {

        }
    }

    addprojGeoLoc(geoCordinates,insertData){
        console.log("geoCordinates------>", geoCordinates);
        this.projData.latitude = (geoCordinates['coords']) ? geoCordinates['coords'].latitude : "";
        this.projData.longitude = (geoCordinates['coords']) ? geoCordinates['coords'].longitude : "";
        insertData['latitude'] = this.projData['latitude'];
        insertData['longitude'] = this.projData['longitude'];


        insertData['created_date'] = Date.now();
        
        this.sqlS.insertData(insertData, "project_master").then((data) => {

            this.srkuApprovalAddUpdateCheck(data['insertId']).then(() => {
                this.events.publish('globalSync');
            }, () => {
                this.events.publish('globalSync');
            });


            //this.appCom.showToast(ALL_MESSAGE.SUCCESS_MESSAGE.PROJ_ADD_SUCCESS,"middle");


            this.events.publish('globalSync');
            this.events.publish('refreshProjList');
            this.check = false;
            this.busy = this.syncS.syncHpbDExtra().then(() => {
                this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.PROJ_ADD_SUCCESS, "Ok", "");
                this.navCtrl.push(ProjectListPage).then(() => {
                    let currView = this.navCtrl.getActive();
                    let index = this.navCtrl.indexOf(currView);
                    let a = this.navCtrl.getViews();
                    this.navCtrl.remove(index - 2, 2, null);
                });
            }, () => {
                this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.PROJ_ADD_SUCCESS, "Ok", "");
                this.navCtrl.push(ProjectListPage).then(() => {
                    let currView = this.navCtrl.getActive();
                    let index = this.navCtrl.indexOf(currView);
                    let a = this.navCtrl.getViews();
                    this.navCtrl.remove(index - 2, 2, null);
                });
            });


        }, (error) => {

            console.log('Error', error);
            this.check = false
            //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.PROJ_ADD_ERR,"middle");
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.PROJ_ADD_ERR, "Ok", "");
        });
    }


    //CAMERA OR GALLERY SELECTION POP
    openSelectCameraPop(myEvent, photo_source) {
        var popover;
        popover = this.popoverCtrl.create(ImageSelectPopPage, { photo_source });
        popover.present({
            ev: myEvent
        });

    }

    //SIGNATURE PAD POP
    getSignature() {
        let Modal = this.modalCtrl.create(DigitalSignCanvasPage);
        Modal.present();

    }

    removebankDocImage(i) {
        this.bankDocPhotosObj.splice(i, 1);
        this.projData.BankDocument.splice(i, 1);
    }

    removeNmcDocImage(i) {
        this.nmcDocPhotosObj.splice(i, 1);
        this.projData.NMCDocument.splice(i, 1);
    }

    onMicroCreditChange(val) {
        console.log("sdd-------------->", val)
        if (val == 1) {
            this.projData.NMCDocument = [];
            this.nmcDocPhotosObj = [];
            this.projData.NonMicroCreditType = "";
            this.projData.NonMicroCreditTypeMid = "";
        } else if (val == 0) {
            this.projData.BankDocument = [];
            this.bankDocPhotosObj = [];
            this.projData.BankName = "";
        }
    }



    getAddressData() {

        return new Promise((resolve, reject) => {

            let selectField = " * ";
            let tableName = " address_master ";
            let where = "";
            let orderBy = "";
            let limit = "";
            let allAddressData = [];
            let postalCodeArr = [];
            let provinceArr = [];
            let municipalityArr = [];
            let subDistrictArr = [];
            this.sqlS.selectTableData(selectField, tableName, where, orderBy, limit).then((ressqlData: any) => {
                console.log('getOpenTendersData sql ressqlData', ressqlData);
                for (let i = 0; i < ressqlData.rows.length; i++) {
                    let tempObj = ressqlData.rows.item(i);
                    allAddressData.push(tempObj);
                    postalCodeArr.push(tempObj['postalcode']);
                    provinceArr.push(tempObj['province']);
                    municipalityArr.push(tempObj['citykabname']);
                    subDistrictArr.push(tempObj['subdistrict']);
                }
                this.allAddressDataG = new Set(allAddressData);
                postalCodeArr = Array.from(new Set(postalCodeArr));
                provinceArr = Array.from(new Set(provinceArr));
                municipalityArr = Array.from(new Set(municipalityArr));
                subDistrictArr = Array.from(new Set(subDistrictArr));

                this.postalCodeArrG = [];
                for (let i = 0; i < postalCodeArr.length; i++) {
                    this.postalCodeArrG.push({
                        text: postalCodeArr[i],
                        value: postalCodeArr[i]
                    });

                }

                this.provinceArrG = [];
                for (let j = 0; j < provinceArr.length; j++) {
                    this.provinceArrG.push({
                        text: provinceArr[j],
                        value: provinceArr[j]
                    });

                }
                this.municipalityArrG = [];
                for (let k = 0; k < municipalityArr.length; k++) {
                    this.municipalityArrG.push({
                        text: municipalityArr[k],
                        value: municipalityArr[k]
                    });

                }
                this.subDistrictArrG = [];
                for (let l = 0; l < subDistrictArr.length; l++) {
                    this.subDistrictArrG.push({
                        text: subDistrictArr[l],
                        value: subDistrictArr[l]
                    });

                }



                resolve(true);
            }, (error) => {
                console.log(' sql error', error);
                reject(false);
            });

        });
    }

    addressDataFiltersF(eventD, type) {

        if (type == "postalcode") {
            // bind - province , citykabname, subdistrict 
            let tempP = null;
            let tempC = null;
            let tempS = null;
            this.provinceArrF = [];
            this.municipalityArrF = [];
            this.subDistrictArrF = [];
            this.postalCodeArrF = [];
            this.allAddressDataG.forEach((value1Data, value2Data, set) => {
                if (
                    value2Data['postalcode'] == eventD && eventD != "" && eventD != null) {


                    this.postalCodeArrF.push({
                        text: value2Data['postalcode'],
                        value: value2Data['postalcode']
                    });
                    this.provinceArrF.push({
                        text: value2Data['province'],
                        value: value2Data['province']
                    });
                    this.municipalityArrF.push({
                        text: value2Data['citykabname'],
                        value: value2Data['citykabname']
                    });
                    this.subDistrictArrF.push({
                        text: value2Data['subdistrict'],
                        value: value2Data['subdistrict']
                    });

                    tempP = value2Data['province'];
                    tempC = value2Data['citykabname'];
                    tempS = value2Data['subdistrict'];
                }

            });

            this.municipalityArrF = this.municipalityArrF.uniqueObjects();
            this.subDistrictArrF = this.subDistrictArrF.uniqueObjects();
            this.provinceArrF = this.provinceArrF.uniqueObjects();
            this.pincodeMob.instance.option({
                data: this.postalCodeArrF
            });
    
            this.ProvinceMob.instance.option({
                data: this.provinceArrF
            });
    
            this.CityMob.instance.option({
                data: this.municipalityArrF
            });
    
            this.SubDistrictMob.instance.option({
                data: this.subDistrictArrF
            }); 
            setTimeout(() => {
                this.SrkuPincode.valueAccessor._instance.setVal(eventD, true);
                this.SrkuProvince.valueAccessor._instance.setVal(tempP, true);
                this.SrkuCity.valueAccessor._instance.setVal(tempC, true);
                this.SrkuSubDistrict.valueAccessor._instance.setVal(tempS, true);
            }, 10);



        } else if (type == "province") {
            // bind -  citykabname, subdistrict
            this.postalCodeArrF = [];
            this.municipalityArrF = [];
            this.subDistrictArrF = [];
            this.allAddressDataG.forEach((value1Data, value2Data, set) => {
                if (value2Data['province'] == eventD && eventD != "" && eventD != null) {

                    this.municipalityArrF.push({
                        text: value2Data['citykabname'],
                        value: value2Data['citykabname']
                    });
                    this.subDistrictArrF.push({
                        text: value2Data['subdistrict'],
                        value: value2Data['subdistrict']
                    });
                    this.postalCodeArrF.push({
                        text: value2Data['postalcode'],
                        value: value2Data['postalcode']
                    });
                }
            });


            this.municipalityArrF = this.municipalityArrF.uniqueObjects();
            this.subDistrictArrF = this.subDistrictArrF.uniqueObjects();
            this.pincodeMob.instance.option({
                data: this.postalCodeArrF
            });
            
            this.CityMob.instance.option({
                data: this.municipalityArrF
            });
    
            this.SubDistrictMob.instance.option({
                data: this.subDistrictArrF
            });

        } else if (type == "citykabname") {
            // bind -   subdistrict and Up province
            this.postalCodeArrF = [];
            this.subDistrictArrF = [];
            this.allAddressDataG.forEach((value1Data, value2Data, set) => {
                if (value2Data['citykabname'] == eventD && eventD != "" && eventD != null) {
                    this.subDistrictArrF.push({
                        text: value2Data['subdistrict'],
                        value: value2Data['subdistrict']
                    });
                    this.postalCodeArrF.push({
                        text: value2Data['postalcode'],
                        value: value2Data['postalcode']
                    });
                }
            });

            this.subDistrictArrF = this.subDistrictArrF.uniqueObjects();
            this.pincodeMob.instance.option({
                data: this.postalCodeArrF
            });
            
            this.SubDistrictMob.instance.option({
                data: this.subDistrictArrF
            });

        } else if (type == "subdistrict") {
            // bind -   postalcode and Up citykabname, province

            this.postalCodeArrF = [];
            this.allAddressDataG.forEach((value1Data, value2Data, set) => {
                if (value2Data['subdistrict'] == eventD && eventD != "" && eventD != null) {
                    this.postalCodeArrF.push({
                        text: value2Data['postalcode'],
                        value: value2Data['postalcode']
                    });
                }
            });

            this.pincodeMob.instance.option({
                data: this.postalCodeArrF
              });
        }



    }



    addressInitInput() {
        return new Promise((resolve, reject) => {

            this.postalCodeArrF = [];
            for (let i = 0; i < this.postalCodeArrG.length; i++) {
                this.postalCodeArrF.push({
                    text: this.postalCodeArrG[i].text,
                    value: this.postalCodeArrG[i].value,
                });

                // if (i == 50) {
                //     break;
                // }
            }
            this.pincodeMob.instance.option({
                data: this.postalCodeArrF
            });
            this.provinceArrF = [];
            for (let i = 0; i < this.provinceArrG.length; i++) {
                this.provinceArrF.push({
                    text: this.provinceArrG[i].text,
                    value: this.provinceArrG[i].value,
                });

                // if (i == 50) {
                //     break;
                // }
            }
            this.ProvinceMob.instance.option({
                data: this.provinceArrF
            });
            this.municipalityArrF = [];
            for (let i = 0; i < this.municipalityArrG.length; i++) {
                this.municipalityArrF.push({
                    text: this.municipalityArrG[i].text,
                    value: this.municipalityArrG[i].value,
                });

                // if (i == 50) {
                //     break;
                // }
            }
            this.CityMob.instance.option({
                data: this.municipalityArrF
            });
            this.subDistrictArrF = [];
            for (let i = 0; i < this.subDistrictArrG.length; i++) {
                this.subDistrictArrF.push({
                    text: this.subDistrictArrG[i].text,
                    value: this.subDistrictArrG[i].value,
                });

                // if (i == 50) {
                //     break;
                // }
            }
            this.SubDistrictMob.instance.option({
                data: this.subDistrictArrF
            });
            resolve(resolve);

        });


    }

    selectFile(container ? : any) {

    }

    selectNMCFile(container ? : any) {


    }

    selectNMCType(nmcType ? : any) {
        console.log(" selectProjectType ", nmcType);
        this.projData.NonMicroCreditType = nmcType.nmc_type;
        this.projData.NonMicroCreditTypeMid = nmcType.server_id;
    }

    srkuApprovalAddUpdateCheck(srkuProjectId) {
        return new Promise((resolve, reject) => {
            let selectField = " * ";
            let tablename = "project_master";
            let where = " project_id=" + srkuProjectId;
            let orderBy = "";
            let limit = "";
            this.sqlS.selectTableData(selectField, tablename, where, orderBy, limit).then((resData: any) => {
                let resDataObj = resData.rows.item(0);

                if (resDataObj['is_srku'] || resDataObj['is_srku'] == 1 || resDataObj['is_srku'] == "1") {

                    let updateQuery = "UPDATE srku_approval_status_tbl SET sync_status=0 , is_closed=1 where project_id=" + srkuProjectId;
                    this.sqlS.queryExecuteSql(updateQuery, []).then((updatDataRes: any) => {
                        console.log('updateQuery', updateQuery, updatDataRes);
                        let approvInsert = {};
                        approvInsert['srku_approval_status'] = 0;
                        approvInsert['project_id'] = srkuProjectId;
                        approvInsert['local_created_date'] = this.appCom.getCurrentTimeStamp();
                        approvInsert['local_updated_date'] = this.appCom.getCurrentTimeStamp();
                        approvInsert['sync_status'] = 0;
                        this.sqlS.insertData(approvInsert, "srku_approval_status_tbl").then((approvData: any) => {
                            resolve(true);
                        }, error => {
                            resolve(true);
                        });

                    }, (errorCC) => {
                        resolve(true);
                    });



                } else {
                    resolve(true);
                }

            }, error => {
                console.log("error", error);
                resolve(true);
            });
        });
    }

}