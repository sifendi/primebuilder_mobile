import { HomePage } from '../../home/home';
import { Component,ViewChild,ApplicationRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { ShareService } from "../../../providers/ShareService";
import { ImageSelectPopPage } from "../../image-select-pop/image-select-pop";
import { DigitalSignCanvasPage } from "../../digital-sign-canvas/digital-sign-canvas";
import { ALL_MESSAGE } from '../../../providers/constant';
import { ProductReceiptsListPage } from '../product-receipts-list/product-receipts-list';
import async from 'async'; 
import * as moment from 'moment';
import { ProjectParentTabsPage } from "../../project/project-parent-tab-page/project-parent-tab-page";
import { ProductReceiptsDetailsPage } from "../product-receipts-details/product-receipts-details";

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

declare var cordova;
declare var sessionUserGlobalData;

@Component({
    selector: 'page-product-receipts-form',
    templateUrl: 'product-receipts-form.html',
})

export class ProductReceiptsFormPage {

    // Form group initilizer
    public receiptForm: FormGroup; 


    errRecieptFlag:boolean=false;

    //INITIALIZE GLOBAL CHECK-IN OBJECT 
    globalCheckInData:any={
        checkinFlag:false,
        checkinType:"",
        insertId:null,
        visitCheckFlag:false,
        checkinDetails: {
            check_in_out_user_id:null,
            check_in_out_type:null,
            check_in_out_type_id:null,
            check_in_latitude:null,
            check_in_longitude:null,
            check_in_datetime:null,
            check_out_latitude:null,
            check_out_longitude:null,
            check_out_datetime:null,
            generated_by:null,
            check_in_out_comment:null
           
        }
    };  

    //Product Receipt DATA OBJECT
    ReceiptData:any={
        ReceiptId:null,
        Product:null,
        Quantity:null,
        Unit:null,
        RetDist:[],
        PurchaseDate:null,
        InvoiceQuantity:null,
        InvoiceImage:[],
        AdditionalComments:null,
        HpbDigitalSign:null,
        latitude:null,
        longitude:null,
        local_created_date:null,
        local_updated_date:null,
        createdby:null,
        updatedby:null
    };

    // Product addition to receipt. Excluding the first product
    public product_addition: any = [];
    public product_addition_count: number = 0;
    public product_clicked: any;
    public unit_clicked: any;
    public product_name = [];
    public product_unit = [];
    public product_quantity = [];

    public maxDate: any = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString();

    submitted:boolean= false;

    @ViewChild('Product') Product: any; 
    @ViewChild('UnitM') UnitM: any; 
    @ViewChild('Quantity') Quantity: any; 
    @ViewChild('Unit') Unit: any;  
    @ViewChild('RetDist') RetDist: any;  
    @ViewChild('PurchaseDate') PurchaseDate: any;
    // @ViewChild('PurchaseDateMob') PurchaseDateMob: any;  
    @ViewChild('InvoiceQuantity') InvoiceQuantity: any;
    @ViewChild('AdditionalComments') AdditionalComments: any; 

    @ViewChild('productMobi') productMobi: any;
    @ViewChild('unitMobi') unitMobi: any;  
    @ViewChild('RetDistMobi') RetDistMobi: any; 

    totalQ:any=0;
    totalIQ:any=0;
    digitalSignPath:any;
    invoicePhotoObj:any=[];
    rdsArr:any=[];
    productsArr:any=[];
    projData:any=[];
    hpbStatus:any="";
    hpbName:any="";
    busy:  any;
    busyMessage:any="Please Wait...";  
    userId:any;
    unitArr:any=[];
    disableUnitFlag:any=false;
    hpbServerId:any;
    projServerId:any;
    
    unitArrMore:any = [];

    dateSettingsG:any={
       theme: 'material',
       display: 'center',
       dateFormat:'dd/mm/yy',
    };
    
    editMode:any=false;

    mobiScollRDSSettings:any = {
        inputClass: 'text-input',
        theme: 'material',
        showOnFocus: true,
        group: false,
        filter: true,
        placeholder: 'Please select',
        rows:8,
        data:[],
        readonly:false,
        buttons:['set','clear','cancel'],
        onClear: (event, inst)=>{
            this.getRdsMobiFilter();
        },
        onSet: (event, inst)=> {
            console.log("event rds",event);
            console.log("ReceiptData.RetDist",this.ReceiptData.RetDist);
        },
        //   onFilter: (event, inst)=> {
        //      this.getRdsMobiFilter(event.filterText);
        //   }
    };

    fcounter:number=0;

    mobiScollPRODSettings:any = {
        inputClass: 'text-input',
        theme: 'material',
        showOnFocus: true,
        group: false,
        filter: true,
        placeholder: 'Please select',
        rows:8,
        data:[],
        readonly:false,
        buttons:['set','clear','cancel'],
        onClear: (event, inst)=>{
            console.log("clear --");
            // this.ReceiptData.Unit=null;
            this.receiptForm.get('product_name').setValue(null);
            this.getProductsDataOnFilter();
        },
        onSet: (event, inst)=> {
            if(event.valueText){
                if(this.fcounter == 0) {
                    // this.ReceiptData.unit=null;
                    // this.UnitM.instance.setVal(null,true);
                    
                    // this.setUnitData(this.ReceiptData.Product);
                    this.setUnitData(this.receiptForm.get('product_name').value, 'first_product');
                } else {
                    // this.ReceiptData.unit=null;
                    // this.UnitM.instance.setVal(null,true);
                    
                    this.setUnitData(this.receiptForm.get(this.product_clicked).value, 'more_product');
                }
                this.fcounter++;
            }           
        },
        //   onFilter: (event, inst)=> {   
        //       this.getProductsDataOnFilter(event.filterText);
        //   }
    };

    mobiScollUnitSettings:any = {
        inputClass: 'text-input',
        theme: 'material',
        showOnFocus: true,
        group: false,
        filter: true,
        placeholder: 'Please select',
        rows:3,
        // data:[],
        readonly:false,
        buttons:['set','clear','cancel'],
        onClear: (event, inst)=>{
            this.getUnitMobiFilter();
        },
        onSet: (event, inst)=> {},
        //   onFilter: (event, inst)=> {
        //       this.getUnitMobiFilter(event.filterText)
        //   }
    };

    public progress_status: string;

    constructor(public navCtrl: NavController,public appRef:ApplicationRef, public navParams: NavParams, public popoverCtrl: PopoverController,public appCom:appCommonMethods,public events:Events,public modalCtrl: ModalController,public shareS:ShareService,public sqlS: SqlServices, private formBuilder: FormBuilder) {
    
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
            this.globalCheckInData = checkinObj;
        });

        // Form builder initilizer for form group
        this.formBuilderInitilizer();

    }

    
    ionViewWillLeave(){
        this.appRef.tick();
    }


    async ionViewDidLoad() {

        console.log('ionViewDidLoad ProductReceiptsFormPage');

        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
    
        //mobi scroll placeholder translations
        let MobiProps=this.mobiScollPRODSettings;
        MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
        this.mobiScollPRODSettings=MobiProps;
        this.productMobi.instance.option(MobiProps);

        let MobiProps1=this.mobiScollUnitSettings;
        MobiProps1['placeholder']= await this.appCom.getTranslatedTxt("Please select");
        this.mobiScollUnitSettings=MobiProps1;
        this.unitMobi.instance.option(MobiProps1);

        let MobiProps2=this.mobiScollRDSSettings;
        MobiProps2['placeholder']= await this.appCom.getTranslatedTxt("Please select");
        this.mobiScollRDSSettings=MobiProps2;
        this.RetDistMobi.instance.option(MobiProps2);

        this.busy=this.initFormData().then((res:any)=>{
        
        },()=>{
                console.log('error');
        });

        this.disableUnitFlag=false;

        this.ReceiptData={
            ReceiptId:null,
            Product:null,
            Quantity:null,
            Unit:null,
            RetDist:[],
            PurchaseDate:null,
            InvoiceQuantity:null,
            InvoiceImage:[],
            AdditionalComments:null,
            HpbDigitalSign:null,
            latitude:null,
            longitude:null,
            local_created_date:null,
            local_updated_date:null,
            createdby:null,
            updatedby:null
        };

        //GET CURRENT USER DATA
        this.userId=sessionUserGlobalData['userId'];
     
        //PREFILL PROJECT RELATED DATA
        let projId = this.navParams.get("projId");  
        var selectField = " `project_id`, `project_name` ,`hpb_id` ,`project_address` , `project_type` , `is_srku`,`server_project_id`,`server_hpb_id`  ";
        var tablename = "project_master";
        var where =" `project_id` ="+projId;
        this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {
            this.projData=( data['rows'].item(0) );  
            this.projServerId=this.projData['server_project_id']?this.projData['server_project_id']:0;
                            var selectField = " `hpb_id`, `hpb_name` ,`hpb_type`, `hpb_status`, `server_hpb_id` ";
                            var tablename = "hpb_master";
                            var where=" `server_hpb_id` = "+this.projData['server_hpb_id'];
                            this.busy= this.sqlS.selectTableData(selectField,tablename,where,"","").then((hpbdata) => {
                                
                                this.projData['user']=hpbdata['rows'].item(0); 
                                this.hpbStatus= this.projData['user']?this.projData['user']['hpb_status']:"";
                                this.hpbName= this.projData['user']?this.projData['user']['hpb_name']:"";
                                this.hpbServerId=this.projData['user']['server_hpb_id']?this.projData['user']['server_hpb_id']:0;
                               
                            }, (error) => {
                                console.log('Error', error);  
                            }); 
        }, (error) => {
            console.log('Error', error);  
        });

        //ADD OR EDIT FORM DEPENDING ON ACTION 
        let action = this.navParams.get("action"); 

        if( action == 'edit' ){
            this.editMode=true;
            //TREAT THIS PAGE AS EDIT HPB
            let insertData = [];
            insertData = this.navParams.get("productReceiptData");

            //FETCH DATA FROM DATABASE USING PRD ID..
            let insert1 = [];
            var selectField = " * ";
            var tablename = "product_receipt_master";
            var where = " `receipt_id` = "+insertData['receipt_id'];


            this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {
           
            for(let i=0;i<data['rows'].length;i++){       
            insertData = ( data['rows'].item(i) );            
            } 
       
           
            //GET UNIT 
             let insert1 = [];
             var selectField = " `product_unit` ";
             var tablename = "product_master";
             var where =" `server_product_id` ="+insertData['product_id']; 
                this.sqlS.selectTableData(selectField,tablename,where,"","").then((unitData) => {
                this.unitArr=[];    
                for(let i = 0; i < unitData['rows'].length; i++) {
                    console.log(unitData['rows']);
                    this.unitArr.push( unitData['rows'].item(i) );   
                    }  
                    this.unitMobi.instance.option({
                        data: this.unitArr
                    });

                    if( this.unitArr !=undefined &&  this.unitArr !='' ){
                            this.disableUnitFlag=false;
                        }else{
                            this.disableUnitFlag=true;
                        }
                // alert(JSON.stringify(this.unitArr) + ", " + JSON.stringify(this.productsArr));

                //PREFILL ALL FORM VALUES HERE    
                this.ReceiptData['ReceiptId']=insertData['receipt_id'];
                // if( insertData['server_receipt_id'] != undefined &&  insertData['server_receipt_id'] != '' && insertData['server_receipt_id'] >0 ){
                // this.ReceiptData['ServerReceiptId']=  insertData['server_receipt_id'];  
                // }
                // this.ReceiptData['Product'] = insertData['product_id'];
                // this.ReceiptData['Quantity'] = insertData['quantity'];
                // this.ReceiptData['Unit'] = insertData['unit'];
                // this.ReceiptData['RetDist'] = insertData['rds_id'];
                // this.ReceiptData['PurchaseDate'] = this.appCom.timeStampToDateMMMnewM(insertData['purchase_date']);
                // this.ReceiptData['InvoiceQuantity'] = insertData['invoice_quantity'];
                
                this.receiptForm.get('product_name').setValue(insertData['product_id']);
                this.receiptForm.get('product_quantity').setValue(insertData['quantity']);
                this.receiptForm.get('product_unit').setValue(insertData['unit']);
                this.receiptForm.get('product_distributor').setValue(insertData['rds_id']);
                this.receiptForm.get('product_purchase_date').setValue(this.appCom.timeStampToDateMMMnewM(insertData['purchase_date']).toISOString());
                this.receiptForm.get('product_invoice_quantity').setValue(insertData['invoice_quantity']);

                var invoiceImage = ( insertData['invoice_image'] && insertData['invoice_image'] != '' )?JSON.parse(insertData['invoice_image']):[];
                this.ReceiptData['InvoiceImage']=invoiceImage;
                if( invoiceImage !=undefined && invoiceImage !='' && invoiceImage.length > 0 ){
                    for( var i=0;i<invoiceImage.length;i++ ){
                        
                        if(invoiceImage[i].fileType == 'jpeg' || invoiceImage[i].fileType == 'jpg' || invoiceImage[i].fileType == 'png'){
                            //this.invoicePhotoObj.push(  invoiceImage[i].path );
                            this.invoicePhotoObj.push(  this.appCom.getImageLocalPathFull(invoiceImage[i]) );  
                        }else{
                            this.invoicePhotoObj.push('assets/images/document.jpg');
                        }

                    }
                }

                    let ds=[];
                    ds=JSON.parse(insertData['digital_sign']);     
                    this.ReceiptData['HpbDigitalSign']=ds;
                    if( this.ReceiptData['HpbDigitalSign'] !=undefined && this.ReceiptData['HpbDigitalSign'] !=""  ){
                        //this.digitalSignPath= this.appCom.urlSanitizer(ds[0]['path']) ;
                        this.digitalSignPath= this.appCom.getImageLocalPathFull(ds[0]) ;
                    }else{
                    
                    }




                this.ReceiptData['AdditionalComments'] = insertData['additional_comments'];

                this.ReceiptData['latitude'] = insertData['latitude'];
                this.ReceiptData['longitude'] = insertData['longitude'];
             
                this.setUnitData(this.receiptForm.get('product_name').value, "first_product");
                // this.setUnitData(this.receiptForm.get(this.product_clicked).value, '');
           
                
                
            },error=>{
            console.log("error",error);  
            }); 

        },error=>{
            console.log("error",error);
        });

        
        }else{
            //TREAT THIS PAGE AS ADD Product Receipt
            this.editMode=false;

        }


        // let tempDateS=this.dateSettingsG;
        // tempDateS['max']=new Date(moment().add(0, 'days').format());
        // this.dateSettingsG=tempDateS;
        // this.PurchaseDateMob.instance.option(tempDateS);

        //SUBSCRIPTION FOR CAMERA OR GALLERY PHOTO CAPTURED..
         this.events.unsubscribe("getbase64Image");  
        this.events.subscribe('getbase64Image',(base64ImgOBJ) => {

            let base64Image =  base64ImgOBJ.base64Image;
            let extType=".jpeg"; 
            var filename = this.appCom.generateRandomString()+extType;
            this.appCom.savebase64AsImageFile(filename,base64Image,extType).then((path)=>{

                if( base64ImgOBJ.photo_source == "invoice_photo" ){
                    //IF ID CARD MULTIPLE PICS
                    this.invoicePhotoObj.push(this.appCom.urlSanitizer(path));
                    let t ={};
                    t['path']=path;
                    t['name']=filename;
                    t['fileType']="jpeg";
                    t['serverPath']="";
                    t['sync_status']=0; 
                    t['container']="doc";
                    this.ReceiptData.InvoiceImage.push(t);
                }else if( base64ImgOBJ.photo_source == "digital_sign" ){
                    //IF DIGITAL SIGN PICTURE
                    this.ReceiptData.HpbDigitalSign=path;
                    this.digitalSignPath=this.appCom.urlSanitizer(path);
                    let t ={};
                    t['path']=path;
                    t['name']=filename;
                    t['fileType']="jpeg";
                    t['sync_status']=0;
                    t['serverPath']="";
                    t['container']="doc";
                    let tArr=[];
                    tArr.push(t);
                    this.ReceiptData.HpbDigitalSign=(tArr);
                }else if( base64ImgOBJ.photo_source == "doc" ){

                    let container = "doc";
                    this.appCom.saveFile(container).then((dataFile?:any)=>{
                        if(!dataFile){
                            this.appCom.showAlert("Only images,pdfs,excel and doc files allowed.",'OK',null);
                        }else{
                            this.ReceiptData.InvoiceImage.push(dataFile.fileArr);
                            if(dataFile.fileArr.fileType == 'jpeg' || dataFile.fileArr.fileType == 'jpg' || dataFile.fileArr.fileType == 'png'){
                                this.invoicePhotoObj.push(dataFile.filepath);        
                            }else{
                                this.invoicePhotoObj.push('assets/images/document.jpg');
                            }
                        }
                    });   
                }
                
            },(error)=>{
                console.log(error);
            });
        });
    }
    
    getProductsDataOnFilter(serchKey?:any){
        console.log("clear filter called");
        let query="SELECT * FROM product_master WHERE product_type = 'holcim_product'";
        if(serchKey){
            query="SELECT * FROM product_master WHERE product_type = 'holcim_product' and product_name LIKE '%"+serchKey+"%'" ;
        } 
        
        this.sqlS.queryExecuteSql(query,[]).then((resData:any)=>{
            this.productsArr=[];
            if(resData.rows.length>0){
                for(let i=0;i<resData.rows.length;i++){
                    let currTempObj=resData.rows.item(i);
                    this.productsArr.push({
                        text:currTempObj['product_name'],
                        value:currTempObj['server_product_id']
                    });
                }
                this.productMobi.instance.option({
                    data: this.productsArr
                });
            }		
            console.log("productsArr67676----------->",this.productsArr); 
        },(error)=>{
            console.log('sql error',error); 
        });
    }

    getRdsMobiFilter(serchKey?:any){
    
        let query="SELECT * FROM retailer_distributor_master WHERE rds_status=1";
        if(serchKey){
            query="SELECT * FROM retailer_distributor_master WHERE rds_status=1 and rds_name LIKE '%"+serchKey+"%'" ;
        } 
        
        this.sqlS.queryExecuteSql(query,[]).then((resData:any)=>{
            this.rdsArr=[];
            if(resData.rows.length>0){
                for(let i=0;i<resData.rows.length;i++){
                    let currTempObj=resData.rows.item(i);
                    let rds_city = this.appCom.jsonParseCityName(currTempObj['rds_city']);
                    let rds_sub_district = this.appCom.jsonParseCityName(currTempObj['rds_sub_district']);
                    let displayText = currTempObj['rds_name'] + "("+rds_city+", "+rds_sub_district+")";
                    this.rdsArr.push({
                        text:displayText,
                        value:currTempObj['server_rds_id']
                    });
                }
                this.RetDistMobi.instance.option({
                    data: this.rdsArr
                });
            }		
            
        },(error)=>{
            console.log('sql error',error); 
        });
    }

    getUnitMobiFilter(serchKey?:any){
    
        let query="SELECT * FROM product_master WHERE server_product_id="+this.ReceiptData.Product;
        if(serchKey){
            query="SELECT * FROM product_master WHERE server_product_id="+this.ReceiptData.Product+" and product_unit LIKE '%"+serchKey+"%'" ;
        } 
        
        this.sqlS.queryExecuteSql(query,[]).then((resData:any)=>{
            this.unitArr=[];
            if(resData.rows.length>0){
                for (let i = 0; i < resData['rows'].length; i++) {
                    //this.unitArr.push( unitData['rows'].item(i) );   
                    let currTempObj=resData.rows.item(i);
                    this.unitArr.push({
                        text:currTempObj['product_unit'],
                        value:currTempObj['product_unit']
                    });
                }
                this.unitMobi.instance.option({
                    data: this.unitArr
                });
            }		
            
        },(error)=>{
            console.log('sql error',error); 
        });
    }     

    formBuilderInitilizer() {
        this.receiptForm = this.formBuilder.group({
            product_name: ['', Validators.required],
            product_unit: ['', Validators.required],
            product_quantity: ['', Validators.required],
            product_distributor: ['', Validators.required],
            product_purchase_date: ['', Validators.required],
            product_invoice_quantity: ['', Validators.required],
        });
    }


    onSelectProduct(event){ 
        this.unitArr=[]; 
            var selectField = " `product_unit` ";
            var tablename = "product_master";
            var where =" `server_product_id` ='"+event+"'";
            this.sqlS.selectTableData(selectField,tablename,where,"","").then((unitData) => {
                this.unitArr=[];    
                for (let i = 0; i < unitData['rows'].length; i++) {
                        this.unitArr.push( unitData['rows'].item(i) );   
                    } 
                    this.unitMobi.instance.option({
                        data: this.unitArr
                    });
            },error=>{
                console.log("error",error);
            });
            if( this.unitArr !=undefined &&  this.unitArr !='' ){
                this.disableUnitFlag=false;
            }else{
                this.disableUnitFlag=true;
            }
    }

    setUnitData(prod_id, product_form_selected) {
        var selectField = " `product_unit` ";
        var tablename = "product_master";
        var where =" `server_product_id` ='"+prod_id+"'";
        this.sqlS.selectTableData(selectField,tablename,where,"","").then((unitData) => {
            for (let i = 0; i < unitData['rows'].length; i++) {
                //this.unitArr.push( unitData['rows'].item(i) );  
                let currTempObj=unitData.rows.item(i);

                if(product_form_selected == "first_product") {
                    this.unitArr[i] = {
                            text:currTempObj['product_unit'],
                            value:currTempObj['product_unit']
                    }
                }
                else {
                    this.unitArrMore[i] = {
                        text:currTempObj['product_unit'],
                        value:currTempObj['product_unit']
                    }
                }
            }
            this.unitMobi.instance.option({
                data: this.unitArr
            });
            
            setTimeout(()=>{
                    
                // this.UnitM.instance.setVal(this.ReceiptData.Unit,true);
                this.UnitM.instance.setVal(this.receiptForm.get('product_unit').value,true);
            
            },100);
                
        },error=>{
            console.log("error",error);
            this.unitArr=[]; 
        });

        if( this.unitArr !=undefined &&  this.unitArr !='' ){
            this.disableUnitFlag=false;
        }else{
            this.disableUnitFlag=true;
        }
    }    


    initFormData(){

        return new Promise((resolve,reject)=>{
             
            let allSyncTask=[];
                let allTaskComplete = ()=>{
                resolve(true);
            }
                
            allSyncTask.push((callback)=>{
                this.rdsArr=[];
                let queryRDS="SELECT * FROM retailer_distributor_master WHERE rds_status=1";
                this.sqlS.queryExecuteSql(queryRDS,[]).then((resData:any)=>{

                    if(resData.rows.length>0){

                        for(let i=0;i<resData.rows.length;i++){
                            let currTempObj=resData.rows.item(i);
                            
                            let rds_city = this.appCom.jsonParseCityName(currTempObj['rds_city']);
                            let rds_sub_district = this.appCom.jsonParseCityName(currTempObj['rds_sub_district']);
                            let displayText = currTempObj['rds_name'] + "("+rds_city+", "+rds_sub_district+")";
                            this.rdsArr.push({
                                text:displayText,
                                value:currTempObj['server_rds_id']
                            });
                        }
                        this.RetDistMobi.instance.option({
                            data: this.rdsArr
                        });

                    }
                    callback();
                },(error)=>{
                    console.log('error queryRDS initFormData',error);
                    callback();
                });
            });

            allSyncTask.push((callback)=>{

                this.productsArr=[];
                let query="SELECT * FROM product_master WHERE product_type = 'holcim_product'";
                this.sqlS.queryExecuteSql(query,[]).then((resData:any)=>{

                    if(resData.rows.length>0){

                        for(let i=0;i<resData.rows.length;i++){
                            let currTempObj=resData.rows.item(i);
                            this.productsArr.push({
                                text:currTempObj['product_name'],
                                value:currTempObj['server_product_id']
                            });
                        }
                        this.productMobi.instance.option({
                            data: this.productsArr
                        });

                    }
                    callback();
                },(error)=>{
                    console.log('error queryRDS initFormData',error);
                    callback();
                });


            });

            async.parallel(allSyncTask, function(){
                allTaskComplete();
            });

        });
        
    }

    changeProductRecpt(event){
        this.busy = this.checkReciptBalQuiL().then((resData:any)=>{
                this.totalQ=resData['totalQ'];
                this.totalIQ=resData['totalIQ'];
        },()=>{
                console.log('changeProductRecpt error');
        });
    }

  
    checkReciptBalQuiL(){
        return new Promise((resolve,reject)=>{
                    
            let projectId=this.projServerId;
            // let productId=this.ReceiptData.Product;

            let productId=this.receiptForm.get('product_name').value;

            let productType="holcim_product";
            let currRecpId = this.ReceiptData['ReceiptId']?this.ReceiptData['ReceiptId']:0;
            let queryBal = "SELECT DISTINCT prm.receipt_id,prm.server_receipt_id,prm.quantity,prm.unit,prm.invoice_quantity FROM  product_receipt_master prm  JOIN products_receipt_approval_tbl prat on prm.server_receipt_id=prat.server_receipt_id JOIN product_master pdm ON prm.product_id = pdm.server_product_id WHERE prm.server_receipt_id>0 AND prat.is_closed=0 AND prat.approval_status=1 AND prat.approval_role='SA'  AND prm.server_project_id>0 AND pdm.is_cement=1 AND pdm.server_product_id="+productId+" AND pdm.product_type='"+productType+"' AND prm.server_project_id="+projectId+" AND  prm.receipt_id <> "+currRecpId;
            console.log('queryBal',queryBal);
            this.sqlS.queryExecuteSql(queryBal,[]).then((reslData:any)=>{
                let allBalDatas=[];
                let totalQ=0;
                let totalIQ=0;
                for(let i=0;i<reslData.rows.length;i++) {
                    let temObb = reslData.rows.item(i);
                    totalQ = totalQ + temObb['quantity'];
                    totalIQ = totalIQ + temObb['invoice_quantity'];
                // allBalDatas.push(temObb);
                }
                let respObj= {
                    totalQ:totalQ,
                    totalIQ:totalIQ
                };
                console.log('respObj',respObj);
                resolve(respObj);
            },(error)=>{
                console.log(error);
                resolve(false);
            });
        });
    }  


    //SUBMIT Product Receipt DATA FORM
    submitProductReceiptForm(){
        this.submitted=true;
        let isvalid = false;

        // isvalid = ( this.Product.valid && this.Quantity.valid &&  this.RetDist.valid && this.ReceiptData.PurchaseDate != undefined && this.ReceiptData.PurchaseDate != '' && 
        //         this.ReceiptData.InvoiceQuantity>=0 && this.digitalSignPath !='' && this.digitalSignPath !=undefined &&
        //         this.invoicePhotoObj.length != 0 && this.invoicePhotoObj != '' && this.invoicePhotoObj !=undefined
        //         && this.Unit.value != undefined && this.Unit.value != '' && this.ReceiptData.RetDist>0
        //         )
        isvalid = ( this.receiptForm.valid && this.digitalSignPath !='' && this.digitalSignPath !=undefined &&
                    this.invoicePhotoObj.length != 0 && this.invoicePhotoObj != '' && this.invoicePhotoObj !=undefined
                );

        if(isvalid){
            this.busy = this.checkReciptBalQuiL().then((resData:any)=>{
                this.totalQ=resData['totalQ'];
                this.totalIQ=resData['totalIQ'];

                //QUANTITY AND INVOICE LOGIC
                let diffTotal = this.totalIQ-this.totalQ;
                // let currQ=parseInt(this.Quantity.value);
                // let currIQ=parseInt(this.InvoiceQuantity.value);

                let currQ=parseInt(this.receiptForm.get('product_quantity').value);
                let currIQ=parseInt(this.receiptForm.get('product_invoice_quantity').value);
                let subFlag=true;

                if(diffTotal<=0){ // First check

                    console.log('if 1 diffTotal',diffTotal);
                    console.log('if 1 currQ',currQ);
                    console.log('if 1 currIQ',currIQ);

                    if(  currQ > currIQ ){ // first inner check
                        //not allowed
                        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.QTY_INVOICE_CONDITION_ERR,"Ok",""); 
                        // subFlag=false;
                        subFlag=true;
                    }
                } else { // Second check
                    let totalBal=diffTotal+currIQ;
                    console.log('else 1 totalBal',totalBal);
                    console.log('else 1 diffTotal',diffTotal);
                    console.log('else 1 currQ',currQ);
                    console.log('else 1 currIQ',currIQ);
                    if(  currQ > totalBal ){ // Second inner check
                        //not allowed
                        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.QTY_INVOICE_CONDITION_ERR,"Ok",""); 
                        // subFlag=false;
                        subFlag=true;
                    }   
                }
                
                if(subFlag){
                    this.submitProductReceiptFormF();
                } else {
                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.QTY_INVOICE_CONDITION_ERR,"Ok",""); 
                }
                

            });
         }
        else{
            //invalid
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_FIELDS_FORM_ERR,"Ok","");
        }
    }
      
    submitProductReceiptFormF(){
    
        let currentTimeStamp = this.appCom.getCurrentTimeStamp();
        this.errRecieptFlag = false;

        for(let key in this.receiptForm.value)
        {
            if(key.includes('product_name'))
            {
                this.product_name.push(this.receiptForm.get(key).value);
            }
            if(key.includes('product_quantity'))
            {
                this.product_quantity.push(this.receiptForm.get(key).value);
            }
            if(key.includes('product_unit'))
            {
                this.product_unit.push(this.receiptForm.get(key).value);
            }
        }

        //SAVE Product Receipt TO DATABASE

        // insertData['product_id']=this.ReceiptData['Product']; //server_product_id
        // insertData['quantity']=this.ReceiptData['Quantity'];
        // insertData['unit']=this.ReceiptData['Unit'];
        // insertData['rds_id']=this.ReceiptData['RetDist']; //server rds id
        // insertData['purchase_date']= this.appCom.dateToTimeStamp(this.ReceiptData['PurchaseDate']);
        // insertData['invoice_quantity']=this.ReceiptData['InvoiceQuantity'];

        for(let index=0; index<this.product_name.length; index++) {

            let insertData = {};
            insertData['hpb_id'] = this.projData['user']?this.projData['user']['hpb_id']:""; 
            insertData['server_hpb_id']= this.hpbServerId;
            insertData['hpb_status']= this.hpbStatus;
            insertData['server_project_id']=this.projServerId;
            insertData['project_id']=this.projData['project_id'];
            insertData['product_id']=this.product_name[index]; //server_product_id
            insertData['quantity']=this.product_quantity[index];
            insertData['unit']=this.product_unit[index];
            insertData['rds_id']=this.receiptForm.get('product_distributor').value; //server rds id
            insertData['purchase_date']= this.appCom.dateToTimeStamp(this.ReceiptData['PurchaseDate']);
            insertData['invoice_quantity']=this.receiptForm.get('product_invoice_quantity').value;
            insertData['sync_status']=0;

            if( this.ReceiptData.InvoiceImage != undefined && this.ReceiptData.InvoiceImage != '' && this.ReceiptData.InvoiceImage.length > 0 ){
                insertData['invoice_image'] = JSON.stringify( this.ReceiptData.InvoiceImage ); 
            } else {
                insertData['invoice_image'] = '';
            }
            insertData['digital_sign'] = JSON.stringify(this.ReceiptData['HpbDigitalSign']);
            
            if( this.ReceiptData['AdditionalComments'] != undefined && this.ReceiptData['AdditionalComments'] != '' ){
                insertData['additional_comments'] = this.ReceiptData['AdditionalComments'].trim();
            }
            insertData['local_updated_date'] = currentTimeStamp;
            // insertData['updatedby'] = this.ReceiptData['updatedby'];
            insertData['assigned_to'] = this.userId;
            insertData['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId; 
            
          
            if( parseInt(this.ReceiptData['ReceiptId']) > 0 ){
                console.log("this.ReceiptData['ReceiptId']=>",this.ReceiptData['ReceiptId']);
                insertData['updated_date'] = currentTimeStamp;
                insertData['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;  
                //UPDATE EXISTING RECEIPT DATA
                let whereCond =" `receipt_id` = "+this.ReceiptData['ReceiptId'];  //server_receipt_id 
            
                this.sqlS.updateData(insertData,"product_receipt_master",whereCond).then((data) => {
                            
                    this.receiptsAprovalInsertUpdate(this.ReceiptData['ReceiptId'],'update',this.product_quantity[index],this.product_name[index]).then((success)=>{
                        this.globalCheckInData['visitCheckFlag'] = true;
                        this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{});

                        // Foor alert message
                        this.progress_status = "receipt_success_updated";

                        console.log("p1");
                    });
                    
                }, (error) => {
                    console.log('Error', error);
                    
                    console.log("p2");
                    // For alert message
                    this.progress_status = "receipt_error_update";
                });    

            }
            else {
                console.log("new entry=>");
                this.appCom.isGpsLocationEnabledC((successCallback)=>{			
                    if(successCallback)	{
                        this.appCom.getLocationModeC((res) => {
                    
                            if(res == 'high_accuracy'){                    
                                    this.busy=  this.appCom.getGeoLocationCordinates("submitProductReceipt").then((geoCordinates)=>{
                                        this.addReceiptGeoLoc(geoCordinates,insertData,this.product_quantity[index],this.product_name[index]);
                                    
                                    },(error)=>{
                                        console.log(error);

                                        // For alert message
                                        this.progress_status = "receipt_error_location";
                                        
                                        this.addReceiptGeoLoc('',insertData,this.product_quantity[index],this.product_name[index]);
                                    });
                            
                            }else{
                                //show pop up for set high accuracy..
                                //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                                this.addReceiptGeoLoc('',insertData,this.product_quantity[index],this.product_name[index]);
                            }
                        },(err)=>{
                            console.log(err);
                        });
                    }else{
                        //show alert enable gps
                        this.progress_status = "receipt_err_get_location_coord";
                    }	

                },(err)=>{
                    console.log(err);
                    this.progress_status = "receipt_err_generic_location_err";
                }); 

            }
        }

        // Show alert
        // if(this.progress_status == "receipt_success_updated") {
        //     this.navCtrl.pop().then(()=>{
        //         this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.PRODUCT_RECEIPT_UPDATE_SUCCESS,"Ok",""); 
        //         setTimeout(()=>{
        //                 this.events.publish('globalSync'); 
        //         },1000)
        //     });
        // } else if(this.progress_status == 'receipt_error_update') {
        //     this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.PRODUCT_RECEIPT_UPDATE_ERR,"Ok","");  
        // } else if(this.progress_status == "receipt_error_location") {
        //     this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
        // } else if(this.progress_status == "receipt_err_get_location_coord") {
        //     this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
        // } else if(this.progress_status == "receipt_err_generic_location_err") {
        //     this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
        // }

    } 

    addReceiptGeoLoc(geoCordinates,insertData,product_quantity,product_id){
        console.log("addReceiptGeoLoc");
        console.log("geoCordinates=>",geoCordinates);
        console.log("errRecieptFlag=>",this.errRecieptFlag);
        this.ReceiptData.latitude=(geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
        this.ReceiptData.longitude=(geoCordinates['coords'])?geoCordinates['coords'].longitude:"";   

            insertData['server_receipt_id']=0;
            insertData['latitude'] = this.ReceiptData['latitude'];
            insertData['longitude'] = this.ReceiptData['longitude'];
            insertData['local_created_date'] = this.appCom.getCurrentTimeStamp();
            insertData['local_updated_date'] = this.appCom.getCurrentTimeStamp();
            insertData['created_by'] = this.userId; 
            insertData['generated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;
            insertData['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;  
            
                                                
            insertData['assigned_to'] = this.userId;
            
        

            //BEFORE INSERTING CHECK FOR PRODUCT RECEIPTS ARE IN SYNC..

            this.busy=this.sqlS.insertData(insertData,"product_receipt_master").then((data) => {
                //this.events.publish('globalSync'); 

                console.log("insertData product_receipt_master completed");
                
                this.appCom.updateMyPlanStats('mason');
                this.appCom.updateMyPlanStats('contractor');
               
                this.busy= this.receiptsAprovalInsertUpdate(data.insertId,'insert',product_quantity,product_id).then((flag)=>{
                   console.log("errRecieptFlag=>",this.errRecieptFlag);
                    this.globalCheckInData['visitCheckFlag'] = true;
                    this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{});
                
                    if(this.errRecieptFlag){
                        this.navCtrl.pop().then(()=>{
                            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.PRODUCT_RECEIPT_ADD_ERR,"Ok","");  
                            setTimeout(()=>{
                                this.events.publish('globalSync'); 
                            },1000)
                        });
                    }else{
                        this.navCtrl.pop().then(()=>{
                            this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.PRODUCT_RECEIPT_ADD_SUCCESS,"Ok","");  
                            setTimeout(()=>{
                                this.events.publish('globalSync'); 
                            },1000)
                        });
                    }
                });
            
            }, (error) => {
                console.log('Error', error);
                //alert(JSON.stringify(error));
                //this.globalCheckInData['visitCheckFlag'] = true;
                //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.PRODUCT_RECEIPT_ADD_ERR,"middle");
                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.PRODUCT_RECEIPT_ADD_ERR,"Ok","");  
            });
    }

    //CAMERA OR GALLERY SELECTION POP
    openSelectCameraPop(myEvent,photo_source){
        var popover;
        popover = this.popoverCtrl.create(ImageSelectPopPage,{photo_source});
        popover.present({
            ev: myEvent
        });
    }
    
    //SIGNATURE PAD POP
    getSignature(){
        let Modal = this.modalCtrl.create(DigitalSignCanvasPage);
        Modal.present();
    }

    removeInvoiceImage(i){
        this.invoicePhotoObj.splice(i, 1);
        this.ReceiptData.InvoiceImage.splice(i,1);
    }

    goHome(){
        this.navCtrl.setRoot(HomePage);
    }

    selectFile(container?:any){
   
    }

    receiptsAprovalInsertUpdate(receipt_id,type,product_quantity,product_id){
        return new Promise((resolve,reject)=>{
            this.errRecieptFlag = false;
            if(type=="insert"){
                
                    this.checkAcApproval(product_quantity,product_id).then((resFlag:any)=>{
                            
                        let roleArrs=['TLH','SA'];
                        let insert_cnt = 0;
                        if(resFlag){
                            roleArrs=['TLH','AC','SA'];
                        }
                        async.each(roleArrs,(roleArr,callback)=>{
                            
                                let approvalInsert={};
                                approvalInsert['receipt_id']=receipt_id;
                                approvalInsert['server_receipt_id']=0;

                                if(roleArr == "TLH") {
                                    approvalInsert['approval_status']=1;
                                } else {
                                    approvalInsert['approval_status']=0;
                                }
                                    
                                approvalInsert['approval_role']=roleArr; 
                                //approvalInsert['approved_by']=this.userId;                                                          
                                approvalInsert['local_created_date']=this.appCom.getCurrentTimeStamp();
                                approvalInsert['local_updated_date']=this.appCom.getCurrentTimeStamp();
                                approvalInsert['created_by']=this.userId;
                                approvalInsert['updated_by']=this.userId;
                                approvalInsert['sync_status']=0;
                                this.sqlS.insertData(approvalInsert,"products_receipt_approval_tbl").then((data)=>{ 
                                    insert_cnt++;
                                    console.log("callback"+insert_cnt);
                                    callback();                             
                                },(error)=>{
                                    this.sqlS.insertData(approvalInsert,"products_receipt_approval_tbl").then((data)=>{ 
                                        insert_cnt++;
                                        console.log("callback"+insert_cnt);
                                        callback();                             
                                    },(error)=>{
                                        this.errRecieptFlag = true;
                                        console.log("errRecieptFlag=>",this.errRecieptFlag);
                                        callback();
                                    });
                                });
                                
                        },()=>{
                            console.log("entered into completion of async");
                            console.log("insert_cnt=>",insert_cnt);
                            console.log("roleArrs.length=>",roleArrs.length);
                            if(insert_cnt==roleArrs.length){
                                console.log("insert count match with roleArrs length,all 4 insertion completed");
                                resolve(true);
                            }else{
                                console.log("All data deleted from product_receipt_master and products_receipt_approval_tbl");
                                this.sqlS.queryExecuteSql("Delete FROM product_receipt_master WHERE receipt_id = "+receipt_id+"",[]).then((dataRes:any)=>{
                                    this.sqlS.queryExecuteSql("Delete FROM products_receipt_approval_tbl WHERE receipt_id = "+receipt_id+"",[]).then((dataRes:any)=>{
                                        resolve(false);
                                    },(error)=>{
                                        resolve(false);
                                    });
                                },(error)=>{
                                    resolve(false);
                                });
                            }
                        });
                    },(error)=>{
                        resolve(false);
                    });
    
    
            }else if(type=="update"){
    
                
                let queryCheck="SELECT * FROM products_receipt_approval_tbl WHERE receipt_id="+receipt_id+" AND approval_status <> 0 AND is_closed=0";
                console.log("queryCheck--->",queryCheck);
                this.sqlS.queryExecuteSql(queryCheck,[]).then((dataRes:any)=>{
                        console.log("dataRes--->",dataRes);  
                        if(dataRes.rows.length>0){
                            let approvalInsertUpdate={};
                            approvalInsertUpdate['is_closed']=1;
                            approvalInsertUpdate['sync_status']=0;
                            let whereCond =" receipt_id="+receipt_id;
                            this.sqlS.updateData(approvalInsertUpdate,"products_receipt_approval_tbl",whereCond).then((data) => {
                                    console.log("data--->",data);  
                                    this.checkAcApproval(product_quantity,product_id).then((resFlag:any)=>{
                                        console.log("resFlag--->",resFlag); 
                                        let insert_cnt = 0;      
                                        let roleArrs=['TLH','SA'];
                                        if(resFlag){
                                            roleArrs=['TLH','AC','SA'];
                                        }
                                        async.each(roleArrs,(roleArr,callback)=>{
                                                let approvalInsert={};
                                                approvalInsert['receipt_id']=receipt_id;
                                                approvalInsert['server_receipt_id']=0;

                                                // Current change
                                                if(roleArr == "TLH")
                                                {
                                                    approvalInsert['approval_status']=1;
                                                } else {
                                                    approvalInsert['approval_status']=0;
                                                }

                                                approvalInsert['approval_role']=roleArr; 
                                                //approvalInsert['approved_by']=this.userId;                                                          
                                                approvalInsert['local_created_date']=this.appCom.getCurrentTimeStamp();;
                                                approvalInsert['local_updated_date']=this.appCom.getCurrentTimeStamp();;
                                                approvalInsert['created_by']=this.userId;
                                                approvalInsert['updated_by']=this.userId;
                                                approvalInsert['sync_status']=0;

                                                this.sqlS.insertData(approvalInsert,"products_receipt_approval_tbl").then((data)=>{ 
                                                    insert_cnt++;
                                                    console.log("callback"+insert_cnt);
                                                    callback();                             
                                                },(error)=>{
                                                    this.sqlS.insertData(approvalInsert,"products_receipt_approval_tbl").then((data)=>{ 
                                                        insert_cnt++;
                                                        console.log("callback"+insert_cnt);
                                                        callback();                             
                                                    },(error)=>{
                                                        this.errRecieptFlag = true;
                                                        console.log("errRecieptFlag=>",this.errRecieptFlag);
                                                        callback();
                                                    });
                                                });
    
                                        },(complete)=>{
                                            resolve(true);
                                        });
    
                                    },(error)=>{
                                        resolve(true);
                                    });
    
                            },error=>{
                                this.errRecieptFlag = true;
                                resolve(false);
                                console.log("error",error);
                            });
    
                        }else{
    
                            let queryCheck="SELECT * FROM products_receipt_approval_tbl WHERE receipt_id="+receipt_id+" AND approval_status =0 AND is_closed=0";
                            this.sqlS.queryExecuteSql(queryCheck,[]).then((dataRes:any)=>{
    
                        
                                if(dataRes.rows.length==0){

                                this.checkAcApproval(product_quantity,product_id).then((resFlag:any)=>{
                                        
                                    let roleArrs=['TLH','SA'];
                                    let insert_cnt = 0;
                                    if(resFlag){
                                            roleArrs=['TLH','AC','SA'];
                                    }
                                    async.each(roleArrs,(roleArr,callback)=>{
                                            let approvalInsert={};
                                            approvalInsert['receipt_id']=receipt_id;
                                            approvalInsert['server_receipt_id']=0;

                                            if(roleArr == "TLH") {
                                                approvalInsert['approval_status']=1;
                                            } else {
                                                approvalInsert['approval_status']=0;
                                            }

                                            approvalInsert['approval_role']=roleArr; 
                                            //approvalInsert['approved_by']=this.userId;                                                          
                                            approvalInsert['local_created_date']=this.appCom.getCurrentTimeStamp();;
                                            approvalInsert['local_updated_date']=this.appCom.getCurrentTimeStamp();;
                                            approvalInsert['created_by']=this.userId;
                                            approvalInsert['updated_by']=this.userId;
                                            approvalInsert['sync_status']=0;

                                            this.sqlS.insertData(approvalInsert,"products_receipt_approval_tbl").then((data)=>{ 
                                                insert_cnt++;
                                                console.log("callback"+insert_cnt);
                                                callback();                             
                                            },(error)=>{
                                                this.sqlS.insertData(approvalInsert,"products_receipt_approval_tbl").then((data)=>{ 
                                                    insert_cnt++;
                                                    console.log("callback"+insert_cnt);
                                                    callback();                             
                                                },(error)=>{
                                                    this.errRecieptFlag = true;
                                                    console.log("errRecieptFlag=>",this.errRecieptFlag);
                                                    callback();
                                                });
                                            });

                                    },(complete)=>{
                                        resolve(true);
                                    });

                                },(error)=>{
                                    resolve(false); 
                                });
                                }else{
                                        let approvalInsertUpdate={};
                                        approvalInsertUpdate['is_closed']=1;
                                        approvalInsertUpdate['sync_status']=0;
                                        let whereCond =" receipt_id="+receipt_id;
                                        this.sqlS.updateData(approvalInsertUpdate,"products_receipt_approval_tbl",whereCond).then((data) => {
                                                console.log("data--->",data);  
                                                this.checkAcApproval(product_quantity,product_id).then((resFlag:any)=>{
                                                    console.log("resFlag--->",resFlag);       
                                                    let roleArrs=['TLH','SA'];
                                                    let insert_cnt = 0;
                                                    if(resFlag){
                                                            roleArrs=['TLH','AC','SA'];
                                                    }
                                                    async.each(roleArrs,(roleArr,callback)=>{
                                                            let approvalInsert={};
                                                            approvalInsert['receipt_id']=receipt_id;
                                                            approvalInsert['server_receipt_id']=0;

                                                            if(roleArr == "TLH") {
                                                                approvalInsert['approval_status']=1;
                                                            } else {
                                                                approvalInsert['approval_status']=0;
                                                            }

                                                            approvalInsert['approval_role']=roleArr; 
                                                            //approvalInsert['approved_by']=this.userId;                                                          
                                                            approvalInsert['local_created_date']=this.appCom.getCurrentTimeStamp();;
                                                            approvalInsert['local_updated_date']=this.appCom.getCurrentTimeStamp();;
                                                            approvalInsert['created_by']=this.userId;
                                                            approvalInsert['updated_by']=this.userId;
                                                            approvalInsert['sync_status']=0;
                                                            
                                                            this.sqlS.insertData(approvalInsert,"products_receipt_approval_tbl").then((data)=>{ 
                                                                insert_cnt++;
                                                                console.log("callback"+insert_cnt);
                                                                callback();                             
                                                            },(error)=>{
                                                                this.sqlS.insertData(approvalInsert,"products_receipt_approval_tbl").then((data)=>{ 
                                                                    insert_cnt++;
                                                                    console.log("callback"+insert_cnt);
                                                                    callback();                             
                                                                },(error)=>{
                                                                    this.errRecieptFlag = true;
                                                                    console.log("errRecieptFlag=>",this.errRecieptFlag);
                                                                    callback();
                                                                });
                                                            });

                                                    },(complete)=>{
                                                        resolve(true);
                                                    });

                                                },(error)=>{
                                                    resolve(false);
                                                });

                                        },error=>{
                                            this.errRecieptFlag = true;
                                            console.log("error",error);
                                            resolve(false);
                                        });

                                }

                            });    
    
    
                        }
    
                },(error)=>{
                    console.log("error",error);
                    resolve(false);
                });
    
            
    
    
            }
            
        });
            
            
        //    setTimeout(()=> {
        //         this.events.publish('globalSync'); 
        //    }, 3000);

    }

    checkAcApproval(product_quantity,product_id){
        return new Promise((resolve,reject)=>{
            
            let selectField = " * ";
            let tablename = "product_master";
            let where=" `server_product_id`="+ product_id;
            this.sqlS.selectTableData(selectField,tablename,where,"","").then((productData) => {
                let result = productData['rows'].item(0);
                let d = parseInt(product_quantity) > parseInt(result['req_ac_approv_qty']);
                if(d){
                        resolve(true);  
                }else{
                     resolve(false);
                }
                
            },error=>{
                console.log("error",error);
                resolve(false);
            }); 
            
        });    
    }

    addProductToReceipt() {
        if(this.receiptForm.get('product_name').valid && this.receiptForm.get('product_unit').valid && this.receiptForm.get('product_quantity').valid) {
            this.product_addition_count++;
            
            this.receiptForm.addControl('product_name' + this.product_addition_count, new FormControl('', Validators.required));
            this.receiptForm.addControl('product_unit' + this.product_addition_count, new FormControl('', Validators.required));
            this.receiptForm.addControl('product_quantity' + this.product_addition_count, new FormControl('', [ Validators.required ]));

            this.product_addition.push({
                'product_name' : 'product_name' + this.product_addition_count,
                'product_unit' : 'product_unit' + this.product_addition_count,
                'product_quantity' : 'product_quantity' + this.product_addition_count,
            });
        }
        else {
            this.appCom.showAlert("Please fill all product detail first.",'OK',null);
        }
    }

    removeProductFromReceipt(product_control_name) {
        for(let index=0; index<this.product_addition.length; index++) {
            if(product_control_name == this.product_addition[index]) {
                
                var indexOf = this.product_addition.indexOf(product_control_name);
                
                this.receiptForm.removeControl(product_control_name.product_name);
                this.receiptForm.removeControl(product_control_name.product_unit);
                this.receiptForm.removeControl(product_control_name.product_quantity);

                this.product_addition.splice(indexOf, 1);

            }
        }
    }

    setClickedProduct(product_control_name) {
        this.product_clicked = product_control_name;
    }

    setClickedUnit(unit_control_name) {
        this.unit_clicked = unit_control_name;
    }


}
