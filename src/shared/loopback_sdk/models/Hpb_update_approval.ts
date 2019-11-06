/* tslint:disable */

declare var Object: any;
export interface Hpb_update_approvalInterface {
  "id"?: number;
  "hpb_id": number;
  "field_name": string;
  "field_old_value": string;
  "field_new_value": string;
  "approval_status": number;
  "is_closed": number;
  "created_by"?: number;
  "updated_by": number;
}

export class Hpb_update_approval implements Hpb_update_approvalInterface {
  "id": number;
  "hpb_id": number;
  "field_name": string;
  "field_old_value": string;
  "field_new_value": string;
  "approval_status": number;
  "is_closed": number;
  "created_by": number;
  "updated_by": number;
  constructor(data?: Hpb_update_approvalInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Hpb_update_approval`.
   */
  public static getModelName() {
    return "Hpb_update_approval";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Hpb_update_approval for dynamic purposes.
  **/
  public static factory(data: Hpb_update_approvalInterface): Hpb_update_approval{
    return new Hpb_update_approval(data);
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
      name: 'Hpb_update_approval',
      plural: 'hpb_update_approval',
      path: 'hpb_update_approval',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "hpb_id": {
          name: 'hpb_id',
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
