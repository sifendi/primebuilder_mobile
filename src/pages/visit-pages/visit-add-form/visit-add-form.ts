import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";
import { ALL_MESSAGE } from "../../../providers/constant";
import { HomePage } from "../../home/home";
import { VisitDetailsPage } from "../visit-detail-page/visit-detail-page";
declare var cordova;
declare var sessionUserGlobalData;


@Component({
  selector: 'visit-add-form',
  templateUrl: 'visit-add-form.html',
})
export class AddVisitFormPage {
  
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

  brandArr:any=[];
  additionalComments:any;
  visitDate:any;
  errorflag:any=0;
  currStockDetailArr=[];
  rdsData:any
  busy:  Promise<any>;
  busyMessage:any;
  userId:any;
  productsArrDist:any=[];
  productsArrRet:any=[];
  isRetailerFlag:any=false;
  unitArr:any=[];

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
      buttons:['set','clear','cancel']
     
  };

    mobiScollUnitSettings:any = {
      inputClass: 'text-input',
      theme: 'material',
      showOnFocus: true,
      group: false,
      filter: true,
      placeholder: 'Please select',
      rows:3,
      data:[],
      readonly:false,
      buttons:['set','clear','cancel']
 
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods,public sqlS: SqlServices, public platform: Platform,public events:Events) {
     
      this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
      this.globalCheckInData = checkinObj;
      console.log("this.globalCheckInData",this.globalCheckInData);
      });
       
      let currStockItemObj={StockId:null, VisitId:null,BrandId:null,BrandName:null,StockSellingPrice:null,StockPromo:null,StockQuantity:null,StockUnit:null,unitArr:null,disableUnitFlag:false };
      this.currStockDetailArr.push(currStockItemObj);
      this.visitDate = this.appCom.timeStampToDate(Date.now());
      var params=this.navParams.data; //rdsData
      this.rdsData=params['rdsData'];
      console.log("this.rdsData---------->",this.rdsData);
      if( this.rdsData['rds_type'] == 'retailer' ){
          this.isRetailerFlag = true;
      }else{
          this.isRetailerFlag = false;
      }

  }

  ionViewDidLoad() {
 
        //GET CURRENT USER DATA
  this.userId=sessionUserGlobalData['userId'];


    //POPULATE PRODUCTS DATA FOR DISTRIBUTOR

    let selectField = " * ";
    let tablename = "product_master";
    let where="";
    if(!this.isRetailerFlag){
          where=" `product_type` = 'holcim_product'";
    }
    this.sqlS.selectTableData(selectField,tablename,where,"","").then((productData) => {
        
            if(productData.rows.length>0){
                for(let i=0;i<productData.rows.length;i++){
                    let currTempObj=productData.rows.item(i);
                    this.productsArrDist.push({
                        text:currTempObj['product_name'],
                        value:currTempObj['server_product_id']
                    });
                }
            } 

    });



   
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }


  addMoreStockItem(){     
  let currStockItemObj={StockId:null, VisitId:null,BrandId:null,BrandName:null,StockSellingPrice:null,StockPromo:null,StockQuantity:null,StockUnit:null,unitArr:null,disableUnitFlag:false };
  this.currStockDetailArr.push(currStockItemObj); 
  }

  removeStockItem(i){
     if(this.currStockDetailArr.length>1){
        this.currStockDetailArr.splice(i,1);
     }
  }

       onSelectProduct(event,index){  //unitArr
                console.log("on select product");
                var selectField = " `product_unit` ";
                var tablename = "product_master";
                var where =" `server_product_id` ='"+event+"'";
               this.busy= this.sqlS.selectTableData(selectField,tablename,where,"","").then((unitData) => {
                this.currStockDetailArr[index]['unitArr']=[]; 
                    for (let i = 0; i < unitData['rows'].length; i++) {

                            let currTempObj = unitData['rows'].item(i);
                            this.currStockDetailArr[index]['unitArr'].push({ 
                                text:currTempObj['product_unit'],
                                value:currTempObj['product_unit']
			                });

                        } 

                        console.log('stock Unit',this.currStockDetailArr[index].StockUnit);
                        let tempCurrDeatData = this.currStockDetailArr;
                        this.currStockDetailArr=[];
                        setTimeout(()=>{
                        this.currStockDetailArr=tempCurrDeatData;
                        },1);
                        
                       
                });
              
        }


  submit(){
    this.errorflag = 0;

    for(let i=0;i< this.currStockDetailArr.length;i++){
        var isnull = this.currStockDetailArr[i]['BrandName'] == null && this.currStockDetailArr[i]['StockSellingPrice'] == null &&
                    this.currStockDetailArr[i]['StockPromo'] == null && this.currStockDetailArr[i]['StockQuantity'] == null
                    && this.currStockDetailArr[i]['StockUnit'] == null ; 
        if(isnull){
          if(this.currStockDetailArr.length>1){  
            this.currStockDetailArr.splice(i,1);
          }        
        }   
    }

  for( var i=0;i<this.currStockDetailArr.length;i++ ){
    //FORM VALIDATION
       console.log("sdfsfsf",this.currStockDetailArr);
    if( this.currStockDetailArr[i]['BrandName'] == undefined || this.currStockDetailArr[i]['BrandName'] == '' ){
      //show toast
      this.appCom.showToast("Brand "+(i+1)+": Brand name is required","middle");
      this.errorflag=1;
      return false;
    }
    if( this.currStockDetailArr[i]['StockSellingPrice'] == undefined || this.currStockDetailArr[i]['StockSellingPrice'] == '' ){
      //show toast
      this.appCom.showToast("Brand "+(i+1)+": Stock selling price is required","middle");
      this.errorflag=1;
      return false;
    }
    if( this.currStockDetailArr[i]['StockSellingPrice'] != undefined || this.currStockDetailArr[i]['StockSellingPrice'] != '' ){
          this.currStockDetailArr[i]['StockSellingPrice']= this.currStockDetailArr[i]['StockSellingPrice'].trim();
          console.log("!this.allowOnlyNumbers( this.currStockDetailArr[i]['StockSellingPrice']",(!this.allowOnlyNumbers( this.currStockDetailArr[i]['StockSellingPrice'])));
         if( !this.allowOnlyNumbers( this.currStockDetailArr[i]['StockSellingPrice'] ) ||  this.currStockDetailArr[i]['StockSellingPrice'] == undefined || this.currStockDetailArr[i]['StockSellingPrice'] == "" ){
            //show toast
            this.appCom.showToast("Brand "+(i+1)+": Stock selling price is invalid","middle");               
            this.errorflag=1;
            return false;     
         }
    }   


    if( this.currStockDetailArr[i]['StockUnit'] == undefined || this.currStockDetailArr[i]['StockUnit'] == '' ){
      //show toast
      this.appCom.showToast("Brand "+(i+1)+": Type of packaging is required","middle");
      this.errorflag=1;
      return false;
    } 

     if( this.currStockDetailArr[i]['StockPromo'] == undefined || this.currStockDetailArr[i]['StockPromo'] == '' || this.currStockDetailArr[i]['StockPromo'] == null ){
      //show toast
      this.appCom.showToast("Brand "+(i+1)+": Stock promotion is required","middle");
      this.errorflag=1;
      return false; 
    }

    if( this.currStockDetailArr[i]['StockQuantity'] == undefined || this.currStockDetailArr[i]['StockQuantity'] == '' ||  this.currStockDetailArr[i]['StockQuantity'] == null ){
      //show toast
      this.appCom.showToast("Brand "+(i+1)+": Stock quantity is required","middle");
      this.errorflag=1;
      return false;     
    }

    if( this.currStockDetailArr[i]['StockQuantity'] != undefined || this.currStockDetailArr[i]['StockQuantity'] != '' ||  this.currStockDetailArr[i]['StockQuantity'] != null ){
        this.currStockDetailArr[i]['StockQuantity']= this.currStockDetailArr[i]['StockQuantity'].trim(); 
        if( this.currStockDetailArr[i]['StockQuantity'] == undefined || this.currStockDetailArr[i]['StockQuantity'] == "" || !this.allowOnlyNumbers( this.currStockDetailArr[i]['StockQuantity'] )  ){
            this.appCom.showToast("Brand "+(i+1)+": Stock quantity is invalid","middle");
            this.errorflag=1;
            return false;   
        }
    }

  }  

      if( this.errorflag == 0 ){
       //submit form here.. 
      console.log("submitted",this.currStockDetailArr);   
      
      
      
      
      
      
      
          //get the geo co-ordinates
    	this.appCom.isGpsLocationEnabledC((successCallback)=>{			
          if(successCallback)	{
                    this.appCom.getLocationModeC((res) => {
                    console.log("res",res);
                        //if(res == 'high_accuracy'){
                                
                            this.busy=  this.appCom.getGeoLocationCordinates("add visit").then((geoCordinates)=>{
                            
                                this.addVisitGeoloc(geoCordinates);   

                            },(error)=>{
                                console.log(error);
                            //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                this.addVisitGeoloc('');
                            });
                          
                        // }else{
                        //   //show pop up for set high accuracy..
                        //    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                          
                        // }
                  },(err)=>{
                      console.log(err);
                  });
          }else{
            //show alert enable gps
             this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
            
          }	

      },(err)=>{
        console.log(err);
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
        
      }); 


     

      }

  
  

}

 addVisitGeoloc(geoCordinates){
    console.log("geoCordinates------>",geoCordinates);
    let insertData1 = {};
    insertData1['rds_id']=this.rdsData['server_rds_id'];
    insertData1['visit_date']=Date.now();
    if( this.additionalComments != undefined && this.additionalComments != '' ){
    insertData1['additional_comments'] = this.additionalComments.trim();
    }
    insertData1['latitude']=(geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
    insertData1['longitude']= (geoCordinates['coords'])?geoCordinates['coords'].longitude:"";   
    insertData1['local_created_date']=Date.now(); 
    insertData1['local_updated_date']=Date.now();
    insertData1['assigned_to']=this.userId;
    insertData1['generated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;
    insertData1['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;   
    insertData1['created_by']=this.userId;                                                       
    insertData1['status']=1;
    insertData1['sync_status']=0;

      //INSERT NEW RETAILER/DISTRIBUTOR VISIT DATA
    this.busy=  this.sqlS.insertData(insertData1,"rds_visit").then((visitData) => {
      this.events.publish('globalSync');    
        // this.appCom.showToast(ALL_MESSAGE.SUCCESS_MESSAGE.VISIT_ADD_SUCCESS,"middle");
        // this.navCtrl.push(HpbListPage);
        let visitid ;
                                                   
        visitid=( visitData['insertId'] );                
                                                  
            for( let i=0; i<this.currStockDetailArr.length;i++ ){
                      
                let insertData = {};
                insertData['rds_visit_id']=visitid;
                insertData['stock_selling_price']=this.currStockDetailArr[i]['StockSellingPrice'];
                insertData['stock_promo']=this.currStockDetailArr[i]['StockPromo'];
                insertData['stock_quantity']=this.currStockDetailArr[i]['StockQuantity'];
                insertData['stock_unit']=this.currStockDetailArr[i]['StockUnit'];

                insertData['product_brand_id']=this.currStockDetailArr[i]['BrandName'];
                insertData['local_created_date']=Date.now(); 
                insertData['local_updated_date']=Date.now(); 
                insertData['sync_status']=0;

                //INSERT NEW STOCK DATA   
             this.busy= this.sqlS.insertData(insertData,"retailer_curent_stock").then((stockData) => {
                   console.log("i----------->",i);    
                   this.events.publish('globalSync'); 
                   this.events.publish('rdsVisitListRefresh');
                    if( i == this.currStockDetailArr.length-1 ){
                        //this.appCom.showToast(ALL_MESSAGE.SUCCESS_MESSAGE.VISIT_ADD_SUCCESS,"middle");
                        this.globalCheckInData['visitCheckFlag'] = true;
                        this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                          //this.setElement();
                        });
                        this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.VISIT_ADD_SUCCESS,"Ok","");   
                                                                                      
                        let currView = this.navCtrl.getActive();
                        let index = this.navCtrl.indexOf(currView);
                        this.navCtrl.pop();

                    }
                }, (error) => {
                    
                    console.log('Error', error);
                
                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.VISIT_ADD_ERR,"Ok","");   
                });
            }
          
          
        

      }, (error) => {
          console.log('Error', error);
         
          this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.VISIT_ADD_ERR,"Ok","");
      }); 
 }
 
 trackByIndex(index: number, obj: any): any {
    return index;
  }


  allowOnlyAlphabets(str){
    var regex = /^[a-zA-Z ]*$/;
    return regex.test(str);
  } 

  allowOnlyNumbers(str){
     var regex = /^[0-9]+$/;  
     return regex.test(str) && (parseInt(str)>0)  ;
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }



}
