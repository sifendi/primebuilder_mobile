/* tslint:disable */

declare var Object: any;
export interface User_mappingInterface {
  "id"?: number;
  "realm"?: string;
}

export class User_mapping implements User_mappingInterface {
  "id": number;
  "realm": string;
  constructor(data?: User_mappingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `User_mapping`.
   */
  public static getModelName() {
    return "User_mapping";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of User_mapping for dynamic purposes.
  **/
  public static factory(data: User_mappingInterface): User_mapping{
    return new User_mapping(data);
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
      name: 'User_mapping',
      plural: 'User_mappings',
      path: 'User_mappings',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
