/* tslint:disable */

declare var Object: any;
export interface Retrieve_created_byInterface {
  "id"?: number;
}

export class Retrieve_created_by implements Retrieve_created_byInterface {
  "id": number;
  constructor(data?: Retrieve_created_byInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Retrieve_created_by`.
   */
  public static getModelName() {
    return "Retrieve_created_by";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Retrieve_created_by for dynamic purposes.
  **/
  public static factory(data: Retrieve_created_byInterface): Retrieve_created_by{
    return new Retrieve_created_by(data);
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
      name: 'Retrieve_created_by',
      plural: 'Retrieve_created_bies',
      path: 'Retrieve_created_bies',
      idName: 'id',
      properties: {
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
