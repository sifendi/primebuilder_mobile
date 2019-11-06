/* tslint:disable */

declare var Object: any;
export interface App_areaInterface {
  "id"?: number;
}

export class App_area implements App_areaInterface {
  "id": number;
  constructor(data?: App_areaInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_area`.
   */
  public static getModelName() {
    return "App_area";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_area for dynamic purposes.
  **/
  public static factory(data: App_areaInterface): App_area{
    return new App_area(data);
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
      name: 'App_area',
      plural: 'app_area',
      path: 'app_area',
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
