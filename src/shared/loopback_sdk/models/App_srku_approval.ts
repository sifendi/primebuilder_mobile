/* tslint:disable */

declare var Object: any;
export interface App_srku_approvalInterface {
  "srku_approval_id"?: number;
  "project_id"?: number;
  "srku_approval_status"?: string;
  "is_closed"?: number;
  "srku_rejection_reason"?: string;
  "approved_by"?: number;
  "created_date"?: number;
  "updated_date"?: number;
}

export class App_srku_approval implements App_srku_approvalInterface {
  "srku_approval_id": number;
  "project_id": number;
  "srku_approval_status": string;
  "is_closed": number;
  "srku_rejection_reason": string;
  "approved_by": number;
  "created_date": number;
  "updated_date": number;
  constructor(data?: App_srku_approvalInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_srku_approval`.
   */
  public static getModelName() {
    return "App_srku_approval";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_srku_approval for dynamic purposes.
  **/
  public static factory(data: App_srku_approvalInterface): App_srku_approval{
    return new App_srku_approval(data);
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
      name: 'App_srku_approval',
      plural: 'App_srku_approvals',
      path: 'App_srku_approvals',
      idName: 'srku_approval_id',
      properties: {
        "srku_approval_id": {
          name: 'srku_approval_id',
          type: 'number'
        },
        "project_id": {
          name: 'project_id',
          type: 'number'
        },
        "srku_approval_status": {
          name: 'srku_approval_status',
          type: 'string'
        },
        "is_closed": {
          name: 'is_closed',
          type: 'number'
        },
        "srku_rejection_reason": {
          name: 'srku_rejection_reason',
          type: 'string'
        },
        "approved_by": {
          name: 'approved_by',
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
