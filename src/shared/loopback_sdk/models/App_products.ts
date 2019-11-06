/* tslint:disable */

declare var Object: any;
export interface App_productsInterface {
  "id"?: number;
  "name"?: string;
  "type"?: string;
  "unit"?: string;
  "unit_value"?: number;
  "points"?: string;
  "cash"?: string;
  "req_ac_approv_qty"?: number;
  "status"?: number;
  "is_cement"?: number;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class App_products implements App_productsInterface {
  "id": number;
  "name": string;
  "type": string;
  "unit": string;
  "unit_value": number;
  "points": string;
  "cash": string;
  "req_ac_approv_qty": number;
  "status": number;
  "is_cement": number;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: App_productsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_products`.
   */
  public static getModelName() {
    return "App_products";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_products for dynamic purposes.
  **/
  public static factory(data: App_productsInterface): App_products{
    return new App_products(data);
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
      name: 'App_products',
      plural: 'app_products',
      path: 'app_products',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "unit": {
          name: 'unit',
          type: 'string'
        },
        "unit_value": {
          name: 'unit_value',
          type: 'number'
        },
        "points": {
          name: 'points',
          type: 'string'
        },
        "cash": {
          name: 'cash',
          type: 'string'
        },
        "req_ac_approv_qty": {
          name: 'req_ac_approv_qty',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "is_cement": {
          name: 'is_cement',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
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
