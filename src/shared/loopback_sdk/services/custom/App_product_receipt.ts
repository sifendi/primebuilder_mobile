/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { Http, Response } from '@angular/http';
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackAuth } from '../core/auth.service';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { JSONSearchParams } from '../core/search.params';
import { ErrorHandler } from '../core/error.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { App_product_receipt } from '../../models/App_product_receipt';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `App_product_receipt` model.
 */
@Injectable()
export class App_product_receiptApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) protected http: Http,
    @Inject(SocketConnection) protected connection: SocketConnection,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Inject(JSONSearchParams) protected searchParams: JSONSearchParams,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  connection,  models, auth, searchParams, errorHandler);
  }

  /**
   * Patch an existing model instance or insert a new one into the data source.
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - Model instance data
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `App_product_receipt` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_receipt";
    let _routeParams: any = {};
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Patch attributes for a model instance and persist it into the data source.
   *
   * @param {any} id app_product_receipt id
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - An object of model property name/value pairs
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `App_product_receipt` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_receipt/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} receipt_id 
   *
   * @param {object} data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public addEditProductReceipt(dataArrObj: any = {}, receipt_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_receipt/addEditProductReceipt";
    let _routeParams: any = {};
    let _postBody: any = {
      dataArrObj: dataArrObj
    };
    let _urlParams: any = {};
    if (typeof receipt_id !== 'undefined' && receipt_id !== null) _urlParams.receipt_id = receipt_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} receipt_id 
   *
   * @param {number} hpb_id 
   *
   * @param {number} project_id 
   *
   * @param {number} product_id 
   *
   * @param {number} rds_id 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {string} approval 
   *
   * @param {number} created_by 
   *
   * @param {number} created_date 
   *
   * @param {number} updated_by 
   *
   * @param {number} updated_date 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} from_date 
   *
   * @param {number} to_date 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getProductReceipt(receipt_id: any = {}, hpb_id: any = {}, project_id: any = {}, product_id: any = {}, rds_id: any = {}, user_id: any = {}, rolename: any = {}, approval: any = {}, created_by: any = {}, created_date: any = {}, updated_by: any = {}, updated_date: any = {}, limit: any = {}, page: any = {}, from_date: any = {}, to_date: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_receipt/getProductReceipt";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof receipt_id !== 'undefined' && receipt_id !== null) _urlParams.receipt_id = receipt_id;
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof project_id !== 'undefined' && project_id !== null) _urlParams.project_id = project_id;
    if (typeof product_id !== 'undefined' && product_id !== null) _urlParams.product_id = product_id;
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof approval !== 'undefined' && approval !== null) _urlParams.approval = approval;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof from_date !== 'undefined' && from_date !== null) _urlParams.from_date = from_date;
    if (typeof to_date !== 'undefined' && to_date !== null) _urlParams.to_date = to_date;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} receipt_id 
   *
   * @param {number} hpb_id 
   *
   * @param {number} project_id 
   *
   * @param {number} product_id 
   *
   * @param {number} rds_id 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {string} approval 
   *
   * @param {string} approval_by 
   *
   * @param {number} created_by 
   *
   * @param {number} created_date 
   *
   * @param {number} updated_by 
   *
   * @param {number} updated_date 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} from_date 
   *
   * @param {number} to_date 
   *
   * @param {string} project_name 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getProductReceiptWithApproval(receipt_id: any = {}, hpb_id: any = {}, project_id: any = {}, product_id: any = {}, rds_id: any = {}, user_id: any = {}, rolename: any = {}, approval: any = {}, approval_by: any = {}, created_by: any = {}, created_date: any = {}, updated_by: any = {}, updated_date: any = {}, limit: any = {}, page: any = {}, from_date: any = {}, to_date: any = {}, project_name: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_receipt/getProductReceiptWithApproval";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof receipt_id !== 'undefined' && receipt_id !== null) _urlParams.receipt_id = receipt_id;
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof project_id !== 'undefined' && project_id !== null) _urlParams.project_id = project_id;
    if (typeof product_id !== 'undefined' && product_id !== null) _urlParams.product_id = product_id;
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof approval !== 'undefined' && approval !== null) _urlParams.approval = approval;
    if (typeof approval_by !== 'undefined' && approval_by !== null) _urlParams.approval_by = approval_by;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof from_date !== 'undefined' && from_date !== null) _urlParams.from_date = from_date;
    if (typeof to_date !== 'undefined' && to_date !== null) _urlParams.to_date = to_date;
    if (typeof project_name !== 'undefined' && project_name !== null) _urlParams.project_name = project_name;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} receipt_id 
   *
   * @param {number} hpb_id 
   *
   * @param {number} project_id 
   *
   * @param {number} product_id 
   *
   * @param {number} rds_id 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {string} approval 
   *
   * @param {string} approval_by 
   *
   * @param {number} created_by 
   *
   * @param {number} created_date 
   *
   * @param {number} updated_by 
   *
   * @param {number} updated_date 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} from_date 
   *
   * @param {number} to_date 
   *
   * @param {string} project_name 
   *
   * @param {string} product_name 
   *
   * @param {string} hpb_name 
   *
   * @param {string} sa_approval 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getProductReceiptForAdmin(receipt_id: any = {}, hpb_id: any = {}, project_id: any = {}, product_id: any = {}, rds_id: any = {}, user_id: any = {}, rolename: any = {}, approval: any = {}, approval_by: any = {}, created_by: any = {}, created_date: any = {}, updated_by: any = {}, updated_date: any = {}, limit: any = {}, page: any = {}, from_date: any = {}, to_date: any = {}, project_name: any = {}, product_name: any = {}, hpb_name: any = {}, sa_approval: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_receipt/getProductReceiptForAdmin";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof receipt_id !== 'undefined' && receipt_id !== null) _urlParams.receipt_id = receipt_id;
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof project_id !== 'undefined' && project_id !== null) _urlParams.project_id = project_id;
    if (typeof product_id !== 'undefined' && product_id !== null) _urlParams.product_id = product_id;
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof approval !== 'undefined' && approval !== null) _urlParams.approval = approval;
    if (typeof approval_by !== 'undefined' && approval_by !== null) _urlParams.approval_by = approval_by;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof from_date !== 'undefined' && from_date !== null) _urlParams.from_date = from_date;
    if (typeof to_date !== 'undefined' && to_date !== null) _urlParams.to_date = to_date;
    if (typeof project_name !== 'undefined' && project_name !== null) _urlParams.project_name = project_name;
    if (typeof product_name !== 'undefined' && product_name !== null) _urlParams.product_name = product_name;
    if (typeof hpb_name !== 'undefined' && hpb_name !== null) _urlParams.hpb_name = hpb_name;
    if (typeof sa_approval !== 'undefined' && sa_approval !== null) _urlParams.sa_approval = sa_approval;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} receipt_id 
   *
   * @param {number} hpb_id 
   *
   * @param {number} project_id 
   *
   * @param {number} product_id 
   *
   * @param {number} rds_id 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {string} approval 
   *
   * @param {string} approval_by 
   *
   * @param {number} created_by 
   *
   * @param {number} created_date 
   *
   * @param {number} updated_by 
   *
   * @param {number} updated_date 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} from_date 
   *
   * @param {number} to_date 
   *
   * @param {string} project_name 
   *
   * @param {string} product_name 
   *
   * @param {string} hpb_name 
   *
   * @param {string} sa_approval 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getProductReceiptForAdminCount(receipt_id: any = {}, hpb_id: any = {}, project_id: any = {}, product_id: any = {}, rds_id: any = {}, user_id: any = {}, rolename: any = {}, approval: any = {}, approval_by: any = {}, created_by: any = {}, created_date: any = {}, updated_by: any = {}, updated_date: any = {}, limit: any = {}, page: any = {}, from_date: any = {}, to_date: any = {}, project_name: any = {}, product_name: any = {}, hpb_name: any = {}, sa_approval: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_receipt/getProductReceiptForAdminCount";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof receipt_id !== 'undefined' && receipt_id !== null) _urlParams.receipt_id = receipt_id;
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof project_id !== 'undefined' && project_id !== null) _urlParams.project_id = project_id;
    if (typeof product_id !== 'undefined' && product_id !== null) _urlParams.product_id = product_id;
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof approval !== 'undefined' && approval !== null) _urlParams.approval = approval;
    if (typeof approval_by !== 'undefined' && approval_by !== null) _urlParams.approval_by = approval_by;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof from_date !== 'undefined' && from_date !== null) _urlParams.from_date = from_date;
    if (typeof to_date !== 'undefined' && to_date !== null) _urlParams.to_date = to_date;
    if (typeof project_name !== 'undefined' && project_name !== null) _urlParams.project_name = project_name;
    if (typeof product_name !== 'undefined' && product_name !== null) _urlParams.product_name = product_name;
    if (typeof hpb_name !== 'undefined' && hpb_name !== null) _urlParams.hpb_name = hpb_name;
    if (typeof sa_approval !== 'undefined' && sa_approval !== null) _urlParams.sa_approval = sa_approval;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `App_product_receipt`.
   */
  public getModelName() {
    return "App_product_receipt";
  }
}
