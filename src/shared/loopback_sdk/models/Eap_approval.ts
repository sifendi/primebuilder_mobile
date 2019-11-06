/* tslint:disable */

declare var Object: any;
export interface Eap_approvalInterface {
  "approval_id"?: number;
  "type"?: string;
  "type_id"?: number;
  "approval_by"?: number;
  "approval_status"?: number;
  "rejection_reason"?: string;
  "is_closed"?: number;
  "created_by"?: number;
  "created_date"?: number;
  "updated_by"?: number;
  "updated_date"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
  "status"?: number;
  "id"?: number;
}

export class Eap_approval implements Eap_approvalInterface {
  "approval_id": number;
  "type": string;
  "type_id": number;
  "approval_by": number;
  "approval_status": number;
  "rejection_reason": string;
  "is_closed": number;
  "created_by": number;
  "created_date": number;
  "updated_by": number;
  "updated_date": number;
  "local_created_date": number;
  "local_updated_date": number;
  "status": number;
  "id": number;
  constructor(data?: Eap_approvalInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_approval`.
   */
  public static getModelName() {
    return "Eap_approval";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_approval for dynamic purposes.
  **/
  public static factory(data: Eap_approvalInterface): Eap_approval{
    return new Eap_approval(data);
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
      name: 'Eap_approval',
      plural: 'Eap_approvals',
      path: 'Eap_approvals',
      idName: 'id',
      properties: {
        "approval_id": {
          name: 'approval_id',
          type: 'number'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "type_id": {
          name: 'type_id',
          type: 'number'
        },
        "approval_by": {
          name: 'approval_by',
          type: 'number'
        },
        "approval_status": {
          name: 'approval_status',
          type: 'number'
        },
        "rejection_reason": {
          name: 'rejection_reason',
          type: 'string'
        },
        "is_closed": {
          name: 'is_closed',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "updated_by": {
          name: 'updated_by',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
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
        "status": {
          name: 'status',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
