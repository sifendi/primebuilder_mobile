/* tslint:disable */

declare var Object: any;
export interface App_usersInterface {
  "id"?: number;
  "realm"?: string;
  "username"?: string;
  "password": string;
  "email"?: string;
  "emailVerified"?: boolean;
  "verificationToken"?: string;
  "status"?: number;
  "isSuper"?: number;
}

export class App_users implements App_usersInterface {
  "id": number;
  "realm": string;
  "username": string;
  "password": string;
  "email": string;
  "emailVerified": boolean;
  "verificationToken": string;
  "status": number;
  "isSuper": number;
  constructor(data?: App_usersInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_users`.
   */
  public static getModelName() {
    return "App_users";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_users for dynamic purposes.
  **/
  public static factory(data: App_usersInterface): App_users{
    return new App_users(data);
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
      name: 'App_users',
      plural: 'App_users',
      path: 'App_users',
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
        "username": {
          name: 'username',
          type: 'string'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "verificationToken": {
          name: 'verificationToken',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "isSuper": {
          name: 'isSuper',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
