/* tslint:disable */

declare var Object: any;
export interface VillageInterface {
  "id"?: number;
  "postal_code_id"?: number;
  "village_name"?: string;
}

export class Village implements VillageInterface {
  "id": number;
  "postal_code_id": number;
  "village_name": string;
  constructor(data?: VillageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Village`.
   */
  public static getModelName() {
    return "Village";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Village for dynamic purposes.
  **/
  public static factory(data: VillageInterface): Village{
    return new Village(data);
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
      name: 'Village',
      plural: 'Villages',
      path: 'Villages',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "postal_code_id": {
          name: 'postal_code_id',
          type: 'number'
        },
        "village_name": {
          name: 'village_name',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
