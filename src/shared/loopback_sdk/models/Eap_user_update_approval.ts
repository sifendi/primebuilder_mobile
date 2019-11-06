/* tslint:disable */

declare var Object: any;
export interface Eap_user_update_approvalInterface {
  "id"?: number;
  "uid"?: number;
  "field_name"?: string;
  "field_old_value"?: string;
  "field_new_value"?: string;
  "approval_status"?: number;
  "is_closed"?: number;
  "created_by"?: number;
  "updated_by"?: number;
  "created_date"?: number;
  "updated_date"?: number;
}

export class Eap_user_update_approval implements Eap_user_update_approvalInterface {
  "id": number;
  "uid": number;
  "field_name": string;
  "field_old_value": string;
  "field_new_value": string;
  "approval_status": number;
  "is_closed": number;
  "created_by": number;
  "updated_by": number;
  "created_date": number;
  "updated_date": number;
  constructor(data?: Eap_user_update_approvalInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_user_update_approval`.
   */
  public static getModelName() {
    return "Eap_user_update_approval";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_user_update_approval for dynamic purposes.
  **/
  public static factory(data: Eap_user_update_approvalInterface): Eap_user_update_approval{
    return new Eap_user_update_approval(data);
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
      name: 'Eap_user_update_approval',
      plural: 'eap_user_update_approval',
      path: 'eap_user_update_approval',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "uid": {
          name: 'uid',
          type: 'number'
        },
        "field_name": {
          name: 'field_name',
          type: 'string'
        },
        "field_old_value": {
          name: 'field_old_value',
          type: 'string'
        },
        "field_new_value": {
          name: 'field_new_value',
          type: 'string'
        },
        "approval_status": {
          name: 'approval_status',
          type: 'number',
          default: 0
        },
        "is_closed": {
          name: 'is_closed',
          type: 'number',
          default: 0
        },
        "created_by": {
          name: 'created_by',
          type: 'number',
          default: 0
        },
        "updated_by": {
          name: 'updated_by',
          type: 'number',
          default: 0
        },
        "created_date": {
          name: 'created_date',
          type: 'number',
          default: 0
        },
        "updated_date": {
          name: 'updated_date',
          type: 'number',
          default: 0
        },
      },
      relations: {
      }
    }
  }
}
