/* tslint:disable */

declare var Object: any;
export interface App_product_receiptInterface {
  "receipt_id"?: number;
  "hpb_id"?: number;
  "hpb_status"?: string;
  "project_id"?: number;
  "product_id"?: number;
  "quantity"?: number;
  "unit"?: string;
  "rds_id"?: number;
  "purchase_date"?: string;
  "invoice_quantity"?: number;
  "invoice_image"?: string;
  "digital_sign"?: string;
  "additional_comments"?: string;
  "latitude"?: string;
  "longitude"?: string;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
}

export class App_product_receipt implements App_product_receiptInterface {
  "receipt_id": number;
  "hpb_id": number;
  "hpb_status": string;
  "project_id": number;
  "product_id": number;
  "quantity": number;
  "unit": string;
  "rds_id": number;
  "purchase_date": string;
  "invoice_quantity": number;
  "invoice_image": string;
  "digital_sign": string;
  "additional_comments": string;
  "latitude": string;
  "longitude": string;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  constructor(data?: App_product_receiptInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_product_receipt`.
   */
  public static getModelName() {
    return "App_product_receipt";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_product_receipt for dynamic purposes.
  **/
  public static factory(data: App_product_receiptInterface): App_product_receipt{
    return new App_product_receipt(data);
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
      name: 'App_product_receipt',
      plural: 'app_product_receipt',
      path: 'app_product_receipt',
      idName: 'receipt_id',
      properties: {
        "receipt_id": {
          name: 'receipt_id',
          type: 'number'
        },
        "hpb_id": {
          name: 'hpb_id',
          type: 'number'
        },
        "hpb_status": {
          name: 'hpb_status',
          type: 'string'
        },
        "project_id": {
          name: 'project_id',
          type: 'number'
        },
        "product_id": {
          name: 'product_id',
          type: 'number'
        },
        "quantity": {
          name: 'quantity',
          type: 'number'
        },
        "unit": {
          name: 'unit',
          type: 'string'
        },
        "rds_id": {
          name: 'rds_id',
          type: 'number'
        },
        "purchase_date": {
          name: 'purchase_date',
          type: 'string'
        },
        "invoice_quantity": {
          name: 'invoice_quantity',
          type: 'number'
        },
        "invoice_image": {
          name: 'invoice_image',
          type: 'string'
        },
        "digital_sign": {
          name: 'digital_sign',
          type: 'string'
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
      },
      relations: {
      }
    }
  }
}
