/* tslint:disable */

declare var Object: any;
export interface App_notification_centerInterface {
  "ntc_id"?: number;
  "ntc_app_name"?: string;
  "ntc_type"?: string;
  "ntc_type_id"?: number;
  "ntc_type_data"?: string;
  "ntc_from_user_id"?: number;
  "ntc_from_user_data"?: string;
  "ntc_to_user_id"?: number;
  "ntc_to_user_data"?: string;
  "ntc_user_read_flag"?: number;
  "created_date"?: number;
  "updated_date"?: number;
  "status"?: number;
}

export class App_notification_center implements App_notification_centerInterface {
  "ntc_id": number;
  "ntc_app_name": string;
  "ntc_type": string;
  "ntc_type_id": number;
  "ntc_type_data": string;
  "ntc_from_user_id": number;
  "ntc_from_user_data": string;
  "ntc_to_user_id": number;
  "ntc_to_user_data": string;
  "ntc_user_read_flag": number;
  "created_date": number;
  "updated_date": number;
  "status": number;
  constructor(data?: App_notification_centerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_notification_center`.
   */
  public static getModelName() {
    return "App_notification_center";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_notification_center for dynamic purposes.
  **/
  public static factory(data: App_notification_centerInterface): App_notification_center{
    return new App_notification_center(data);
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
      name: 'App_notification_center',
      plural: 'App_notification_centers',
      path: 'App_notification_centers',
      idName: 'ntc_id',
      properties: {
        "ntc_id": {
          name: 'ntc_id',
          type: 'number'
        },
        "ntc_app_name": {
          name: 'ntc_app_name',
          type: 'string'
        },
        "ntc_type": {
          name: 'ntc_type',
          type: 'string'
        },
        "ntc_type_id": {
          name: 'ntc_type_id',
          type: 'number'
        },
        "ntc_type_data": {
          name: 'ntc_type_data',
          type: 'string'
        },
        "ntc_from_user_id": {
          name: 'ntc_from_user_id',
          type: 'number'
        },
        "ntc_from_user_data": {
          name: 'ntc_from_user_data',
          type: 'string'
        },
        "ntc_to_user_id": {
          name: 'ntc_to_user_id',
          type: 'number'
        },
        "ntc_to_user_data": {
          name: 'ntc_to_user_data',
          type: 'string'
        },
        "ntc_user_read_flag": {
          name: 'ntc_user_read_flag',
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
        "status": {
          name: 'status',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
