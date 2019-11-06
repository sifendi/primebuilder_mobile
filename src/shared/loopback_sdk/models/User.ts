/* tslint:disable */

declare var Object: any;
export interface UserInterface {
  "realm"?: string;
  "username"?: string;
  "email"?: string;
  "emailVerified"?: boolean;
  "status"?: number;
  "isSuper"?: number;
  "id"?: number;
  "password"?: string;
  userinfo?: any[];
  userinfohpb?: any[];
  userinfometa?: any[];
  accessTokens?: any[];
  roles?: any[];
}

export class User implements UserInterface {
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "status": number;
  "isSuper": number;
  "id": number;
  "password": string;
  userinfo: any[];
  userinfohpb: any[];
  userinfometa: any[];
  accessTokens: any[];
  roles: any[];
  constructor(data?: UserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `User`.
   */
  public static getModelName() {
    return "User";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of User for dynamic purposes.
  **/
  public static factory(data: UserInterface): User{
    return new User(data);
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
      name: 'User',
      plural: 'user',
      path: 'user',
      idName: 'id',
      properties: {
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
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
        "status": {
          name: 'status',
          type: 'number'
        },
        "isSuper": {
          name: 'isSuper',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        userinfo: {
          name: 'userinfo',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'uid'
        },
        userinfohpb: {
          name: 'userinfohpb',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'uid'
        },
        userinfometa: {
          name: 'userinfometa',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'uid'
        },
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        roles: {
          name: 'roles',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
          modelThrough: 'RoleMapping',
          keyThrough: 'roleId',
          keyFrom: 'id',
          keyTo: 'principalId'
        },
      }
    }
  }
}
