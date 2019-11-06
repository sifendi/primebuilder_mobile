/* tslint:disable */

declare var Object: any;
export interface Reward_promosInterface {
  "id"?: number;
  "reward_id"?: number;
  "promo_points"?: number;
  "start_date"?: string;
  "end_date"?: string;
  "status"?: number;
  "created_by"?: number;
  "created_date"?: string;
  "updated_by"?: number;
  "updated_date"?: string;
}

export class Reward_promos implements Reward_promosInterface {
  "id": number;
  "reward_id": number;
  "promo_points": number;
  "start_date": string;
  "end_date": string;
  "status": number;
  "created_by": number;
  "created_date": string;
  "updated_by": number;
  "updated_date": string;
  constructor(data?: Reward_promosInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Reward_promos`.
   */
  public static getModelName() {
    return "Reward_promos";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Reward_promos for dynamic purposes.
  **/
  public static factory(data: Reward_promosInterface): Reward_promos{
    return new Reward_promos(data);
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
      name: 'Reward_promos',
      plural: 'Reward_promos',
      path: 'Reward_promos',
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
        "promo_points": {
          name: 'promo_points',
          type: 'number'
        },
        "start_date": {
          name: 'start_date',
          type: 'string'
        },
        "end_date": {
          name: 'end_date',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
          type: 'string'
        },
        "updated_by": {
          name: 'updated_by',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
          type: 'string'
        },
      },
      relations: {
      }
    }
  }
}
