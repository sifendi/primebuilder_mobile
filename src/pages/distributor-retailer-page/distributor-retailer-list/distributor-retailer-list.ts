import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, Events, ModalController } from 'ionic-angular';
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { DistributorRetailerDetailPage } from "../distributor-retailer-detail-page/distributor-retailer-detail-page";
import { AddVisitFormPage } from "../../visit-pages/visit-add-form/visit-add-form";
import { ALL_MESSAGE } from "../../../providers/constant";
import { CallNumber } from '@ionic-native/call-number';
import { DistributorRetailerVisitSearchPage } from "../../distributor-retailer-visit/distributor-retailer-visit-search/distributor-retailer-visit-search";

declare var cordova,sessionUserGlobalData;

@Component({
  selector: 'distributor-retailer-list',
  templateUrl: 'distributor-retailer-list.html',
})
export class DistributorRetailerListPage {
 
    rdsData:any=[];
    rdsDataTemp:any=[];
    rdsDataTempF:any=[];
    filterby:any="";
    insertId:any;
    check:any=false;
    busy:  any;
    busyMessage:any="Please Wait...";  
    userId:any;
    showEmptyFlag:any=false;
    limit:any=5;
    offset:any=0;
    dataLoadCompleted : any = false;
    dataLen: any;
    searchTxt:any = null;
   
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
           
        }
    };

  rdsFilterArr:any={
     city:null,
     type:null,
  }



  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public alertCtrl:AlertController,public callNumber: CallNumber,public platform: Platform,public events:Events,public modalCtrl:ModalController) {
      
        this.userId=sessionUserGlobalData.userId;
  }


  loadData(){
       return new Promise((resolve,reject)=>{
                let checkInOutFlag=this.globalCheckInData['checkinFlag'] == true && this.globalCheckInData['checkinDetails']['check_in_out_type_id']>0 &&  (this.globalCheckInData['checkinDetails']['check_in_out_type'] == 'retailer' || this.globalCheckInData['checkinDetails']['check_in_out_type'] == 'distributor');
                console.log('this.searchTxt ----',this.searchTxt);
                let orderByQueryApp=" ORDER BY  rds_name ";
                if(checkInOutFlag){
                    orderByQueryApp=" ORDER BY CASE WHEN server_rds_id ="+this.globalCheckInData['checkinDetails']['check_in_out_type_id']+" THEN 1 ELSE 2 END, rds_name ";
                }
                
                let query="SELECT * from retailer_distributor_master";
                query+=orderByQueryApp;
                query+=" limit "+this.limit+" OFFSET "+this.offset ;
               
                if(this.searchTxt){
                    query="SELECT * from retailer_distributor_master"
                    query+=" where rds_name LIKE '%"+this.searchTxt+"%' ";
                    query+=orderByQueryApp;
                    query+=" limit "+this.limit+" OFFSET "+this.offset;
                }
        
                if( this.rdsFilterArr){
                    if( this.rdsFilterArr['city'] ){
                        
                       query="SELECT * FROM retailer_distributor_master, json_tree(retailer_distributor_master.rds_city) ";
                       query+=" where json_tree.key = 'name' and json_tree.value IN ('"+this.rdsFilterArr['city']+"') ";
                       query+=orderByQueryApp;
                       query+=" limit "+this.limit+" OFFSET "+this.offset ;
                       if(this.searchTxt){
                            query="SELECT * FROM retailer_distributor_master, json_tree(retailer_distributor_master.rds_city) ";
                            query+=" where rds_name LIKE '%"+this.searchTxt+"%' and json_tree.key = 'name' and json_tree.value IN ('"+this.rdsFilterArr['city']+"') ";
                            query+=orderByQueryApp;
                            query+=" limit "+this.limit+" OFFSET "+this.offset ;
                       }
                    }
                    if( this.rdsFilterArr['type'] ){
                        query="SELECT * from retailer_distributor_master ";
                        query+=" where rds_type = '"+this.rdsFilterArr['type']+"' ";
                        query+=orderByQueryApp;
                        query+=" limit "+this.limit+" OFFSET "+this.offset ; 
                        if(this.searchTxt){
                            query="SELECT * from retailer_distributor_master";
                            query+=" where rds_name LIKE '%"+this.searchTxt+"%' and rds_type = '"+this.rdsFilterArr['type']+"' "
                            query+=orderByQueryApp;
                            query+=" limit "+this.limit+" OFFSET "+this.offset ; 
                        }
                    }

                    if( this.rdsFilterArr['type'] && this.rdsFilterArr['city'] ){
                        query="SELECT * from retailer_distributor_master , json_tree(retailer_distributor_master.rds_city) "
                        query+=" where rds_type = '"+this.rdsFilterArr['type']+"'";
                        query+=" and json_tree.key = 'name' and json_tree.value IN ('"+this.rdsFilterArr['city']+"') ";
                      //  and  rds_city_name = '"+this.rdsFilterArr['city']+"' ";
                        query+=orderByQueryApp;
                        query+=" limit "+this.limit+" OFFSET "+this.offset ; 
                        
                        if(this.searchTxt){
                            query="SELECT * from retailer_distributor_master ";
                            query+=" where rds_name LIKE '%"+this.searchTxt+"%' and rds_type = '"+this.rdsFilterArr['type']+"' and  rds_city_name = '"+this.rdsFilterArr['city']+"' ";
                            query+=orderByQueryApp;
                            query+=" limit "+this.limit+" OFFSET "+this.offset ; 
                        }
                    }
                }

                
                console.log("query--------------------------;;",query);
                this.busy=this.sqlS.queryExecuteSql(query,[]).then((data:any)=>{
                this.dataLen= data.rows.length;
                this.offset=this.offset+this.limit;
                    if(data.rows.length>0){
                        for(let i=0;i<data['rows'].length;i++){       
                            this.rdsData.push( data['rows'].item(i) );  
                        }
                    }

                    if(this.rdsData){
                        for(let j=0;j<this.rdsData.length;j++){
                        if(this.rdsData[j]['rds_city']){
                            let temp=[];
                            temp = JSON.parse(this.rdsData[j]['rds_city']);
                            let p=0;
                            let tempstr="";
                                temp.forEach(element => {
                                    if( p>0 ){
                                        tempstr+=","+ element['name'];
                                    }else{
                                        tempstr+=element['name'];
                                    }
                                    element['name']
                                    p++;
                                });
                                this.rdsData[j]['city_display_str']=tempstr;
                        }

                            if(this.rdsData[j]['rds_province']){
                            let temp=[];
                            temp = JSON.parse(this.rdsData[j]['rds_province']);
                            let p=0;
                            let tempstr="";
                                temp.forEach(element => {
                                    if( p>0 ){
                                        tempstr+=","+ element['name'];
                                    }else{
                                        tempstr+=element['name'];
                                    }
                                    element['name']
                                    p++;
                                });
                                this.rdsData[j]['province_display_str']=tempstr;
                        }

                            if(this.rdsData[j]['rds_sub_district']){
                            let temp=[];
                            temp = JSON.parse(this.rdsData[j]['rds_sub_district']);
                            let p=0;
                            let tempstr="";
                                temp.forEach(element => {
                                    if( p>0 ){
                                        tempstr+=","+ element['name'];
                                    }else{
                                        tempstr+=element['name'];
                                    }
                                    element['name']
                                    p++;
                                });
                            this.rdsData[j]['sub_district_display_str']=tempstr;
                        }

                        if(this.rdsData[j]['rds_postalcode']){
                            let temp=[];
                            temp = JSON.parse(this.rdsData[j]['rds_postalcode']);
                            let p=0;
                            let tempstr="";
                                temp.forEach(element => {
                                    if( p>0 ){
                                        tempstr+=","+ element['name'];
                                    }else{
                                        tempstr+=element['name'];
                                    }
                                    element['name']
                                    p++;
                                });
                            this.rdsData[j]['postal_code_display_str']=tempstr;
                        }


                        
                        } 
                    
                        if( this.rdsData.length == 0 ){
                            this.showEmptyFlag=true;
                        }else{
                            this.showEmptyFlag=false;
                        }

                    }
                    console.log("rdsData",this.rdsData);
                    this.rdsDataTemp= this.rdsData;

                    resolve();
                },(error)=>{
                    console.log('error queryRDS initFormData',error);
                    reject();
                });

       });
  }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            if(this.dataLen < this.limit){
                this.dataLoadCompleted = true;
            }else{
                this.loadData();
            }
            infiniteScroll.complete();
        }, 500);
    }

  async ionViewDidEnter(){

    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");      

        this.limit=5;
        this.offset=0;
    
        this.check=false;    
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
            this.globalCheckInData = checkinObj;
            //console.log("this.globalCheckInData",this.globalCheckInData);
            this.rdsData=[];
            this.loadData();
        });
   
       
  }

    makephonecall(rds){
      let mobno =  rds['rds_mobile'] ? rds['rds_mobile'] : rds['rds_phone'] ? rds['rds_phone'] :"";
      if( mobno !=undefined && mobno !='' ){
             this.callNumber.callNumber(mobno, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer')); 
      }     
	}


  goToRdsDetail(rds){
      this.navCtrl.push(DistributorRetailerDetailPage,{
         "rdsData":rds
      });
  }

  goToVisitAdd(rds){
      this.navCtrl.push(AddVisitFormPage,{
         "rdsData":rds
      });   
  }
 
  alreadyCheckInAlert(){
      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ALREADY_CHECKED_IN,"Close","");
  }

    //SEARCH RET DIST
