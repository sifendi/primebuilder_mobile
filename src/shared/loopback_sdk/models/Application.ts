/* tslint:disable */

declare var Object: any;
export interface ApplicationInterface {
  "id"?: string;
  "realm"?: string;
  "name": string;
  "description"?: string;
  "icon"?: string;
  "owner"?: string;
  "collaborators"?: Array<any>;
  "email"?: string;
  "emailVerified"?: boolean;
  "url"?: string;
  "callbackUrls"?: Array<any>;
  "permissions"?: Array<any>;
  "clientKey"?: string;
  "javaScriptKey"?: string;
  "restApiKey"?: string;
  "windowsKey"?: string;
  "masterKey"?: string;
  "pushSettings"?: any;
  "authenticationEnabled"?: boolean;
  "anonymousAllowed"?: boolean;
  "authenticationSchemes"?: Array<any>;
  "status"?: string;
  "created"?: Date;
  "modified"?: Date;
}

export class Application implements ApplicationInterface {
  "id": string;
  "realm": string;
  "name": string;
  "description": string;
  "icon": string;
  "owner": string;
  "collaborators": Array<any>;
  "email": string;
  "emailVerified": boolean;
  "url": string;
  "callbackUrls": Array<any>;
  "permissions": Array<any>;
  "clientKey": string;
  "javaScriptKey": string;
  "restApiKey": string;
  "windowsKey": string;
  "masterKey": string;
  "pushSettings": any;
  "authenticationEnabled": boolean;
  "anonymousAllowed": boolean;
  "authenticationSchemes": Array<any>;
  "status": string;
  "created": Date;
  "modified": Date;
  constructor(data?: ApplicationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Application`.
   */
  public static getModelName() {
    return "Application";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Application for dynamic purposes.
  **/
  public static factory(data: ApplicationInterface): Application{
    return new Application(data);
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
      name: 'Application',
      plural: 'Applications',
      path: 'Applications',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "icon": {
          name: 'icon',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "collaborators": {
          name: 'collaborators',
          type: 'Array&lt;any&gt;'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "callbackUrls": {
          name: 'callbackUrls',
          type: 'Array&lt;any&gt;'
        },
        "permissions": {
          name: 'permissions',
          type: 'Array&lt;any&gt;'
        },
        "clientKey": {
          name: 'clientKey',
          type: 'string'
        },
        "javaScriptKey": {
          name: 'javaScriptKey',
          type: 'string'
        },
        "restApiKey": {
          name: 'restApiKey',
          type: 'string'
        },
        "windowsKey": {
          name: 'windowsKey',
          type: 'string'
        },
        "masterKey": {
          name: 'masterKey',
          type: 'string'
        },
        "pushSettings": {
          name: 'pushSettings',
          type: 'any'
        },
        "authenticationEnabled": {
          name: 'authenticationEnabled',
          type: 'boolean',
          default: true
        },
        "anonymousAllowed": {
          name: 'anonymousAllowed',
          type: 'boolean',
          default: true
        },
        "authenticationSchemes": {
          name: 'authenticationSchemes',
          type: 'Array&lt;any&gt;'
        },
        "status": {
          name: 'status',
          type: 'string',
          default: 'sandbox'
        },
        "created": {
          name: 'created',
          type: 'Date'
        },
        "modified": {
          name: 'modified',
          type: 'Date'
        },
      },
      relations: {
      }
    }
  }
}
