/* tslint:disable */

declare var Object: any;
export interface App_check_in_outInterface {
  "check_in_out_id"?: number;
  "check_in_out_user_id"?: number;
  "check_in_out_type"?: string;
  "check_in_out_type_id"?: number;
  "check_in_latitude"?: string;
  "check_in_longitude"?: string;
  "check_out_latitude"?: string;
  "check_out_longitude"?: string;
  "check_in_datetime"?: number;
  "check_out_datetime"?: number;
  "generated_by"?: number;
  "assigned_to"?: number;
  "check_in_out_comment"?: string;
  "status"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
}

export class App_check_in_out implements App_check_in_outInterface {
  "check_in_out_id": number;
  "check_in_out_user_id": number;
  "check_in_out_type": string;
  "check_in_out_type_id": number;
  "check_in_latitude": string;
  "check_in_longitude": string;
  "check_out_latitude": string;
  "check_out_longitude": string;
  "check_in_datetime": number;
  "check_out_datetime": number;
  "generated_by": number;
  "assigned_to": number;
  "check_in_out_comment": string;
  "status": number;
  "local_created_date": number;
  "local_updated_date": number;
  constructor(data?: App_check_in_outInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_check_in_out`.
   */
  public static getModelName() {
    return "App_check_in_out";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_check_in_out for dynamic purposes.
  **/
  public static factory(data: App_check_in_outInterface): App_check_in_out{
    return new App_check_in_out(data);
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
      name: 'App_check_in_out',
      plural: 'app_check_in_out',
      path: 'app_check_in_out',
      idName: 'check_in_out_id',
      properties: {
        "check_in_out_id": {
          name: 'check_in_out_id',
          type: 'number'
        },
        "check_in_out_user_id": {
          name: 'check_in_out_user_id',
          type: 'number'
        },
        "check_in_out_type": {
          name: 'check_in_out_type',
          type: 'string'
        },
        "check_in_out_type_id": {
          name: 'check_in_out_type_id',
          type: 'number'
        },
        "check_in_latitude": {
          name: 'check_in_latitude',
          type: 'string'
        },
        "check_in_longitude": {
          name: 'check_in_longitude',
          type: 'string'
        },
        "check_out_latitude": {
          name: 'check_out_latitude',
          type: 'string'
        },
        "check_out_longitude": {
          name: 'check_out_longitude',
          type: 'string'
        },
        "check_in_datetime": {
          name: 'check_in_datetime',
          type: 'number'
        },
        "check_out_datetime": {
          name: 'check_out_datetime',
          type: 'number'
        },
        "generated_by": {
          name: 'generated_by',
          type: 'number'
        },
        "assigned_to": {
          name: 'assigned_to',
          type: 'number'
        },
        "check_in_out_comment": {
          name: 'check_in_out_comment',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "local_created_date": {
          name: 'local_created_date',
          type: 'number'
        },
        "local_updated_date": {
          name: 'local_updated_date',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
