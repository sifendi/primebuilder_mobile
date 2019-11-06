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
import { App_product_request } from '../../models/App_product_request';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `App_product_request` model.
 */
@Injectable()
export class App_product_requestApi extends BaseLoopBackApi {

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
   * This usually means the response is a `App_product_request` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_requests";
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
   * @param {any} id app_product_request id
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
   * This usually means the response is a `App_product_request` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_requests/:id";
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
   * @param {any} req_id 
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
  public addEditRequest(dataArrObj: any = {}, req_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_requests/addEditRequest";
    let _routeParams: any = {};
    let _postBody: any = {
      dataArrObj: dataArrObj
    };
    let _urlParams: any = {};
    if (typeof req_id !== 'undefined' && req_id !== null) _urlParams.req_id = req_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} req_id 
   *
   * @param {number} created_by 
   *
   * @param {number} updated_by 
   *
   * @param {number} created_date 
   *
   * @param {number} updated_date 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} hpb_id 
   *
   * @param {number} project_id 
   *
   * @param {number} req_date_from 
   *
   * @param {number} req_date_to 
   *
   * @param {string} req_status 
   *
   * @param {string} project_name 
   *
   * @param {string} hpb_name 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getProductRequest(req_id: any = {}, created_by: any = {}, updated_by: any = {}, created_date: any = {}, updated_date: any = {}, user_id: any = {}, rolename: any = {}, limit: any = {}, page: any = {}, hpb_id: any = {}, project_id: any = {}, req_date_from: any = {}, req_date_to: any = {}, req_status: any = {}, project_name: any = {}, hpb_name: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_requests/getProductRequest";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof req_id !== 'undefined' && req_id !== null) _urlParams.req_id = req_id;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof project_id !== 'undefined' && project_id !== null) _urlParams.project_id = project_id;
    if (typeof req_date_from !== 'undefined' && req_date_from !== null) _urlParams.req_date_from = req_date_from;
    if (typeof req_date_to !== 'undefined' && req_date_to !== null) _urlParams.req_date_to = req_date_to;
    if (typeof req_status !== 'undefined' && req_status !== null) _urlParams.req_status = req_status;
    if (typeof project_name !== 'undefined' && project_name !== null) _urlParams.project_name = project_name;
    if (typeof hpb_name !== 'undefined' && hpb_name !== null) _urlParams.hpb_name = hpb_name;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} req_id 
   *
   * @param {number} created_by 
   *
   * @param {number} updated_by 
   *
   * @param {number} created_date 
   *
   * @param {number} updated_date 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} hpb_id 
   *
   * @param {number} project_id 
   *
   * @param {number} req_date_from 
   *
   * @param {number} req_date_to 
   *
   * @param {string} req_status 
   *
   * @param {string} project_name 
   *
   * @param {string} hpb_name 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getProductRequestCount(req_id: any = {}, created_by: any = {}, updated_by: any = {}, created_date: any = {}, updated_date: any = {}, user_id: any = {}, rolename: any = {}, limit: any = {}, page: any = {}, hpb_id: any = {}, project_id: any = {}, req_date_from: any = {}, req_date_to: any = {}, req_status: any = {}, project_name: any = {}, hpb_name: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_product_requests/getProductRequestCount";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof req_id !== 'undefined' && req_id !== null) _urlParams.req_id = req_id;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof project_id !== 'undefined' && project_id !== null) _urlParams.project_id = project_id;
    if (typeof req_date_from !== 'undefined' && req_date_from !== null) _urlParams.req_date_from = req_date_from;
    if (typeof req_date_to !== 'undefined' && req_date_to !== null) _urlParams.req_date_to = req_date_to;
    if (typeof req_status !== 'undefined' && req_status !== null) _urlParams.req_status = req_status;
    if (typeof project_name !== 'undefined' && project_name !== null) _urlParams.project_name = project_name;
    if (typeof hpb_name !== 'undefined' && hpb_name !== null) _urlParams.hpb_name = hpb_name;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `App_product_request`.
   */
  public getModelName() {
    return "App_product_request";
  }
}
