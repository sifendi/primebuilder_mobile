/* tslint:disable */

declare var Object: any;
export interface Products_request_brand_capture_tblInterface {
  "id"?: number;
  "request_id"?: number;
  "brand_id"?: number;
  "price"?: string;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
}

export class Products_request_brand_capture_tbl implements Products_request_brand_capture_tblInterface {
  "id": number;
  "request_id": number;
  "brand_id": number;
  "price": string;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  "local_created_date": number;
  "local_updated_date": number;
  constructor(data?: Products_request_brand_capture_tblInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Products_request_brand_capture_tbl`.
   */
  public static getModelName() {
    return "Products_request_brand_capture_tbl";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Products_request_brand_capture_tbl for dynamic purposes.
  **/
  public static factory(data: Products_request_brand_capture_tblInterface): Products_request_brand_capture_tbl{
    return new Products_request_brand_capture_tbl(data);
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
      name: 'Products_request_brand_capture_tbl',
      plural: 'Products_request_brand_capture_tbls',
      path: 'Products_request_brand_capture_tbls',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "request_id": {
          name: 'request_id',
          type: 'number'
        },
        "brand_id": {
          name: 'brand_id',
          type: 'number'
        },
        "price": {
          name: 'price',
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
