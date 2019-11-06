/* tslint:disable */

declare var Object: any;
export interface App_product_requestInterface {
  "id"?: number;
  "request_date"?: number;
  "project_id"?: number;
  "hpb_id"?: number;
  "quantity_required"?: string;
  "rds_id"?: number;
  "pic_same_as_hpb"?: number;
  "pic_name"?: number;
  "pic_designation"?: string;
  "pic_mobile"?: string;
  "new_price_request"?: string;
  "term_of_payment"?: string;
  "product_request_status"?: string;
  "product_request_status_remark"?: string;
  "status_change_date"?: number;
  "additional_comments"?: string;
  "latitude"?: string;
  "longitude"?: string;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
  "hpb_digital_sign"?: string;
}

export class App_product_request implements App_product_requestInterface {
  "id": number;
  "request_date": number;
  "project_id": number;
  "hpb_id": number;
  "quantity_required": string;
  "rds_id": number;
  "pic_same_as_hpb": number;
  "pic_name": number;
  "pic_designation": string;
  "pic_mobile": string;
  "new_price_request": string;
  "term_of_payment": string;
  "product_request_status": string;
  "product_request_status_remark": string;
  "status_change_date": number;
  "additional_comments": string;
  "latitude": string;
  "longitude": string;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  "hpb_digital_sign": string;
  constructor(data?: App_product_requestInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_product_request`.
   */
  public static getModelName() {
    return "App_product_request";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_product_request for dynamic purposes.
  **/
  public static factory(data: App_product_requestInterface): App_product_request{
    return new App_product_request(data);
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
      name: 'App_product_request',
      plural: 'App_product_requests',
      path: 'App_product_requests',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "request_date": {
          name: 'request_date',
          type: 'number'
        },
        "project_id": {
          name: 'project_id',
          type: 'number'
        },
        "hpb_id": {
          name: 'hpb_id',
          type: 'number'
        },
        "quantity_required": {
          name: 'quantity_required',
          type: 'string'
        },
        "rds_id": {
          name: 'rds_id',
          type: 'number'
        },
        "pic_same_as_hpb": {
          name: 'pic_same_as_hpb',
          type: 'number'
        },
        "pic_name": {
          name: 'pic_name',
          type: 'number'
        },
        "pic_designation": {
          name: 'pic_designation',
          type: 'string'
        },
        "pic_mobile": {
          name: 'pic_mobile',
          type: 'string'
        },
        "new_price_request": {
          name: 'new_price_request',
          type: 'string'
        },
        "term_of_payment": {
          name: 'term_of_payment',
          type: 'string'
        },
        "product_request_status": {
          name: 'product_request_status',
          type: 'string'
        },
        "product_request_status_remark": {
          name: 'product_request_status_remark',
          type: 'string'
        },
        "status_change_date": {
          name: 'status_change_date',
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
        "hpb_digital_sign": {
          name: 'hpb_digital_sign',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
