/* tslint:disable */

declare var Object: any;
export interface App_taxonomy_term_dataInterface {
  "vid": number;
  "name": string;
  "description"?: string;
  "weight"?: number;
  "status"?: number;
  "id"?: number;
}

export class App_taxonomy_term_data implements App_taxonomy_term_dataInterface {
  "vid": number;
  "name": string;
  "description": string;
  "weight": number;
  "status": number;
  "id": number;
  constructor(data?: App_taxonomy_term_dataInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `App_taxonomy_term_data`.
   */
  public static getModelName() {
    return "App_taxonomy_term_data";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of App_taxonomy_term_data for dynamic purposes.
  **/
  public static factory(data: App_taxonomy_term_dataInterface): App_taxonomy_term_data{
    return new App_taxonomy_term_data(data);
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
      name: 'App_taxonomy_term_data',
      plural: 'app_taxonomy_term_data',
      path: 'app_taxonomy_term_data',
      idName: 'id',
      properties: {
        "vid": {
          name: 'vid',
          type: 'number',
          default: 0
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "weight": {
          name: 'weight',
          type: 'number',
          default: 1
        },
        "status": {
          name: 'status',
          type: 'number',
          default: 1
        },
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
