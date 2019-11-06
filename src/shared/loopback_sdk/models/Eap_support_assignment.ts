/* tslint:disable */

declare var Object: any;
export interface Eap_support_assignmentInterface {
  "id"?: number;
  "lead_id"?: number;
  "sph_id"?: number;
  "status"?: number;
  "created_by"?: number;
  "created_date"?: string;
  "updated_by"?: number;
  "updated_date"?: string;
}

export class Eap_support_assignment implements Eap_support_assignmentInterface {
  "id": number;
  "lead_id": number;
  "sph_id": number;
  "status": number;
  "created_by": number;
  "created_date": string;
  "updated_by": number;
  "updated_date": string;
  constructor(data?: Eap_support_assignmentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_support_assignment`.
   */
  public static getModelName() {
    return "Eap_support_assignment";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_support_assignment for dynamic purposes.
  **/
  public static factory(data: Eap_support_assignmentInterface): Eap_support_assignment{
    return new Eap_support_assignment(data);
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
      name: 'Eap_support_assignment',
      plural: 'Eap_support_assignments',
      path: 'Eap_support_assignments',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "lead_id": {
          name: 'lead_id',
          type: 'number'
        },
        "sph_id": {
          name: 'sph_id',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
          type: 'string'
        },
        "updated_by": {
          name: 'updated_by',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
