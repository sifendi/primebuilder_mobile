/* tslint:disable */

declare var Object: any;
export interface Eap_master_lead_segmentInterface {
  "segment_id"?: number;
  "segment_name"?: string;
  "created_date"?: number;
  "created_by"?: number;
  "updated_date"?: number;
  "updated_by"?: number;
  "status"?: number;
}

export class Eap_master_lead_segment implements Eap_master_lead_segmentInterface {
  "segment_id": number;
  "segment_name": string;
  "created_date": number;
  "created_by": number;
  "updated_date": number;
  "updated_by": number;
  "status": number;
  constructor(data?: Eap_master_lead_segmentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_master_lead_segment`.
   */
  public static getModelName() {
    return "Eap_master_lead_segment";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_master_lead_segment for dynamic purposes.
  **/
  public static factory(data: Eap_master_lead_segmentInterface): Eap_master_lead_segment{
    return new Eap_master_lead_segment(data);
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
      name: 'Eap_master_lead_segment',
      plural: 'Eap_master_lead_segments',
      path: 'Eap_master_lead_segments',
      idName: 'segment_id',
      properties: {
        "segment_id": {
          name: 'segment_id',
          type: 'number'
        },
        "segment_name": {
          name: 'segment_name',
          type: 'string'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
          type: 'number'
        },
        "updated_by": {
          name: 'updated_by',
          type: 'number'
        },
        "status": {
          name: 'status',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
