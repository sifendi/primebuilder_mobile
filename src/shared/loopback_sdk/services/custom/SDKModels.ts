/* tslint:disable */
import { Injectable } from '@angular/core';
import { Email } from '../../models/Email';
import { User } from '../../models/User';
import { Dyd } from '../../models/Dyd';
import { App_hpb } from '../../models/App_hpb';
import { Container } from '../../models/Container';
import { App_login } from '../../models/App_login';
import { App_projects } from '../../models/App_projects';
import { App_rds } from '../../models/App_rds';
import { App_area } from '../../models/App_area';
import { App_rds_visit } from '../../models/App_rds_visit';
import { App_products } from '../../models/App_products';
import { App_taxonomy_term_data } from '../../models/App_taxonomy_term_data';
import { App_taxonomy_vocabulary } from '../../models/App_taxonomy_vocabulary';
import { App_taxonomy_meta } from '../../models/App_taxonomy_meta';
import { App_check_in_out } from '../../models/App_check_in_out';
import { App_rds_stock } from '../../models/App_rds_stock';
import { App_product_receipt } from '../../models/App_product_receipt';
import { App_product_receipt_approval } from '../../models/App_product_receipt_approval';
import { Region } from '../../models/Region';
import { Province } from '../../models/Province';
import { District } from '../../models/District';
import { Municipality } from '../../models/Municipality';
import { Subdistrict } from '../../models/Subdistrict';
import { Village } from '../../models/Village';
import { Postal_code } from '../../models/Postal_code';
import { Project_stage } from '../../models/Project_stage';
import { Project_type } from '../../models/Project_type';
import { Nmc } from '../../models/Nmc';
import { Brand } from '../../models/Brand';
import { App_users } from '../../models/App_users';
import { App_product_request } from '../../models/App_product_request';
import { Reward } from '../../models/Reward';
import { Wish } from '../../models/Wish';
import { Promo } from '../../models/Promo';
import { RewardClaim } from '../../models/RewardClaim';
import { RewardPoint } from '../../models/RewardPoint';
import { App_srku_approval } from '../../models/App_srku_approval';
import { Monthly_actual_target } from '../../models/Monthly_actual_target';
import { Monthly_visiting_schedule } from '../../models/Monthly_visiting_schedule';
import { Monthly_forecast_target } from '../../models/Monthly_forecast_target';
import { Monthly_stats } from '../../models/Monthly_stats';
import { Products_request_brand_capture_tbl } from '../../models/Products_request_brand_capture_tbl';
import { User_mapping } from '../../models/User_mapping';
import { Cement_bag_removals_tbl } from '../../models/Cement_bag_removals_tbl';
import { Dr_log } from '../../models/Dr_log';
import { Reward_promos } from '../../models/Reward_promos';
import { Reward_category } from '../../models/Reward_category';
import { Eap_master_directorate } from '../../models/Eap_master_directorate';
import { Eap_master_department } from '../../models/Eap_master_department';
import { Eap_master_lead_segment } from '../../models/Eap_master_lead_segment';
import { Eap_lead } from '../../models/Eap_lead';
import { Eap_employee_points } from '../../models/Eap_employee_points';
import { Eap_refer_customer } from '../../models/Eap_refer_customer';
import { Eap_share_moments } from '../../models/Eap_share_moments';
import { Eap_approval } from '../../models/Eap_approval';
import { Eap_lead_invoice } from '../../models/Eap_lead_invoice';
import { Eap_support_chat } from '../../models/Eap_support_chat';
import { Eap_master_social_media } from '../../models/Eap_master_social_media';
import { User_meta } from '../../models/User_meta';
import { Retrieve_created_by } from '../../models/Retrieve_created_by';
import { Application } from '../../models/Application';
import { Notification } from '../../models/Notification';
import { Push } from '../../models/Push';
import { App_notification_center } from '../../models/App_notification_center';
import { User_map } from '../../models/User_map';
import { EapRds } from '../../models/EapRds';
import { Eap_points } from '../../models/Eap_points';
import { Eap_support_contacts } from '../../models/Eap_support_contacts';
import { Eap_support_assignment } from '../../models/Eap_support_assignment';
import { Eap_master_points } from '../../models/Eap_master_points';
import { Eap_user_update_approval } from '../../models/Eap_user_update_approval';
import { Eap_report } from '../../models/Eap_report';
import { Hpb_update_approval } from '../../models/Hpb_update_approval';
import { Gps_login } from '../../models/Gps_login';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    Email: Email,
    User: User,
    Dyd: Dyd,
    App_hpb: App_hpb,
    Container: Container,
    App_login: App_login,
    App_projects: App_projects,
    App_rds: App_rds,
    App_area: App_area,
    App_rds_visit: App_rds_visit,
    App_products: App_products,
    App_taxonomy_term_data: App_taxonomy_term_data,
    App_taxonomy_vocabulary: App_taxonomy_vocabulary,
    App_taxonomy_meta: App_taxonomy_meta,
    App_check_in_out: App_check_in_out,
    App_rds_stock: App_rds_stock,
    App_product_receipt: App_product_receipt,
    App_product_receipt_approval: App_product_receipt_approval,
    Region: Region,
    Province: Province,
    District: District,
    Municipality: Municipality,
    Subdistrict: Subdistrict,
    Village: Village,
    Postal_code: Postal_code,
    Project_stage: Project_stage,
    Project_type: Project_type,
    Nmc: Nmc,
    Brand: Brand,
    App_users: App_users,
    App_product_request: App_product_request,
    Reward: Reward,
    Wish: Wish,
    Promo: Promo,
    RewardClaim: RewardClaim,
    RewardPoint: RewardPoint,
    App_srku_approval: App_srku_approval,
    Monthly_actual_target: Monthly_actual_target,
    Monthly_visiting_schedule: Monthly_visiting_schedule,
    Monthly_forecast_target: Monthly_forecast_target,
    Monthly_stats: Monthly_stats,
    Products_request_brand_capture_tbl: Products_request_brand_capture_tbl,
    User_mapping: User_mapping,
    Cement_bag_removals_tbl: Cement_bag_removals_tbl,
    Dr_log: Dr_log,
    Reward_promos: Reward_promos,
    Reward_category: Reward_category,
    Eap_master_directorate: Eap_master_directorate,
    Eap_master_department: Eap_master_department,
    Eap_master_lead_segment: Eap_master_lead_segment,
    Eap_lead: Eap_lead,
    Eap_employee_points: Eap_employee_points,
    Eap_refer_customer: Eap_refer_customer,
    Eap_share_moments: Eap_share_moments,
    Eap_approval: Eap_approval,
    Eap_lead_invoice: Eap_lead_invoice,
    Eap_support_chat: Eap_support_chat,
    Eap_master_social_media: Eap_master_social_media,
    User_meta: User_meta,
    Retrieve_created_by: Retrieve_created_by,
    Application: Application,
    Notification: Notification,
    Push: Push,
    App_notification_center: App_notification_center,
    User_map: User_map,
    EapRds: EapRds,
    Eap_points: Eap_points,
    Eap_support_contacts: Eap_support_contacts,
    Eap_support_assignment: Eap_support_assignment,
    Eap_master_points: Eap_master_points,
    Eap_user_update_approval: Eap_user_update_approval,
    Eap_report: Eap_report,
    Hpb_update_approval: Hpb_update_approval,
    Gps_login: Gps_login,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
