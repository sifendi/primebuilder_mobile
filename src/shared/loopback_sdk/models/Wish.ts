/* tslint:disable */

declare var Object: any;
export interface WishInterface {
  "id"?: number;
  "description": string;
  "created_by": number;
  "created_date": number;
}

export class Wish implements WishInterface {
  "id": number;
  "description": string;
  "created_by": number;
  "created_date": number;
  constructor(data?: WishInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Wish`.
   */
  public static getModelName() {
    return "Wish";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Wish for dynamic purposes.
  **/
  public static factory(data: WishInterface): Wish{
    return new Wish(data);
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
      name: 'Wish',
      plural: 'wishes',
      path: 'wishes',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "description": {
          name: 'description',
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
      },
      relations: {
      }
    }
  }
}
