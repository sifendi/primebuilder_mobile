import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { ProjectDetailsPage } from "../project-details/project-details";
import { ProjectProductReceiptsPage } from "../project-product-receipts/project-product-receipts";
import { ProjectProductRequestsPage } from "../project-product-request/project-product-request";
import { AddProjectPage } from "../add-project/add-project";
import { SuperTabsController } from 'ionic2-super-tabs';
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../providers/constant";
import { ProductReceiptsFormPage } from "../../product-receipts/product-receipts-form/product-receipts-form";
import { ProductRequestsFormPage } from "../../product-request/product-requests-form/product-requests-form";

import * as moment from 'moment';
declare var cordova;



@Component({
    selector: 'project-parent-tab-page',
    templateUrl: 'project-parent-tab-page.html',
})
export class ProjectParentTabsPage {

    page1: any = ProjectDetailsPage;
    page2: any = ProjectProductReceiptsPage;
    page3: any = ProjectProductRequestsPage;
    paramsData: any;
    selectedIndex: any = 0;
    projectName: any = "";
    projData: any = [];
    hpbData: any = [];
    editFlag: any = true;
    receiptAddFlag: any = false;
    globalCheckInData: any = [];

    busy: Promise<any>;
    busyMessage: any;
    check: any = false;
    userId: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private superTabsCtrl: SuperTabsController, public appCom: appCommonMethods, public sqlS: SqlServices, public alertCtrl: AlertController, public events: Events) {
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj) => {
            this.globalCheckInData = checkinObj;
            //console.log("this.globalCheckInData",this.globalCheckInData);
        });



        this.selectedIndex = 0;
        this.paramsData = this.navParams.data;
        this.projData = this.paramsData['projData'];
        this.hpbData = this.paramsData['hpbData'];
        this.projectName = (this.navParams.data) ? this.navParams.data['projName'] : "-";
        console.log("paramsData---proj parent", this.paramsData);



        let tab = this.paramsData['tab'];
        if (tab == "receipt") {
            this.selectedIndex = 1;
            this.editFlag = false;
            this.receiptAddFlag = true;
        } else {
            this.selectedIndex = 0;
            this.editFlag = true;
        }

        setTimeout(function () {
            this.page1 = ProjectDetailsPage;
            this.page2 = ProjectProductReceiptsPage;
            this.page3 = ProjectProductRequestsPage;
        }, 300);

        //this.superTabsCtrl.enableTabSwipe(enable: false, tabId: detail, tabsId?: mainTabs);


    }

    ionViewDidLoad() {
        this.superTabsCtrl.enableTabsSwipe(false, 'mainTabs');
        //GET CURRENT USER DATA
        this.appCom.getAppPreference("userCreds").then((resDataU) => {
            console.log("resDataUser", resDataU);
            if (resDataU != undefined && resDataU != '') {
                this.userId = resDataU.userId;
            } else {
                this.userId = "";
            }
        }, (err) => {
            console.log('err ref', err);
        });
    }

    goToProjectFilter() {
        //  this.paramsData=this.navParams.data;
    }



    async ionViewDidEnter() {
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
        this.check = false;
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj) => {
            this.globalCheckInData = checkinObj;
            console.log("this.globalCheckInData", this.globalCheckInData);
        });
        console.log("this.projData", this.projData);

    }

    goToProductReceiptForm() {

        //comment later
        // this.navCtrl.push(ProductReceiptsFormPage ,{
        //     "projId":this.projData['project_id']
        // });
        //comment later above

        this.busy = this.addReceiptConditionCheck().then((check) => {
            console.log("check", check);
            if (!check) {
                return false;
            }

            console.log("this.projData", this.projData);
            if (!(this.projData['server_hpb_id'] > 0)) {
                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.NO_HPB_ERR, "Ok", "");
            } else if ((this.projData['is_srku'] == 1 || this.projData['is_srku'] == "1")) {
                if ((this.projData['tlh_approval'] == 1 || this.projData['tlh_approval'] == "1")) {
                    this.navCtrl.push(ProductReceiptsFormPage, {
                        "projId": this.projData['project_id']
                    });
                } else {
                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.SRKU_APPR_ERR, "Ok", "");
                }
            } else {
                this.navCtrl.push(ProductReceiptsFormPage, {
                    "projId": this.projData['project_id']
                });
            }

        }, error => {
            console.log("rejected");
        });

    }

    goToProductRequestForm() {
        this.navCtrl.push(ProductRequestsFormPage, {
            "projId": this.projData['project_id']
        });

    }
    onTabSelect($event) {
        this.selectedIndex = $event.index;
        if ($event.index == 0) {
            this.editFlag = true;
            this.receiptAddFlag = false;
        } else if ($event.index == 1) {
            this.editFlag = false;
            this.receiptAddFlag = true;
        } else {
            this.editFlag = false;
            this.receiptAddFlag = false;
        }


    }

    alreadyCheckInAlert() {
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ALREADY_CHECKED_IN, "Close", "");
    }

    editProject() {
        this.navCtrl.push(AddProjectPage, {
            "projData": this.projData,
            "action": "edit"
        });
    }

    hpbNotAssigned() {
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.NO_HPB_ERR, "Ok", "");
    }

    addReceiptConditionCheck() {
        return new Promise((resolve, reject) => {
            this.appCom.getAppPreference('globalSyncUpdatedDateTimeStamp').then((homeSync) => {
                this.appCom.getAppPreference('projectsSyncUpdatedDateTimeStamp').then((projSync) => {
                    let updatedSyncTimestamp;

                    if (homeSync > projSync) {
                        let updatedSyncTimestamp = homeSync;
                    } else {
                        let updatedSyncTimestamp = projSync;
                    }
                    console.log("homeSync", homeSync);
                    console.log("projSync", projSync);

                    console.log("updatedSyncTimestamp", updatedSyncTimestamp);

                    let earlier2DayDate = moment(new Date().getTime()).subtract(3, 'day').valueOf();
                    console.log("earlier2DayDate", earlier2DayDate);
                    //CHECK IF LAST SYNC IS DONE ATLEAST WITHIN 2 DAYS
                    if (updatedSyncTimestamp < earlier2DayDate) {
                        this.appCom.showAlert("Please sync project data", "Ok", "");
                        //return false;	
                        resolve(false);
                        return false;
                    } else {
                        //USER HAS SYNCED DATA IN 2 DAYS
                        let query = "SELECT projm.project_name,prm.local_updated_date,pm.product_name,prm.receipt_id,prm.server_receipt_id,prm.quantity,prm.unit,prm.local_created_date,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0 ) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_approval, (SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0) AS tlh_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_rejection_res FROM product_receipt_master prm LEFT JOIN product_master pm ON prm.product_id = pm.server_product_id LEFT JOIN project_master projm ON projm.project_id = prm.project_id where tlh_approval is not null and sa_approval is not null";
                        this.sqlS.queryExecuteSql(query, []).then((resData: any) => {

                            if (resData.rows.length > 0) {

                                for (let i = 0; i < resData.rows.length; i++) {
                                    let currTempObj = resData.rows.item(i);
                                    console.log("currTempObj['sa_approval']", currTempObj['sa_approval']);
                                    console.log("b");
                                    //if( currTempObj['sa_approval']==1 || currTempObj['sa_approval']==-1 || currTempObj['tlh_approval']==-1 || currTempObj['ac_approval']==-1 ){
                                    if (currTempObj['sa_approval'] == 1 || currTempObj['sa_approval'] == -1 || currTempObj['tlh_approval'] == -1 || currTempObj['tlh_approval'] == 1 || currTempObj['ac_approval'] == -1) {
                                        //allow user
                                    } else {

                                        let locD = currTempObj['local_updated_date'];
                                        let earlier2DayDate = moment(new Date().getTime()).subtract(3, 'day').valueOf();
                                        console.log("locD----->", locD);
                                        console.log("earlier2DayDate----->", earlier2DayDate);
                                        if (locD > earlier2DayDate) {
                                            //allow user 
                                        } else {
                                            this.appCom.showAlert("Receipts cannot be added due to pending approval", "Ok", "");
                                            //return false;
                                            resolve(false);
                                            return false;
                                        }
                                    }
                                }
                                resolve(true);
                            } else {
                                resolve(true);
                            }

                        }, (error) => {
                            console.log('error', error);
                            reject(error);
                            //return false;
                        });

                    }

                });
            });
        });

    }

    async permissionCheckinpop(details) {

        let titleYes = await this.appCom.getTranslatedTxt("Yes");
        let titleNo = await this.appCom.getTranslatedTxt("No");
        let title = await this.appCom.getTranslatedTxt("Are you sure you want to check in ?");


        let alert = this.alertCtrl.create({
            cssClass: 'confirm',
            title: title,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: titleYes,
                    handler: () => {
                        console.log('Buy clicked');
                        this.check = false;
                        //do  checkin                                                                                              
                        this.sqlS.insertData(details, "check_in_out").then((data) => {
                            this.events.publish('globalSync');


                            this.globalCheckInData = {
                                checkinFlag: true,
                                checkinType: "project",
                                insertId: data['insertId'],
                                checkinDetails: details
                            }
                            this.appCom.setLocalStorageItem("globalCheckinData", this.globalCheckInData).then(() => {
                                this.check = false;
                                //this.setElement();
                            });
                            console.log("this.globalCheckInData", this.globalCheckInData);
                            this.appCom.updateMasonContractorStats('mason');
                            this.appCom.updateMasonContractorStats('contractor');
                        }, (error) => {
                            this.check = false;
                            console.log('Error', error);
                        });
                    }
                }, {
                    text: titleNo,
                    handler: () => {
                        console.log('Cancel clicked');
                        this.check = false;
                        //do not checkin    
                    }
                }]
        });
        alert.present();
    }

    async permissionCheckoutpop(geoCordinates) {

        let titleYes = await this.appCom.getTranslatedTxt("Yes");
        let titleNo = await this.appCom.getTranslatedTxt("No");
        let title = await this.appCom.getTranslatedTxt("Are you sure you want to Check Out ?");
        let titlePlaceHold = await this.appCom.getTranslatedTxt("Comment here");

        if (this.globalCheckInData['visitCheckFlag'] == true) {
            let alert = this.alertCtrl.create({
                cssClass: 'confirm',
                title: title,
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: titleYes,
                        handler: () => {
                            console.log('Buy clicked');
                            this.check = false;

                            let details = {

                                check_out_latitude: (geoCordinates['coords']) ? geoCordinates['coords'].latitude : "",
                                check_out_longitude: (geoCordinates['coords']) ? geoCordinates['coords'].longitude : "",
                                check_out_datetime: new Date().getTime(),
                                local_updated_date: new Date().getTime(),
                                sync_status: 0

                            }

                            this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj) => {
                                this.globalCheckInData = checkinObj;
                                console.log("this.globalCheckInData", this.globalCheckInData);
                                let whereCond = " `check_in_out_id` = " + this.globalCheckInData['insertId'];
                                console.log("whwere cond", whereCond);
                                this.sqlS.updateData(details, "check_in_out", whereCond).then((data) => {
                                    this.events.publish('globalSync');
                                    console.log("data  checkout------>", data);
                                    this.check = false;
                                    //EMPTY GLOBAL DATA AFTER CHECK OUT

                                    this.globalCheckInData = {
                                        checkinFlag: false,
                                        checkinType: "",
                                        checkinDetails: {
                                            check_in_out_user_id: null,
                                            check_in_out_type: null,
                                            check_in_out_type_id: null,
                                            check_in_latitude: null,
                                            check_in_longitude: null,
                                            check_in_datetime: null,
                                            check_out_latitude: null,
                                            check_out_longitude: null,
                                            check_out_datetime: null,
                                            generated_by: null
                                        }
                                    };
                                    this.appCom.setLocalStorageItem("globalCheckinData", this.globalCheckInData).then(() => {
                                        this.check = false;
                                        //this.setElement();
                                    });

                                }, (error) => {
                                    this.check = false;
                                    console.log('Error', error);
                                    //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
                                    //this.appCom.showAlert("",ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
                                });

                            });
                        }
                    }, {
                        text: titleNo,
                        handler: () => {
                            this.check = false;
                            console.log('Cancel clicked');
                        }
                    }]
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                cssClass: 'confirm',
                title: title,
                enableBackdropDismiss: false,
                inputs: [
                    {
                        name: 'comment',
                        placeholder: titlePlaceHold,
                    }
                ],
                buttons: [
                    {
                        text: titleYes,
                        handler: (data) => {
                            console.log('Buy clicked');
                            this.check = false;
                            console.log("data", data);
                            var c = "";
                            c = data['comment'].trim();
                            if (c != undefined && c != "") {
                                let details = {
                                    //check_in_out_user_id:null,
                                    //check_in_out_type:null,
                                    //check_in_out_type_id:null,
                                    //check_in_latitude:null,
                                    //check_in_longitude:null,
                                    //check_in_datetime:null,
                                    check_out_latitude: (geoCordinates['coords']) ? geoCordinates['coords'].latitude : "",
                                    check_out_longitude: (geoCordinates['coords']) ? geoCordinates['coords'].longitude : "",
                                    check_out_datetime: new Date().getTime(),
                                    local_updated_date: new Date().getTime(),
                                    sync_status: 0
                                    //generated_by:null
                                }
                                details['check_in_out_comment'] = c;
                                this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj) => {
                                    this.globalCheckInData = checkinObj;
                                    console.log("this.globalCheckInData", this.globalCheckInData);
                                    let whereCond = " `check_in_out_id` = " + this.globalCheckInData['insertId'];
                                    console.log("whwere cond", whereCond);
                                    this.sqlS.updateData(details, "check_in_out", whereCond).then((data) => {
                                        this.events.publish('globalSync');
                                        console.log("data  checkout------>", data);

                                        //EMPTY GLOBAL DATA AFTER CHECK OUT

                                        this.globalCheckInData = {
                                            checkinFlag: false,
                                            visitCheckFlag: false,
                                            checkinType: "",
                                            checkinDetails: {
                                                check_in_out_user_id: null,
                                                check_in_out_type: null,
                                                check_in_out_type_id: null,
                                                check_in_latitude: null,
                                                check_in_longitude: null,
                                                check_in_datetime: null,
                                                check_out_latitude: null,
                                                check_out_longitude: null,
                                                check_out_datetime: null,
                                                generated_by: null
                                            }
                                        };
                                        this.check = false;
                                        this.appCom.setLocalStorageItem("globalCheckinData", this.globalCheckInData).then(() => {
                                            this.check = false;
                                            //this.setElement();
                                        });

                                    }, (error) => {
                                        this.check = false;
                                        console.log('Error', error);
                                        //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
                                        //this.appCom.showAlert("",ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
                                    });

                                });


                            } else {
                                this.check = false;
                                this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.PRODUCT_RECEIPT_NOT_FILLED, "middle");
                                return false;
                            }
                        }
                    }, {
                        text: titleNo,
                        handler: () => {
                            console.log('Cancel clicked');
                            this.check = false;
                        }
                    }]
            });
            alert.present();
        }
    }


    checkIn() {

        console.log("this.projData", this.projData);

        if (this.check == false) {
            this.check = false;

            //get the geo co-ordinates
            this.appCom.isGpsLocationEnabledC((successCallback) => {
                if (successCallback) {
                    this.appCom.getLocationModeC((res) => {
                        console.log("res", res);
                        let type = "project";
                        let id = this.projData['project_id'];
                        let details = {

                            check_in_out_type: type,
                            check_in_out_type_id: id,
                            assigned_to: this.userId,
                            generated_by: this.userId,
                            check_in_out_user_id: this.userId,

                        }
                        //if(res == 'high_accuracy'){                                        
                        this.busy = this.appCom.getGeoLocationCordinates("checkIn").then((geoCordinates) => {
                            console.log("geoCordinates------>", geoCordinates);

                            details['check_in_latitude'] = (geoCordinates['coords']) ? geoCordinates['coords'].latitude : "";
                            details['check_in_longitude'] = (geoCordinates['coords']) ? geoCordinates['coords'].longitude : "";
                            details['check_in_datetime'] = new Date().getTime();
                            details['local_created_date'] = new Date().getTime();
                            console.log("details =>", details);

                            this.permissionCheckinpop(details);
                        }, (error) => {
                            this.check = false;
                            console.log(error);
                            details['check_in_latitude'] = '';
                            details['check_in_longitude'] = '';
                            details['check_in_datetime'] = new Date().getTime();
                            details['local_created_date'] = new Date().getTime();
                            console.log("details =>", details);
                            //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");                                       
                            this.permissionCheckinpop(details);
                        });
                        // }else{
                        //     this.check = false;
                        //     details['check_in_latitude'] = '';
                        //     details['check_in_longitude'] = '';
                        //     details['check_in_datetime'] = new Date().getTime();
                        //     details['local_created_date'] = new Date().getTime();
                        //     console.log("details =>",details);
                        //     //show pop up for set high accuracy..
                        //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok",""); 
                        //     this.permissionCheckinpop(details);                               
                        // }
                    }, (err) => {
                        this.check = false;
                        console.log(err);
                    });
                } else {
                    this.check = false;
                    //show alert enable gps
                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR, "Ok", "");

                }

            }, (err) => {
                this.check = false;
                console.log(err);
                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR, "Ok", "");

            });

        } else {

        }

    }



    checkOut(rds) {

        if (this.check == false) {
            this.check = false;
            //get the geo co-ordinates
            this.appCom.isGpsLocationEnabledC((successCallback) => {
                if (successCallback) {
                    this.appCom.getLocationModeC((res) => {
                        console.log("res", res);
                        //if(res == 'high_accuracy'){                            
                        this.busy = this.appCom.getGeoLocationCordinates("checkOut").then((geoCordinates) => {
                            console.log("geoCordinates------>", geoCordinates);

                            this.permissionCheckoutpop(geoCordinates);


                        }, (error) => {
                            this.check = false;
                            console.log(error);
                            //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                            this.permissionCheckoutpop('');
                        });

                        // }else{
                        //     this.check = false;
                        //     //show pop up for set high accuracy..
                        //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                        //     this.permissionCheckoutpop('');
                        // }
                    }, (err) => {
                        this.check = false;
                        console.log(err);
                    });
                } else {
                    this.check = false;
                    //show alert enable gps
                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR, "Ok", "");

                }

            }, (err) => {
                this.check = false;
                console.log(err);
                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR, "Ok", "");

            });
        } else {

        }

    }













}

