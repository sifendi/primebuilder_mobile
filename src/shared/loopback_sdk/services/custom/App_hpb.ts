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
import { App_hpb } from '../../models/App_hpb';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `App_hpb` model.
 */
@Injectable()
export class App_hpbApi extends BaseLoopBackApi {

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
   * This usually means the response is a `App_hpb` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_hpb";
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
   * @param {any} id app_hpb id
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
   * This usually means the response is a `App_hpb` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_hpb/:id";
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
   * @param {any} hpb_id 
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
  public addEditHpb(dataArrObj: any = {}, hpb_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_hpb/addEditHpb";
    let _routeParams: any = {};
    let _postBody: any = {
      dataArrObj: dataArrObj
    };
    let _urlParams: any = {};
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {any} hpb_id 
   *
   * @param {any} created_date 
   *
   * @param {any} updated_date 
   *
   * @param {any} created_by 
   *
   * @param {any} updated_by 
   *
   * @param {any} assigned_to 
   *
   * @param {any} user_id 
   *
   * @param {any} rolename 
   *
   * @param {string} primary_mobile_no 
   *
   * @param {any} postalcode 
   *
   * @param {any} hpb_email 
   *
   * @param {any} hpb_type 
   *
   * @param {any} limit 
   *
   * @param {any} page 
   *
   * @param {string} hpb_status 
   *
   * @param {string} id_card_city_name 
   *
   * @param {string} domicile_city_name 
   *
   * @param {string} hpb_name 
   *
   * @param {object} dataArrObj 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getHpb(hpb_id: any = {}, created_date: any = {}, updated_date: any = {}, created_by: any = {}, updated_by: any = {}, assigned_to: any = {}, user_id: any = {}, rolename: any = {}, primary_mobile_no: any = {}, postalcode: any = {}, hpb_email: any = {}, hpb_type: any = {}, limit: any = {}, page: any = {}, hpb_status: any = {}, id_card_city_name: any = {}, domicile_city_name: any = {}, hpb_name: any = {}, dataArrObj: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_hpb/getHpb";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof assigned_to !== 'undefined' && assigned_to !== null) _urlParams.assigned_to = assigned_to;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof primary_mobile_no !== 'undefined' && primary_mobile_no !== null) _urlParams.primary_mobile_no = primary_mobile_no;
    if (typeof postalcode !== 'undefined' && postalcode !== null) _urlParams.postalcode = postalcode;
    if (typeof hpb_email !== 'undefined' && hpb_email !== null) _urlParams.hpb_email = hpb_email;
    if (typeof hpb_type !== 'undefined' && hpb_type !== null) _urlParams.hpb_type = hpb_type;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof hpb_status !== 'undefined' && hpb_status !== null) _urlParams.hpb_status = hpb_status;
    if (typeof id_card_city_name !== 'undefined' && id_card_city_name !== null) _urlParams.id_card_city_name = id_card_city_name;
    if (typeof domicile_city_name !== 'undefined' && domicile_city_name !== null) _urlParams.domicile_city_name = domicile_city_name;
    if (typeof hpb_name !== 'undefined' && hpb_name !== null) _urlParams.hpb_name = hpb_name;
    if (typeof dataArrObj !== 'undefined' && dataArrObj !== null) _urlParams.dataArrObj = dataArrObj;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {any} hpb_id 
   *
   * @param {any} created_date 
   *
   * @param {any} updated_date 
   *
   * @param {any} created_by 
   *
   * @param {any} updated_by 
   *
   * @param {any} assigned_to 
   *
   * @param {any} user_id 
   *
   * @param {any} rolename 
   *
   * @param {string} primary_mobile_no 
   *
   * @param {any} postalcode 
   *
   * @param {any} hpb_email 
   *
   * @param {any} hpb_type 
   *
   * @param {any} limit 
   *
   * @param {any} page 
   *
   * @param {string} hpb_status 
   *
   * @param {string} id_card_city_name 
   *
   * @param {string} domicile_city_name 
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
  public getHpbCount(hpb_id: any = {}, created_date: any = {}, updated_date: any = {}, created_by: any = {}, updated_by: any = {}, assigned_to: any = {}, user_id: any = {}, rolename: any = {}, primary_mobile_no: any = {}, postalcode: any = {}, hpb_email: any = {}, hpb_type: any = {}, limit: any = {}, page: any = {}, hpb_status: any = {}, id_card_city_name: any = {}, domicile_city_name: any = {}, hpb_name: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_hpb/getHpbCount";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    if (typeof created_date !== 'undefined' && created_date !== null) _urlParams.created_date = created_date;
    if (typeof updated_date !== 'undefined' && updated_date !== null) _urlParams.updated_date = updated_date;
    if (typeof created_by !== 'undefined' && created_by !== null) _urlParams.created_by = created_by;
    if (typeof updated_by !== 'undefined' && updated_by !== null) _urlParams.updated_by = updated_by;
    if (typeof assigned_to !== 'undefined' && assigned_to !== null) _urlParams.assigned_to = assigned_to;
    if (typeof user_id !== 'undefined' && user_id !== null) _urlParams.user_id = user_id;
    if (typeof rolename !== 'undefined' && rolename !== null) _urlParams.rolename = rolename;
    if (typeof primary_mobile_no !== 'undefined' && primary_mobile_no !== null) _urlParams.primary_mobile_no = primary_mobile_no;
    if (typeof postalcode !== 'undefined' && postalcode !== null) _urlParams.postalcode = postalcode;
    if (typeof hpb_email !== 'undefined' && hpb_email !== null) _urlParams.hpb_email = hpb_email;
    if (typeof hpb_type !== 'undefined' && hpb_type !== null) _urlParams.hpb_type = hpb_type;
    if (typeof limit !== 'undefined' && limit !== null) _urlParams.limit = limit;
    if (typeof page !== 'undefined' && page !== null) _urlParams.page = page;
    if (typeof hpb_status !== 'undefined' && hpb_status !== null) _urlParams.hpb_status = hpb_status;
    if (typeof id_card_city_name !== 'undefined' && id_card_city_name !== null) _urlParams.id_card_city_name = id_card_city_name;
    if (typeof domicile_city_name !== 'undefined' && domicile_city_name !== null) _urlParams.domicile_city_name = domicile_city_name;
    if (typeof hpb_name !== 'undefined' && hpb_name !== null) _urlParams.hpb_name = hpb_name;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {any} hpb_id 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `result` – `{object}` - 
   */
  public getHpbPoints(hpb_id: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/app_hpb/getHpbPoints";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof hpb_id !== 'undefined' && hpb_id !== null) _urlParams.hpb_id = hpb_id;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `App_hpb`.
   */
  public getModelName() {
    return "App_hpb";
  }
}
