/* tslint:disable */

declare var Object: any;
export interface Eap_lead_invoiceInterface {
  "invoice_id"?: number;
  "invoice_lead_id"?: number;
  "invoice_purchase_date"?: number;
  "invoice_product_id"?: number;
  "invoice_quantity"?: number;
  "invoice_city"?: string;
  "invoice_sub_district"?: string;
  "invoice_rds_id"?: number;
  "invoice_purchase_photos"?: string;
  "invoice_description"?: string;
  "created_by"?: number;
  "created_date"?: number;
  "updated_by"?: number;
  "updated_date"?: number;
  "local_created_date"?: number;
  "local_updated_date"?: number;
  "latitude"?: string;
  "longitude"?: string;
  "status"?: number;
  "id"?: number;
}

export class Eap_lead_invoice implements Eap_lead_invoiceInterface {
  "invoice_id": number;
  "invoice_lead_id": number;
  "invoice_purchase_date": number;
  "invoice_product_id": number;
  "invoice_quantity": number;
  "invoice_city": string;
  "invoice_sub_district": string;
  "invoice_rds_id": number;
  "invoice_purchase_photos": string;
  "invoice_description": string;
  "created_by": number;
  "created_date": number;
  "updated_by": number;
  "updated_date": number;
  "local_created_date": number;
  "local_updated_date": number;
  "latitude": string;
  "longitude": string;
  "status": number;
  "id": number;
  constructor(data?: Eap_lead_invoiceInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Eap_lead_invoice`.
   */
  public static getModelName() {
    return "Eap_lead_invoice";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Eap_lead_invoice for dynamic purposes.
  **/
  public static factory(data: Eap_lead_invoiceInterface): Eap_lead_invoice{
    return new Eap_lead_invoice(data);
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
      name: 'Eap_lead_invoice',
      plural: 'Eap_lead_invoices',
      path: 'Eap_lead_invoices',
      idName: 'id',
      properties: {
        "invoice_id": {
          name: 'invoice_id',
          type: 'number'
        },
        "invoice_lead_id": {
          name: 'invoice_lead_id',
          type: 'number'
        },
        "invoice_purchase_date": {
          name: 'invoice_purchase_date',
          type: 'number'
        },
        "invoice_product_id": {
          name: 'invoice_product_id',
          type: 'number'
        },
        "invoice_quantity": {
          name: 'invoice_quantity',
          type: 'number'
        },
        "invoice_city": {
          name: 'invoice_city',
          type: 'string'
        },
        "invoice_sub_district": {
          name: 'invoice_sub_district',
          type: 'string'
        },
        "invoice_rds_id": {
          name: 'invoice_rds_id',
          type: 'number'
        },
        "invoice_purchase_photos": {
          name: 'invoice_purchase_photos',
          type: 'string'
        },
        "invoice_description": {
          name: 'invoice_description',
          type: 'string'
        },
        "created_by": {
          name: 'created_by',
          type: 'number'
        },
        "created_date": {
          name: 'created_date',
          type: 'number'
        },
        "updated_by": {
          name: 'updated_by',
          type: 'number'
        },
        "updated_date": {
          name: 'updated_date',
          type: 'number'
        },
        "local_created_date": {
          name: 'local_created_date',
          type: 'number'
        },
        "local_updated_date": {
          name: 'local_updated_date',
          type: 'number'
        },
        "latitude": {
          name: 'latitude',
          type: 'string'
        },
        "longitude": {
          name: 'longitude',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'number'
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
