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
import { App_rds_visit } from '../../models/App_rds_visit';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `App_rds_visit` model.
 */
@Injectable()
export class App_rds_visitApi extends BaseLoopBackApi {

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
   * This usually means the response is a `App_rds_visit` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds_visit";
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
   * @param {any} id app_rds_visit id
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
   * This usually means the response is a `App_rds_visit` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds_visit/:id";
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
   * @param {number} rds_visit_id 
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
  public addEditRdsVisit(dataArrObj: any = {}, rds_visit_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds_visit/addEditRdsVisit";
    let _routeParams: any = {};
    let _postBody: any = {
      dataArrObj: dataArrObj
    };
    let _urlParams: any = {};
    if (typeof rds_visit_id !== 'undefined' && rds_visit_id !== null) _urlParams.rds_visit_id = rds_visit_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} rds_visit_id 
   *
   * @param {number} rds_id 
   *
   * @param {number} created_date 
   *
   * @param {number} created_by 
   *
   * @param {number} updated_date 
   *
   * @param {number} updated_by 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {string} rdsName 
   *
   * @param {string} rdsType 
   *
   * @param {number} visitDateFrom 
   *
   * @param {number} visitDateTo 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRdsVisit(rds_visit_id: any = {}, rds_id: any = {}, created_date: any = {}, created_by: any = {}, updated_date: any = {}, updated_by: any = {}, limit: any = {}, page: any = {}, user_id: any = {}, rolename: any = {}, rdsName: any = {}, rdsType: any = {}, visitDateFrom: any = {}, visitDateTo: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds_visit/getRdsVisit";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rds_visit_id !== 'undefined' && rds_visit_id !== null) _urlParams.rds_visit_id = rds_visit_id;
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof rdsName !== 'undefined' && rdsName !== null) _urlParams.rdsName = rdsName;
    if (typeof rdsType !== 'undefined' && rdsType !== null) _urlParams.rdsType = rdsType;
    if (typeof visitDateFrom !== 'undefined' && visitDateFrom !== null) _urlParams.visitDateFrom = visitDateFrom;
    if (typeof visitDateTo !== 'undefined' && visitDateTo !== null) _urlParams.visitDateTo = visitDateTo;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} rds_visit_id 
   *
   * @param {number} rds_id 
   *
   * @param {number} created_date 
   *
   * @param {number} created_by 
   *
   * @param {number} updated_date 
   *
   * @param {number} updated_by 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {string} rdsName 
   *
   * @param {string} rdsType 
   *
   * @param {number} visitDateFrom 
   *
   * @param {number} visitDateTo 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRdsVisitCount(rds_visit_id: any = {}, rds_id: any = {}, created_date: any = {}, created_by: any = {}, updated_date: any = {}, updated_by: any = {}, limit: any = {}, page: any = {}, user_id: any = {}, rolename: any = {}, rdsName: any = {}, rdsType: any = {}, visitDateFrom: any = {}, visitDateTo: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds_visit/getRdsVisitCount";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rds_visit_id !== 'undefined' && rds_visit_id !== null) _urlParams.rds_visit_id = rds_visit_id;
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof rdsName !== 'undefined' && rdsName !== null) _urlParams.rdsName = rdsName;
    if (typeof rdsType !== 'undefined' && rdsType !== null) _urlParams.rdsType = rdsType;
    if (typeof visitDateFrom !== 'undefined' && visitDateFrom !== null) _urlParams.visitDateFrom = visitDateFrom;
    if (typeof visitDateTo !== 'undefined' && visitDateTo !== null) _urlParams.visitDateTo = visitDateTo;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} rds_visit_id 
   *
   * @param {number} rds_id 
   *
   * @param {number} created_date 
   *
   * @param {number} created_by 
   *
   * @param {number} updated_date 
   *
   * @param {number} updated_by 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRdsVisitStock(rds_visit_id: any = {}, rds_id: any = {}, created_date: any = {}, created_by: any = {}, updated_date: any = {}, updated_by: any = {}, limit: any = {}, page: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds_visit/getRdsVisitStock";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rds_visit_id !== 'undefined' && rds_visit_id !== null) _urlParams.rds_visit_id = rds_visit_id;
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `App_rds_visit`.
   */
  public getModelName() {
    return "App_rds_visit";
  }
}
