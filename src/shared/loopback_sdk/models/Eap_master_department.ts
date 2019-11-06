/* tslint:disable */

declare var Object: any;
export interface Eap_master_departmentInterface {
  "department_id"?: number;
  "department_directorate_id"?: number;
  "department_name"?: string;
  "created_by"?: number;
  "created_date"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
  "status"?: number;
}

export class Eap_master_department implements Eap_master_departmentInterface {
  "department_id": number;
  "department_directorate_id": number;
  "department_name": string;
  "created_by": number;
  "created_date": number;
  "updated_date": number;
  "updated_by": number;
  "status": number;
  constructor(data?: Eap_master_departmentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_master_department`.
   */
  public static getModelName() {
    return "Eap_master_department";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_master_department for dynamic purposes.
  **/
  public static factory(data: Eap_master_departmentInterface): Eap_master_department{
    return new Eap_master_department(data);
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
      name: 'Eap_master_department',
      plural: 'Eap_master_departments',
      path: 'Eap_master_departments',
      idName: 'department_id',
      properties: {
        "department_id": {
          name: 'department_id',
          type: 'number'
        },
        "department_directorate_id": {
          name: 'department_directorate_id',
          type: 'number'
        },
        "department_name": {
          name: 'department_name',
          type: 'string'
        },
        "created_by": {
          name: 'created_by',
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
        "updated_by": {
          name: 'updated_by',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
