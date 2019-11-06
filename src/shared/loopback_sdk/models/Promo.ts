/* tslint:disable */

declare var Object: any;
export interface PromoInterface {
  "id"?: number;
  "reward_id": number;
  "start_date": number;
  "end_date": number;
}

export class Promo implements PromoInterface {
  "id": number;
  "reward_id": number;
  "start_date": number;
  "end_date": number;
  constructor(data?: PromoInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Promo`.
   */
  public static getModelName() {
    return "Promo";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Promo for dynamic purposes.
  **/
  public static factory(data: PromoInterface): Promo{
    return new Promo(data);
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
      name: 'Promo',
      plural: 'Promos',
      path: 'Promos',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "reward_id": {
          name: 'reward_id',
          type: 'number'
        },
        "start_date": {
          name: 'start_date',
          type: 'number'
        },
        "end_date": {
          name: 'end_date',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
