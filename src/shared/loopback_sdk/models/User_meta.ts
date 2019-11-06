/* tslint:disable */

declare var Object: any;
export interface User_metaInterface {
  "id"?: number;
  "uid"?: number;
  "meta_key"?: string;
  "meta_value"?: string;
  "created_date"?: number;
  "updated_date"?: number;
}

export class User_meta implements User_metaInterface {
  "id": number;
  "uid": number;
  "meta_key": string;
  "meta_value": string;
  "created_date": number;
  "updated_date": number;
  constructor(data?: User_metaInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `User_meta`.
   */
  public static getModelName() {
    return "User_meta";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of User_meta for dynamic purposes.
  **/
  public static factory(data: User_metaInterface): User_meta{
    return new User_meta(data);
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
      name: 'User_meta',
      plural: 'User_meta',
      path: 'User_meta',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "uid": {
          name: 'uid',
          type: 'number'
        },
        "meta_key": {
          name: 'meta_key',
          type: 'string'
        },
        "meta_value": {
          name: 'meta_value',
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
      },
      relations: {
      }
    }
  }
}
