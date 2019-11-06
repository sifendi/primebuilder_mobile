/* tslint:disable */

declare var Object: any;
export interface App_projectsInterface {
  "hpb_id"?: number;
  "project_name": string;
  "project_completion_date"?: number;
  "project_quantity_estimation"?: number;
  "project_type"?: number;
  "project_stage"?: number;
  "project_address"?: string;
  "project_province"?: string;
  "project_city"?: string;
  "project_sub_district"?: string;
  "project_pincode"?: number;
  "is_srku": number;
  "srku_owner_name"?: string;
  "srku_owner_address"?: string;
  "srku_owner_mobile_no"?: string;
  "srku_province"?: string;
  "srku_city"?: string;
  "srku_sub_district"?: string;
  "srku_pincode"?: number;
  "floor_size"?: string;
  "number_of_units"?: number;
  "is_micro_credit"?: number;
  "bank_name"?: string;
  "non_micro_credit_type"?: number;
  "additional_comments"?: string;
  "latitude"?: string;
  "longitude"?: string;
  "created_date"?: number;
  "created_by"?: number;
  "generated_by"?: number;
  "project_id"?: number;
}

export class App_projects implements App_projectsInterface {
  "hpb_id": number;
  "project_name": string;
  "project_completion_date": number;
  "project_quantity_estimation": number;
  "project_type": number;
  "project_stage": number;
  "project_address": string;
  "project_province": string;
  "project_city": string;
  "project_sub_district": string;
  "project_pincode": number;
  "is_srku": number;
  "srku_owner_name": string;
  "srku_owner_address": string;
  "srku_owner_mobile_no": string;
  "srku_province": string;
  "srku_city": string;
  "srku_sub_district": string;
  "srku_pincode": number;
  "floor_size": string;
  "number_of_units": number;
  "is_micro_credit": number;
  "bank_name": string;
  "non_micro_credit_type": number;
  "additional_comments": string;
  "latitude": string;
  "longitude": string;
  "created_date": number;
  "created_by": number;
  "generated_by": number;
  "project_id": number;
  constructor(data?: App_projectsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_projects`.
   */
  public static getModelName() {
    return "App_projects";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_projects for dynamic purposes.
  **/
  public static factory(data: App_projectsInterface): App_projects{
    return new App_projects(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'App_projects',
      plural: 'app_projects',
      path: 'app_projects',
      idName: 'project_id',
      properties: {
        "hpb_id": {
          name: 'hpb_id',
          type: 'number'
        },
        "project_name": {
          name: 'project_name',
          type: 'string'
        },
        "project_completion_date": {
          name: 'project_completion_date',
          type: 'number'
        },
        "project_quantity_estimation": {
          name: 'project_quantity_estimation',
          type: 'number'
        },
        "project_type": {
          name: 'project_type',
          type: 'number'
        },
        "project_stage": {
          name: 'project_stage',
          type: 'number'
        },
        "project_address": {
          name: 'project_address',
          type: 'string'
        },
        "project_province": {
          name: 'project_province',
          type: 'string'
        },
        "project_city": {
          name: 'project_city',
          type: 'string'
        },
        "project_sub_district": {
          name: 'project_sub_district',
          type: 'string'
        },
        "project_pincode": {
          name: 'project_pincode',
          type: 'number'
        },
        "is_srku": {
          name: 'is_srku',
          type: 'number'
        },
        "srku_owner_name": {
          name: 'srku_owner_name',
          type: 'string'
        },
        "srku_owner_address": {
          name: 'srku_owner_address',
          type: 'string'
        },
        "srku_owner_mobile_no": {
          name: 'srku_owner_mobile_no',
          type: 'string'
        },
        "srku_province": {
          name: 'srku_province',
          type: 'string'
        },
        "srku_city": {
          name: 'srku_city',
          type: 'string'
        },
        "srku_sub_district": {
          name: 'srku_sub_district',
          type: 'string'
        },
        "srku_pincode": {
          name: 'srku_pincode',
          type: 'number'
        },
        "floor_size": {
          name: 'floor_size',
          type: 'string'
        },
        "number_of_units": {
          name: 'number_of_units',
          type: 'number'
        },
        "is_micro_credit": {
          name: 'is_micro_credit',
          type: 'number'
        },
        "bank_name": {
          name: 'bank_name',
          type: 'string'
        },
        "non_micro_credit_type": {
          name: 'non_micro_credit_type',
          type: 'number'
        },
        "additional_comments": {
          name: 'additional_comments',
          type: 'string'
        },
        "latitude": {
          name: 'latitude',
          type: 'string'
        },
        "longitude": {
          name: 'longitude',
          type: 'string'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "generated_by": {
          name: 'generated_by',
          type: 'number'
        },
        "project_id": {
          name: 'project_id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
