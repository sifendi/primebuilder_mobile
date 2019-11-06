/* tslint:disable */

declare var Object: any;
export interface App_loginInterface {
  "id"?: number;
}

export class App_login implements App_loginInterface {
  "id": number;
  constructor(data?: App_loginInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_login`.
   */
  public static getModelName() {
    return "App_login";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_login for dynamic purposes.
  **/
  public static factory(data: App_loginInterface): App_login{
    return new App_login(data);
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
      name: 'App_login',
      plural: 'app_login',
      path: 'app_login',
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