/*    searchDRList(ev){
    console.log("ev",ev);
        this.rdsData=this.rdsDataTemp;
        if(ev.target.value != undefined && ev.target.value != '' ){
                let val = ev.target.value;
                  console.log("val",val);
                  if (val && val.trim() != '') {
                          this.rdsData = this.rdsData.filter((item) => {
                          console.log("----->",(item['rds_name'].toLowerCase().indexOf(val.toLowerCase()) > -1));
                          return (item['rds_name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
                      });
                  }
        }else{
            this.offset=0;
            this.limit=5;
            this.rdsData=[];
            this.loadData();
        }

    }
*/
    searchDRList(ev){
        console.log("ev",ev);  
        if(ev.target.value != undefined && ev.target.value != '' ){
            let val = ev.target.value;
            console.log("val",val);
            if (val && val.trim() != '') {
                this.searchTxt = val;
                this.offset=0;
                this.limit=5;
                this.rdsData=[];
                this.loadData();
            }
        }else{
            this.offset=0;
            this.limit=5;
            this.rdsData=[];
            this.searchTxt = null;
            this.loadData();
        }
    }
        

  openRetDistFilter(){

        let filterPageD = this.modalCtrl.create(DistributorRetailerVisitSearchPage,{rdsFilterArr:this.rdsFilterArr});
        filterPageD.onDidDismiss((fDataRes:any)=>{
             console.log("fDataRes-->",fDataRes);
             if(fDataRes){
                if(fDataRes['filterby']){
                    this.filterby = fDataRes['filterby'];
                    this.rdsDataTempF = fDataRes['visitFilteredData'];
                    this.rdsFilterArr = fDataRes['filterData'];
                    //this.rdsData=this.rdsDataTempF;
                    this.rdsData=[];
                    this.offset=0;
                    this.loadData();
                    }
                }
        });
        filterPageD.present();



  }

  clearFilter(){
    this.filterby="";
    this.offset=0;
    this.rdsData=[];
    this.rdsDataTempF=[];
    this. rdsFilterArr={
     city:null,
     type:null,
    } 
    this.loadData();
}

