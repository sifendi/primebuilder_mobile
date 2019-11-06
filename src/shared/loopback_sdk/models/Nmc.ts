/* tslint:disable */

declare var Object: any;
export interface NmcInterface {
  "id"?: number;
  "nmc_type"?: string;
  "status"?: number;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class Nmc implements NmcInterface {
  "id": number;
  "nmc_type": string;
  "status": number;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: NmcInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Nmc`.
   */
  public static getModelName() {
    return "Nmc";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Nmc for dynamic purposes.
  **/
  public static factory(data: NmcInterface): Nmc{
    return new Nmc(data);
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
      name: 'Nmc',
      plural: 'Nmcs',
      path: 'Nmcs',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "nmc_type": {
          name: 'nmc_type',
          type: 'string'
        },
        "status": {
          name: 'status',
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
