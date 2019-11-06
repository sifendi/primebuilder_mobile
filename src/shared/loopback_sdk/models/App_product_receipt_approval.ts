/* tslint:disable */

declare var Object: any;
export interface App_product_receipt_approvalInterface {
  "id"?: number;
  "receipt_id"?: number;
  "approval_status"?: number;
  "approval_role"?: string;
  "rejection_reason"?: string;
  "is_closed"?: number;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
}

export class App_product_receipt_approval implements App_product_receipt_approvalInterface {
  "id": number;
  "receipt_id": number;
  "approval_status": number;
  "approval_role": string;
  "rejection_reason": string;
  "is_closed": number;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  constructor(data?: App_product_receipt_approvalInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_product_receipt_approval`.
   */
  public static getModelName() {
    return "App_product_receipt_approval";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_product_receipt_approval for dynamic purposes.
  **/
  public static factory(data: App_product_receipt_approvalInterface): App_product_receipt_approval{
    return new App_product_receipt_approval(data);
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
      name: 'App_product_receipt_approval',
      plural: 'App_product_receipt_approvals',
      path: 'App_product_receipt_approvals',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "receipt_id": {
          name: 'receipt_id',
          type: 'number'
        },
        "approval_status": {
          name: 'approval_status',
          type: 'number'
        },
        "approval_role": {
          name: 'approval_role',
          type: 'string'
        },
        "rejection_reason": {
          name: 'rejection_reason',
          type: 'string'
        },
        "is_closed": {
          name: 'is_closed',
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
