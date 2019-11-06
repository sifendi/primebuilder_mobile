/* tslint:disable */

declare var Object: any;
export interface Postal_codeInterface {
  "id"?: number;
  "subdistrict_id"?: number;
  "postal_code"?: string;
  "status"?: number;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
}

export class Postal_code implements Postal_codeInterface {
  "id": number;
  "subdistrict_id": number;
  "postal_code": string;
  "status": number;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  constructor(data?: Postal_codeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Postal_code`.
   */
  public static getModelName() {
    return "Postal_code";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Postal_code for dynamic purposes.
  **/
  public static factory(data: Postal_codeInterface): Postal_code{
    return new Postal_code(data);
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
      name: 'Postal_code',
      plural: 'Postal_codes',
      path: 'Postal_codes',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "subdistrict_id": {
          name: 'subdistrict_id',
          type: 'number'
        },
        "postal_code": {
          name: 'postal_code',
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
