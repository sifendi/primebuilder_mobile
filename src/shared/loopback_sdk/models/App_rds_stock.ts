/* tslint:disable */

declare var Object: any;
export interface App_rds_stockInterface {
  "stock_id"?: number;
  "rds_visit_id"?: number;
  "product_brand_id"?: number;
  "stock_selling_price"?: string;
  "stock_promo"?: string;
  "stock_quantity"?: number;
  "stock_unit"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
  "created_date"?: number;
  "updated_date"?: number;
}

export class App_rds_stock implements App_rds_stockInterface {
  "stock_id": number;
  "rds_visit_id": number;
  "product_brand_id": number;
  "stock_selling_price": string;
  "stock_promo": string;
  "stock_quantity": number;
  "stock_unit": number;
  "local_created_date": number;
  "local_updated_date": number;
  "created_date": number;
  "updated_date": number;
  constructor(data?: App_rds_stockInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_rds_stock`.
   */
  public static getModelName() {
    return "App_rds_stock";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_rds_stock for dynamic purposes.
  **/
  public static factory(data: App_rds_stockInterface): App_rds_stock{
    return new App_rds_stock(data);
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
      name: 'App_rds_stock',
      plural: 'app_rds_stock',
      path: 'app_rds_stock',
      idName: 'stock_id',
      properties: {
        "stock_id": {
          name: 'stock_id',
          type: 'number'
        },
        "rds_visit_id": {
          name: 'rds_visit_id',
          type: 'number'
        },
        "product_brand_id": {
          name: 'product_brand_id',
          type: 'number'
        },
        "stock_selling_price": {
          name: 'stock_selling_price',
          type: 'string'
        },
        "stock_promo": {
          name: 'stock_promo',
          type: 'string'
        },
        "stock_quantity": {
          name: 'stock_quantity',
          type: 'number'
        },
        "stock_unit": {
          name: 'stock_unit',
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
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
