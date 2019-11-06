/* tslint:disable */

declare var Object: any;
export interface DydInterface {
  "id"?: number;
  "name": string;
}

export class Dyd implements DydInterface {
  "id": number;
  "name": string;
  constructor(data?: DydInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Dyd`.
   */
  public static getModelName() {
    return "Dyd";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Dyd for dynamic purposes.
  **/
  public static factory(data: DydInterface): Dyd{
    return new Dyd(data);
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
      name: 'Dyd',
      plural: 'dyd',
      path: 'dyd',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
