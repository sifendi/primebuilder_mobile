/* tslint:disable */
/**
* @module SDKModule
* @author Jonathan Casarrubias <t:@johncasarrubias> <gh:jonathan-casarrubias>
* @license MIT 2016 Jonathan Casarrubias
* @version 2.1.0
* @description
* The SDKModule is a generated Software Development Kit automatically built by
* the LoopBack SDK Builder open source module.
*
* The SDKModule provides Angular 2 >= RC.5 support, which means that NgModules
* can import this Software Development Kit as follows:
*
*
* APP Route Module Context
* ============================================================================
* import { NgModule }       from '@angular/core';
* import { BrowserModule }  from '@angular/platform-browser';
* // App Root 
* import { AppComponent }   from './app.component';
* // Feature Modules
* import { SDK[Browser|Node|Native]Module } from './shared/sdk/sdk.module';
* // Import Routing
* import { routing }        from './app.routing';
* @NgModule({
*  imports: [
*    BrowserModule,
*    routing,
*    SDK[Browser|Node|Native]Module.forRoot()
*  ],
*  declarations: [ AppComponent ],
*  bootstrap:    [ AppComponent ]
* })
* export class AppModule { }
*
**/
import { JSONSearchParams } from './services/core/search.params';
import { ErrorHandler } from './services/core/error.service';
import { LoopBackAuth } from './services/core/auth.service';
import { LoggerService } from './services/custom/logger.service';
import { SDKModels } from './services/custom/SDKModels';
import { InternalStorage, SDKStorage } from './storage/storage.swaps';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieBrowser } from './storage/cookie.browser';
import { StorageBrowser } from './storage/storage.browser';
import { SocketBrowser } from './sockets/socket.browser';
import { SocketDriver } from './sockets/socket.driver';
import { SocketConnection } from './sockets/socket.connections';
import { RealTime } from './services/core/real.time';
import { EmailApi } from './services/custom/Email';
import { UserApi } from './services/custom/User';
import { DydApi } from './services/custom/Dyd';
import { App_hpbApi } from './services/custom/App_hpb';
import { ContainerApi } from './services/custom/Container';
import { App_loginApi } from './services/custom/App_login';
import { App_projectsApi } from './services/custom/App_projects';
import { App_rdsApi } from './services/custom/App_rds';
import { App_areaApi } from './services/custom/App_area';
import { App_rds_visitApi } from './services/custom/App_rds_visit';
import { App_productsApi } from './services/custom/App_products';
import { App_taxonomy_term_dataApi } from './services/custom/App_taxonomy_term_data';
import { App_taxonomy_vocabularyApi } from './services/custom/App_taxonomy_vocabulary';
import { App_taxonomy_metaApi } from './services/custom/App_taxonomy_meta';
import { App_check_in_outApi } from './services/custom/App_check_in_out';
import { App_rds_stockApi } from './services/custom/App_rds_stock';
import { App_product_receiptApi } from './services/custom/App_product_receipt';
import { App_product_receipt_approvalApi } from './services/custom/App_product_receipt_approval';
import { RegionApi } from './services/custom/Region';
import { ProvinceApi } from './services/custom/Province';
import { DistrictApi } from './services/custom/District';
import { MunicipalityApi } from './services/custom/Municipality';
import { SubdistrictApi } from './services/custom/Subdistrict';
import { VillageApi } from './services/custom/Village';
import { Postal_codeApi } from './services/custom/Postal_code';
import { Project_stageApi } from './services/custom/Project_stage';
import { Project_typeApi } from './services/custom/Project_type';
import { NmcApi } from './services/custom/Nmc';
import { BrandApi } from './services/custom/Brand';
import { App_usersApi } from './services/custom/App_users';
import { App_product_requestApi } from './services/custom/App_product_request';
import { RewardApi } from './services/custom/Reward';
import { WishApi } from './services/custom/Wish';
import { PromoApi } from './services/custom/Promo';
import { RewardClaimApi } from './services/custom/RewardClaim';
import { RewardPointApi } from './services/custom/RewardPoint';
import { App_srku_approvalApi } from './services/custom/App_srku_approval';
import { Monthly_actual_targetApi } from './services/custom/Monthly_actual_target';
import { Monthly_visiting_scheduleApi } from './services/custom/Monthly_visiting_schedule';
import { Monthly_forecast_targetApi } from './services/custom/Monthly_forecast_target';
import { Monthly_statsApi } from './services/custom/Monthly_stats';
import { Products_request_brand_capture_tblApi } from './services/custom/Products_request_brand_capture_tbl';
import { User_mappingApi } from './services/custom/User_mapping';
import { Cement_bag_removals_tblApi } from './services/custom/Cement_bag_removals_tbl';
import { Dr_logApi } from './services/custom/Dr_log';
import { Reward_promosApi } from './services/custom/Reward_promos';
import { Reward_categoryApi } from './services/custom/Reward_category';
import { Eap_master_directorateApi } from './services/custom/Eap_master_directorate';
import { Eap_master_departmentApi } from './services/custom/Eap_master_department';
import { Eap_master_lead_segmentApi } from './services/custom/Eap_master_lead_segment';
import { Eap_leadApi } from './services/custom/Eap_lead';
import { Eap_employee_pointsApi } from './services/custom/Eap_employee_points';
import { Eap_refer_customerApi } from './services/custom/Eap_refer_customer';
import { Eap_share_momentsApi } from './services/custom/Eap_share_moments';
import { Eap_approvalApi } from './services/custom/Eap_approval';
import { Eap_lead_invoiceApi } from './services/custom/Eap_lead_invoice';
import { Eap_support_chatApi } from './services/custom/Eap_support_chat';
import { Eap_master_social_mediaApi } from './services/custom/Eap_master_social_media';
import { User_metaApi } from './services/custom/User_meta';
import { Retrieve_created_byApi } from './services/custom/Retrieve_created_by';
import { ApplicationApi } from './services/custom/Application';
import { NotificationApi } from './services/custom/Notification';
import { PushApi } from './services/custom/Push';
import { App_notification_centerApi } from './services/custom/App_notification_center';
import { User_mapApi } from './services/custom/User_map';
import { EapRdsApi } from './services/custom/EapRds';
import { Eap_pointsApi } from './services/custom/Eap_points';
import { Eap_support_contactsApi } from './services/custom/Eap_support_contacts';
import { Eap_support_assignmentApi } from './services/custom/Eap_support_assignment';
import { Eap_master_pointsApi } from './services/custom/Eap_master_points';
import { Eap_user_update_approvalApi } from './services/custom/Eap_user_update_approval';
import { Eap_reportApi } from './services/custom/Eap_report';
import { Hpb_update_approvalApi } from './services/custom/Hpb_update_approval';
import { Gps_loginApi } from './services/custom/Gps_login';
/**
* @module SDKBrowserModule
* @description
* This module should be imported when building a Web Application in the following scenarios:
*
*  1.- Regular web application
*  2.- Angular universal application (Browser Portion)
*  3.- Progressive applications (Angular Mobile, Ionic, WebViews, etc)
**/
@NgModule({
  imports:      [ CommonModule, HttpModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [
    ErrorHandler,
    SocketConnection
  ]
})
export class SDKBrowserModule {
  static forRoot(internalStorageProvider: any = {
    provide: InternalStorage,
    useClass: CookieBrowser
  }): ModuleWithProviders {
    return {
      ngModule  : SDKBrowserModule,
      providers : [
        LoopBackAuth,
        LoggerService,
        JSONSearchParams,
        SDKModels,
        RealTime,
        EmailApi,
        UserApi,
        DydApi,
        App_hpbApi,
        ContainerApi,
        App_loginApi,
        App_projectsApi,
        App_rdsApi,
        App_areaApi,
        App_rds_visitApi,
        App_productsApi,
        App_taxonomy_term_dataApi,
        App_taxonomy_vocabularyApi,
        App_taxonomy_metaApi,
        App_check_in_outApi,
        App_rds_stockApi,
        App_product_receiptApi,
        App_product_receipt_approvalApi,
        RegionApi,
        ProvinceApi,
        DistrictApi,
        MunicipalityApi,
        SubdistrictApi,
        VillageApi,
        Postal_codeApi,
        Project_stageApi,
        Project_typeApi,
        NmcApi,
        BrandApi,
        App_usersApi,
        App_product_requestApi,
        RewardApi,
        WishApi,
        PromoApi,
        RewardClaimApi,
        RewardPointApi,
        App_srku_approvalApi,
        Monthly_actual_targetApi,
        Monthly_visiting_scheduleApi,
        Monthly_forecast_targetApi,
        Monthly_statsApi,
        Products_request_brand_capture_tblApi,
        User_mappingApi,
        Cement_bag_removals_tblApi,
        Dr_logApi,
        Reward_promosApi,
        Reward_categoryApi,
        Eap_master_directorateApi,
        Eap_master_departmentApi,
        Eap_master_lead_segmentApi,
        Eap_leadApi,
        Eap_employee_pointsApi,
        Eap_refer_customerApi,
        Eap_share_momentsApi,
        Eap_approvalApi,
        Eap_lead_invoiceApi,
        Eap_support_chatApi,
        Eap_master_social_mediaApi,
        User_metaApi,
        Retrieve_created_byApi,
        ApplicationApi,
        NotificationApi,
        PushApi,
        App_notification_centerApi,
        User_mapApi,
        EapRdsApi,
        Eap_pointsApi,
        Eap_support_contactsApi,
        Eap_support_assignmentApi,
        Eap_master_pointsApi,
        Eap_user_update_approvalApi,
        Eap_reportApi,
        Hpb_update_approvalApi,
        Gps_loginApi,
        internalStorageProvider,
        { provide: SDKStorage, useClass: StorageBrowser },
        { provide: SocketDriver, useClass: SocketBrowser }
      ]
    };
  }
}
/**
* Have Fun!!!
* - Jon
**/
export * from './models/index';
export * from './services/index';
export * from './lb.config';
export * from './storage/storage.swaps';
export { CookieBrowser } from './storage/cookie.browser';
export { StorageBrowser } from './storage/storage.browser';