async permissionCheckinpop(details,rds){
    
        let titleYes = await this.appCom.getTranslatedTxt("Yes");
        let titleNo = await this.appCom.getTranslatedTxt("No");
        let title = await this.appCom.getTranslatedTxt("Are you sure you want to check in ?");
    
        let alert = this.alertCtrl.create({
            cssClass: 'confirm',
            title: title,
            enableBackdropDismiss:false,
            buttons: [
            {
                text: titleYes,
                handler: () => {
                console.log('Buy clicked');
                 this.check = false
                //do  checkin                                                                                              
                        this.sqlS.insertData(details,"check_in_out").then((data) => {
                                this.check = false 
                                this.events.publish('globalSync');
                                this.navCtrl.push(DistributorRetailerDetailPage,{
                                    "rdsData":rds,
                                    "tab":"visit"
                                });
                            
                                this.globalCheckInData = {
                                    checkinFlag:true,
                                    checkinType:"rds",
                                    insertId:data['insertId'],
                                    checkinDetails:details
                                }   
                                this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                                 this.check = false
                                //this.setElement();
                                });
                                
                                this.appCom.updateRetailerDistStats('retailer');
                                this.appCom.updateRetailerDistStats('distributor');
                                
                        }, (error) => {
                                 this.check = false
                                console.log('Error', error);
                        });    


                }
            },{
                text: titleNo,
                handler: () => {
                console.log('Cancel clicked');
                //do not checkin    
                 this.check = false
                }
            }]
        });
        alert.present(); 
      }
    
      async permissionCheckoutpop(geoCordinates){
    
        let titleYes = await this.appCom.getTranslatedTxt("Yes");
        let titleNo = await this.appCom.getTranslatedTxt("No");
        let title = await this.appCom.getTranslatedTxt("Are you sure you want to Check Out ?");     
        let titlePlaceHold = await this.appCom.getTranslatedTxt("Comment here");
    
        console.log("geoCordinates------>",geoCordinates);   
        
        if( this.globalCheckInData['visitCheckFlag']  ==true ){
            let alert = this.alertCtrl.create({
                cssClass: 'confirm',
                title: title,
                enableBackdropDismiss:false,
                buttons: [
                {
                    text: titleYes,
                    handler: () => {
                        this.check = false    
                    console.log('Buy clicked');


                                    let  details= {
                                        
                                        check_out_latitude:(geoCordinates['coords'])?geoCordinates['coords'].latitude:"",
                                        check_out_longitude:(geoCordinates['coords'])?geoCordinates['coords'].longitude:"",
                                        check_out_datetime:new Date().getTime(),
                                        local_updated_date:new Date().getTime(),
                                        sync_status:0
                                        
                                    }
                                    
                                        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
                                            this.globalCheckInData = checkinObj;
                                            console.log("this.globalCheckInData",this.globalCheckInData);                                                                                                                                                                                                                                                                                                                                            
                                            let whereCond =" `check_in_out_id` = "+this.globalCheckInData['insertId']; 
                                                console.log("whwere cond",whereCond);
                                                this.sqlS.updateData(details,"check_in_out",whereCond).then((data) => {
                                                        this.events.publish('globalSync');
                                                        console.log("data  checkout------>",data);
                                                        
                                                        //EMPTY GLOBAL DATA AFTER CHECK OUT
                                                            this.check = false
                                                        this.globalCheckInData={
                                                            checkinFlag:false,
                                                            visitCheckFlag:false,
                                                            checkinType:"",
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
                                                                generated_by:null
                                                            }
                                                        };    
                                                        this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                                                            this.check = false
                                                        //this.setElement();
                                                        });
                                                        
                                        }, (error) => {
                                                    this.check = false
                                                console.log('Error', error);
                                                //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
                                                //this.appCom.showAlert("",ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
                                        });

                                    });
                    }
                },
                                                                    {
                    text: titleNo,
                    handler: () => {
                    console.log('Cancel clicked');
                        this.check = false
                    }
                }
                ]
            });
            alert.present();    
        }else{

            let alert = this.alertCtrl.create({
                cssClass: 'confirm',
                title: title,
                enableBackdropDismiss:false,
                inputs: [
                {
                    name: 'comment',
                    placeholder: 'Comment here',
                }
                ],
                buttons: [
                {
                    text: titleYes,
                        handler: (data) => {
                        console.log('Buy clicked');
                        console.log("data",data);
                        var c = "";
                        c=data['comment'].trim();
                        if( c != undefined &&  c != "" ){
                            this.check = false    
                        let  details= {
                                        
                                        check_out_latitude:(geoCordinates['coords'])?geoCordinates['coords'].latitude:"",
                                        check_out_longitude:(geoCordinates['coords'])?geoCordinates['coords'].longitude:"",
                                        check_out_datetime:new Date().getTime(),
                                        local_updated_date:new Date().getTime(),
                                        sync_status:0
                                        
                                    }
                                        details['check_in_out_comment']=c;
                                        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
                                            this.globalCheckInData = checkinObj;
                                            console.log("this.globalCheckInData",this.globalCheckInData);                                                                                                                                                                                                                                                                                                                                            
                                            let whereCond =" `check_in_out_id` = "+this.globalCheckInData['insertId']; 
                                                console.log("whwere cond",whereCond);
                                                this.sqlS.updateData(details,"check_in_out",whereCond).then((data) => {
                                                    this.events.publish('globalSync');     
                                                    console.log("data  checkout------>",data);
                                                            this.check = false
                                                        //EMPTY GLOBAL DATA AFTER CHECK OUT
                                                    
                                                        this.globalCheckInData={
                                                            checkinFlag:false,
                                                            checkinType:"",
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
                                                                generated_by:null
                                                            }
                                                        };    
                                                        this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                                                            this.check = false
                                                        //this.setElement();
                                                        });
                                                        
                                        }, (error) => {
                                                this.check = false
                                                console.log('Error', error);
                                                //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
                                                //this.appCom.showAlert("",ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
                                        });

                                    });                                                                 
                                                    
                                                    
                        }else{
                                this.check = false
                            this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.RDS_VISIT_NOT_FILLED,"middle");
                            return false;   
                        }
                    }
                },
                                                                    {
                    text: titleNo,
                    handler: () => {
                        this.check = false
                    console.log('Cancel clicked');
                    }
                }
                ]
            });
            alert.present();

        }
    }
  
  checkIn(rds){

    if( this.check == false ){
    this.check = false;      

  //get the geo co-ordinates
        this.appCom.isGpsLocationEnabledC((successCallback)=>{			
        if(successCallback)	{
                    this.appCom.getLocationModeC((res) => {
                    console.log("res",res);
                    let type = rds['rds_type'];
                    let id =   rds['server_rds_id'];                                      
                    let  details= {
                                    //check_in_out_user_id:null,
                                    check_in_out_type: type,
                                    check_in_out_type_id:id,
                                    assigned_to:this.userId,
                                    generated_by:this.userId,
                                    check_in_out_user_id:this.userId
                        }

                        //if(res == 'high_accuracy'){                                        
                            this.busy=  this.appCom.getGeoLocationCordinates("checkIn").then((geoCordinates)=>{
                                        console.log("geoCordinates------>",geoCordinates);   
                                        details['check_in_latitude'] = (geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
                                        details['check_in_longitude'] = (geoCordinates['coords'])?geoCordinates['coords'].longitude:"";
                                        details['check_in_datetime'] = new Date().getTime();
                                        details['local_created_date'] = new Date().getTime();
                                        console.log("details =>",details);    
                                                            
                                        this.permissionCheckinpop(details,rds);

                            },(error)=>{
                                this.check = false
                                console.log(error);
                                //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");                                       
                                details['check_in_latitude'] = '';
                                details['check_in_longitude'] = '';
                                details['check_in_datetime'] = new Date().getTime();
                                details['local_created_date'] = new Date().getTime();
                                console.log("details =>",details);
                                
                                this.permissionCheckinpop(details,rds);
                            });        
                        // }else{
                        //     this.busy=  this.appCom.getGeoLocationCordinates("checkIn").then((geoCordinates)=>{
                        //         console.log("geoCordinates------>",geoCordinates);   
                        //         details['check_in_latitude'] = (geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
                        //         details['check_in_longitude'] = (geoCordinates['coords'])?geoCordinates['coords'].longitude:"";
                        //         details['check_in_datetime'] = new Date().getTime();
                        //         details['local_created_date'] = new Date().getTime();
                        //         console.log("details =>",details);    
                                                    
                        //         this.permissionCheckinpop(details,rds);

                        //     },(error)=>{
                        //         this.check = false
                        //         console.log(error);
                        //         //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");                                       
                        //         details['check_in_latitude'] = '';
                        //         details['check_in_longitude'] = '';
                        //         details['check_in_datetime'] = new Date().getTime();
                        //         details['local_created_date'] = new Date().getTime();
                        //         console.log("details =>",details);
                                
                        //         this.permissionCheckinpop(details,rds);
                        //     });
                        //     //show pop up for set high accuracy..
                        //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");                                
                        // }
                },(err)=>{
                     this.check = false
                    console.log(err);
                });
        }else{
            //show alert enable gps
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
             this.check = false
        }	

    },(err)=>{
        console.log(err);
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
         this.check = false
    });

    }else{

    }



  }



  goToFilterPage(){
       this.navCtrl.push(DistributorRetailerVisitSearchPage);
   }




//   searchDRList(eventVal){
//       console.log('value ',eventVal);
//     if (typeof eventVal.target.value != 'undefined' && eventVal.target.value.length != 0) {
//         this.sqlS.search_d_r_list( eventVal.target.value).then((searchRes)=>{
//             console.log('this.searchRes ',searchRes);
//             this.rdsData = [];
//             for (let i = 0; i < searchRes['rows'].length; i++) {
//                 this.rdsData.push( searchRes['rows'].item(i) );     
//             }
//             console.log('this.rdsData ',this.rdsData);
//         },(error)=>{
//             console.log("error",error);
//         });

//     }else{
//         this.rdsData = this.rdsDataTemp;
//         console.log("this.projData",this.rdsData);
//     }
//   }




  checkOut(rds){

    if( this.check == false ){
    this.check = false;
            //get the geo co-ordinates
            this.appCom.isGpsLocationEnabledC((successCallback)=>{			
            if(successCallback)	{
                    this.appCom.getLocationModeC((res) => {
                        console.log("res",res);
                            //if(res == 'high_accuracy'){                            
                                this.busy=  this.appCom.getGeoLocationCordinates("checkOut").then((geoCordinates)=>{
                                                
                                    this.permissionCheckoutpop(geoCordinates);
                                                                                                                                                                                            
                                },(error)=>{
                                    this.check = false
                                    console.log(error);
                                   // this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                   this.permissionCheckoutpop('');
                                });
                            
                            // }else{
                            //     this.check = false;
                            //     //show pop up for set high accuracy..
                            //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                            //     this.permissionCheckoutpop('');
                            // }
                    },(err)=>{
                         this.check = false;
                        console.log(err);
                    });
            }else{
                 this.check = false;
                //show alert enable gps
                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
                
            }	

        },(err)=>{
             this.check = false;
            console.log(err);
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
            
        });

    }else{

    }    


  }

  





}
