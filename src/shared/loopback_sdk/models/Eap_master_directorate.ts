/* tslint:disable */

declare var Object: any;
export interface Eap_master_directorateInterface {
  "directorate_id"?: number;
  "directorate_name"?: string;
  "created_date"?: number;
  "updated_date"?: number;
  "created_by"?: number;
  "updated_by"?: number;
  "status"?: number;
}

export class Eap_master_directorate implements Eap_master_directorateInterface {
  "directorate_id": number;
  "directorate_name": string;
  "created_date": number;
  "updated_date": number;
  "created_by": number;
  "updated_by": number;
  "status": number;
  constructor(data?: Eap_master_directorateInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_master_directorate`.
   */
  public static getModelName() {
    return "Eap_master_directorate";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_master_directorate for dynamic purposes.
  **/
  public static factory(data: Eap_master_directorateInterface): Eap_master_directorate{
    return new Eap_master_directorate(data);
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
      name: 'Eap_master_directorate',
      plural: 'Eap_master_directorates',
      path: 'Eap_master_directorates',
      idName: 'directorate_id',
      properties: {
        "directorate_id": {
          name: 'directorate_id',
          type: 'number'
        },
        "directorate_name": {
          name: 'directorate_name',
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
