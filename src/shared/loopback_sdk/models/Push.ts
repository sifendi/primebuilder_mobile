/* tslint:disable */

declare var Object: any;
export interface PushInterface {
  "id"?: number;
}

export class Push implements PushInterface {
  "id": number;
  constructor(data?: PushInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Push`.
   */
  public static getModelName() {
    return "Push";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Push for dynamic purposes.
  **/
  public static factory(data: PushInterface): Push{
    return new Push(data);
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
      name: 'Push',
      plural: 'Push',
      path: 'Push',
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
