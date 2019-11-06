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
import { App_rds } from '../../models/App_rds';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `App_rds` model.
 */
@Injectable()
export class App_rdsApi extends BaseLoopBackApi {

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
   * This usually means the response is a `App_rds` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds";
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
   * @param {any} id app_rds id
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
   * This usually means the response is a `App_rds` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds/:id";
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
   * @param {number} rds_id 
   *
   * @param {object} sub_district 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {number} city 
   *
   * @param {string} rds_type 
   *
   * @param {string} rds_name 
   *
   * @param {string} holcim_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRds(rds_id: any = {}, sub_district: any = {}, limit: any = {}, page: any = {}, user_id: any = {}, rolename: any = {}, city: any = {}, rds_type: any = {}, rds_name: any = {}, holcim_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds/getRds";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof sub_district !== 'undefined' && sub_district !== null) _urlParams.sub_district = sub_district;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof city !== 'undefined' && city !== null) _urlParams.city = city;
    if (typeof rds_type !== 'undefined' && rds_type !== null) _urlParams.rds_type = rds_type;
    if (typeof rds_name !== 'undefined' && rds_name !== null) _urlParams.rds_name = rds_name;
    if (typeof holcim_id !== 'undefined' && holcim_id !== null) _urlParams.holcim_id = holcim_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} rds_id 
   *
   * @param {object} sub_district 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {number} city 
   *
   * @param {string} rds_type 
   *
   * @param {string} rds_name 
   *
   * @param {string} holcim_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRdsExport(rds_id: any = {}, sub_district: any = {}, limit: any = {}, page: any = {}, user_id: any = {}, rolename: any = {}, city: any = {}, rds_type: any = {}, rds_name: any = {}, holcim_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds/getRdsExport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof sub_district !== 'undefined' && sub_district !== null) _urlParams.sub_district = sub_district;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof city !== 'undefined' && city !== null) _urlParams.city = city;
    if (typeof rds_type !== 'undefined' && rds_type !== null) _urlParams.rds_type = rds_type;
    if (typeof rds_name !== 'undefined' && rds_name !== null) _urlParams.rds_name = rds_name;
    if (typeof holcim_id !== 'undefined' && holcim_id !== null) _urlParams.holcim_id = holcim_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} rds_id 
   *
   * @param {object} sub_district 
   *
   * @param {number} limit 
   *
   * @param {number} page 
   *
   * @param {number} user_id 
   *
   * @param {string} rolename 
   *
   * @param {number} city 
   *
   * @param {string} rds_type 
   *
   * @param {string} rds_name 
   *
   * @param {string} holcim_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRdsCount(rds_id: any = {}, sub_district: any = {}, limit: any = {}, page: any = {}, user_id: any = {}, rolename: any = {}, city: any = {}, rds_type: any = {}, rds_name: any = {}, holcim_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds/getRdsCount";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    if (typeof sub_district !== 'undefined' && sub_district !== null) _urlParams.sub_district = sub_district;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof city !== 'undefined' && city !== null) _urlParams.city = city;
    if (typeof rds_type !== 'undefined' && rds_type !== null) _urlParams.rds_type = rds_type;
    if (typeof rds_name !== 'undefined' && rds_name !== null) _urlParams.rds_name = rds_name;
    if (typeof holcim_id !== 'undefined' && holcim_id !== null) _urlParams.holcim_id = holcim_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {number} rds_id 
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
  public insertEditRdsSubDistrict(rds_id: any = {}, subDist_ids: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds/insertEditRdsSubDistrict";
    let _routeParams: any = {};
    let _postBody: any = {
      subDist_ids: subDist_ids
    };
    let _urlParams: any = {};
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} holcim_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRdsOnHolcimId(holcim_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds/getRdsOnHolcimId";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof holcim_id !== 'undefined' && holcim_id !== null) _urlParams.holcim_id = holcim_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {any} rds_id 
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
  public addEditRds(dataArrObj: any = {}, rds_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds/addEditRds";
    let _routeParams: any = {};
    let _postBody: any = {
      dataArrObj: dataArrObj
    };
    let _urlParams: any = {};
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {any} rds_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRdsSubDistData(rds_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds/getRdsSubDistData";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rds_id !== 'undefined' && rds_id !== null) _urlParams.rds_id = rds_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {any} province_id 
   *
   * @param {any} district_id 
   *
   * @param {any} mun_id 
   *
   * @param {any} subdistrict_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getRdsSubDistData2(province_id: any = {}, district_id: any = {}, mun_id: any = {}, subdistrict_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_rds/getRdsSubDistData2";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof province_id !== 'undefined' && province_id !== null) _urlParams.province_id = province_id;
    if (typeof district_id !== 'undefined' && district_id !== null) _urlParams.district_id = district_id;
    if (typeof mun_id !== 'undefined' && mun_id !== null) _urlParams.mun_id = mun_id;
    if (typeof subdistrict_id !== 'undefined' && subdistrict_id !== null) _urlParams.subdistrict_id = subdistrict_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `App_rds`.
   */
  public getModelName() {
    return "App_rds";
  }
}
