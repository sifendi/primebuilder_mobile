/* tslint:disable */

declare var Object: any;
export interface App_rdsInterface {
  "id"?: number;
  "holcim_id"?: number;
  "rds_name"?: string;
  "rds_mobile"?: string;
  "rds_phone"?: string;
  "rds_email"?: string;
  "rds_gender"?: string;
  "rds_type"?: string;
  "rds_address"?: string;
  "rds_province"?: string;
  "rds_city"?: string;
  "rds_sub_district"?: string;
  "rds_postalcode"?: number;
  "rds_status"?: number;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
}

export class App_rds implements App_rdsInterface {
  "id": number;
  "holcim_id": number;
  "rds_name": string;
  "rds_mobile": string;
  "rds_phone": string;
  "rds_email": string;
  "rds_gender": string;
  "rds_type": string;
  "rds_address": string;
  "rds_province": string;
  "rds_city": string;
  "rds_sub_district": string;
  "rds_postalcode": number;
  "rds_status": number;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  constructor(data?: App_rdsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_rds`.
   */
  public static getModelName() {
    return "App_rds";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_rds for dynamic purposes.
  **/
  public static factory(data: App_rdsInterface): App_rds{
    return new App_rds(data);
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
      name: 'App_rds',
      plural: 'app_rds',
      path: 'app_rds',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "holcim_id": {
          name: 'holcim_id',
          type: 'number'
        },
        "rds_name": {
          name: 'rds_name',
          type: 'string'
        },
        "rds_mobile": {
          name: 'rds_mobile',
          type: 'string'
        },
        "rds_phone": {
          name: 'rds_phone',
          type: 'string'
        },
        "rds_email": {
          name: 'rds_email',
          type: 'string'
        },
        "rds_gender": {
          name: 'rds_gender',
          type: 'string'
        },
        "rds_type": {
          name: 'rds_type',
          type: 'string'
        },
        "rds_address": {
          name: 'rds_address',
          type: 'string'
        },
        "rds_province": {
          name: 'rds_province',
          type: 'string'
        },
        "rds_city": {
          name: 'rds_city',
          type: 'string'
        },
        "rds_sub_district": {
          name: 'rds_sub_district',
          type: 'string'
        },
        "rds_postalcode": {
          name: 'rds_postalcode',
          type: 'number'
        },
        "rds_status": {
          name: 'rds_status',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "updated_by": {
          name: 'updated_by',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
