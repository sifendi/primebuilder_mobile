/* tslint:disable */

declare var Object: any;
export interface Eap_reportInterface {
  "id"?: number;
}

export class Eap_report implements Eap_reportInterface {
  "id": number;
  constructor(data?: Eap_reportInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_report`.
   */
  public static getModelName() {
    return "Eap_report";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_report for dynamic purposes.
  **/
  public static factory(data: Eap_reportInterface): Eap_report{
    return new Eap_report(data);
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
      name: 'Eap_report',
      plural: 'Eap_reports',
      path: 'Eap_reports',
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
