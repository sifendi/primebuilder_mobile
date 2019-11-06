/* tslint:disable */

declare var Object: any;
export interface User_mapInterface {
  "id"?: number;
}

export class User_map implements User_mapInterface {
  "id": number;
  constructor(data?: User_mapInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `User_map`.
   */
  public static getModelName() {
    return "User_map";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of User_map for dynamic purposes.
  **/
  public static factory(data: User_mapInterface): User_map{
    return new User_map(data);
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
      name: 'User_map',
      plural: 'user_map',
      path: 'user_map',
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
