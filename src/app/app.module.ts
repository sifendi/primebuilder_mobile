
import { AppPreferences } from '@ionic-native/app-preferences';
import { HomeSlidePage } from '../pages/home-slide/home-slide';
import { SphListPage } from '../pages/sph-list/sph-list';

import { appCommonMethods } from '../providers/appCommonMethods';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Camera } from "@ionic-native/camera";
import { CallNumber } from '@ionic-native/call-number';
import { Network } from '@ionic-native/network';
import { MyApp } from './app.component';

import { SelectLanguagePage } from "../pages/select-language/select-language";
import { LoginPage } from "../pages/login/login/login";
import { ActivationRegisterPage } from "../pages/login/activation-register/activation-register";
import { OtpPage } from "../pages/login/otp/otp";
import { MobileVerifyPage } from "../pages/login/mobile-verify/mobile-verify";
import { HomePage } from '../pages/home/home';
import { PopupDemoPage } from '../pages/popup-demo/popup-demo';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FilePath } from '@ionic-native/file-path';


import { AddProjectPage } from '../pages/project/add-project/add-project';
import { ProjectFilterPage } from '../pages/project/project-filter/project-filter';
import { ProjectListPage } from '../pages/project/project-list/project-list';


import { CementBagRemovalFormPage } from '../pages/cement-bag-removal/cement-bag-removal-form/cement-bag-removal-form';
import { CementBagRemovalDetailsPage } from '../pages/cement-bag-removal/cement-bag-removal-details/cement-bag-removal-details';
import { CementBagRemovalListPage } from '../pages/cement-bag-removal/cement-bag-removal-list/cement-bag-removal-list';
import { CementBagRemovalSearchPage } from '../pages/cement-bag-removal/cement-bag-removal-search/cement-bag-removal-search';

import { DistributorRetailerVisitFormPage } from '../pages/distributor-retailer-visit/distributor-retailer-visit-form/distributor-retailer-visit-form';
import { DistributorRetailerVisitDetailsPage } from '../pages/distributor-retailer-visit/distributor-retailer-visit-details/distributor-retailer-visit-details';
import { DistributorRetailerVisitListPage } from '../pages/distributor-retailer-visit/distributor-retailer-visit-list/distributor-retailer-visit-list';
import { DistributorRetailerVisitSearchPage } from '../pages/distributor-retailer-visit/distributor-retailer-visit-search/distributor-retailer-visit-search';

import { ProductReceiptsFormPage } from '../pages/product-receipts/product-receipts-form/product-receipts-form';
import { ProductReceiptsDetailsPage } from '../pages/product-receipts/product-receipts-details/product-receipts-details';
import { ProductReceiptsListPage } from '../pages/product-receipts/product-receipts-list/product-receipts-list';
import { ProductReceiptsSearchPage } from '../pages/product-receipts/product-receipts-search/product-receipts-search';


import { ProductRequestsFormPage } from '../pages/product-request/product-requests-form/product-requests-form';
import { ProductRequestsDetailsPage } from '../pages/product-request/product-requests-details/product-requests-details';
import { ProductRequestsListPage } from '../pages/product-request/product-requests-list/product-requests-list';
import { ProductRequestsSearchPage } from '../pages/product-request/product-requests-search/product-requests-search';

import { ImageSelectPopPage } from "../pages/image-select-pop/image-select-pop";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { DigitalSignCanvasPage } from "../pages/digital-sign-canvas/digital-sign-canvas";
import { ShareService } from "../providers/ShareService";

import { TimerComponent } from '../components/timer/timer';
import { SuperTabsModule } from 'ionic2-super-tabs';

import { SrkuPage } from '../pages/srku/srku';
import { SwitchingPage } from '../pages/switching/switching';
import { MaintainPage } from '../pages/maintain/maintain';
import { NewMemberPage } from '../pages/new-member/new-member';
import { ProductStatsPage } from '../pages/product-stats/product-stats';

import { tlhSrkuPage } from "../pages/tlh/tlh-srku/tlh-srku";
import { tlhSwitchingPage } from "../pages/tlh/tlh-switching/tlh-switching";
import { tlhMaintainPage } from "../pages/tlh/tlh-maintain/tlh-maintain";
import { tlhNewMemberPage } from "../pages/tlh/tlh-new-member/tlh-new-member";

import { AcDashboardPage } from '../pages/ac/dashboard/dashboard';
import { AcCementBagRemovalDetailPage } from '../pages/ac/ac-cement-bag-removal-detail/ac-cement-bag-removal-detail';
import { AcCementBagRemovalFormPage } from '../pages/ac/ac-cement-bag-removal-form/ac-cement-bag-removal-form';
import { AcCementBagRemovalListPage } from '../pages/ac/ac-cement-bag-removal-list/ac-cement-bag-removal-list';
import { AcProductReceiptPageTab } from '../pages/ac/ac-product-receipt-tab/ac-product-receipt-tab';
import { AcAchievementsTabPage } from '../pages/ac/ac-achievements-tab/ac-achievements-tab';
import { AcAchievementsSphPage } from '../pages/ac/ac-achievements-sph/ac-achievements-sph';
import { AcAchievementsTlhPage } from '../pages/ac/ac-achievements-tlh/ac-achievements-tlh';
import { AcActivateSphListPage } from '../pages/ac/ac-activate-sph-list/ac-activate-sph-list';
import { AcReceiptDetailsPage } from '../pages/ac/receipt-details/receipt-details';
import { AcSphTlsListPage } from '../pages/ac/sph-tls-list/sph-tls-list';
import { ProductStatsAcTlhPage } from '../pages/product-stats-ac-tlh/product-stats-ac-tlh';

import { NoInternet } from '../pages/no-internet/no-internet';
import { AmDashboardPage } from '../pages/am/dashboard/dashboard';
//import { AmAchievementsTabPage } from '../pages/am/am-achievements-tab/am-achievements-tab';
//import { AmAchievementsTlhPage } from '../pages/am/am-achievements-tlh/am-achievements-tlh';
//import { AmAchievementsSphPage } from '../pages/am/am-achievements-sph/am-achievements-sph';

import { MasonDashboardPage } from '../pages/mason/dashboard/dashboard';
import { MasonReceiptListPage } from '../pages/mason/mason-receipt-list/mason-receipt-list';
import { MasonRedeemTabPage } from '../pages/mason/mason-redeem-tab/mason-redeem-tab';
import { MasonRedeemListPage } from '../pages/mason/redeem-list/redeem-list';
import { MasonRedeemHistoryPage } from '../pages/mason/redeem-history/redeem-history';
import { MasonRedeemInvoicePage } from '../pages/mason/redeem-invoice/redeem-invoice';
import { ReceiptDetailPage } from '../pages/mason/receipt-detail/receipt-detail';


import { SqlServices } from "../providers/sqlService";
import { SyncServices } from "../providers/syncServices";

import { TermsAndConditon } from "../pages/login/terms-and-conditions-page/terms-and-conditions-page";

import { TlhAchievementsPage } from '../pages/tlh/achievements/achievements';
import { TlhDashboardPage } from '../pages/tlh/dashboard/dashboard';
import { ActivateSphListPage } from '../pages/tlh/activate-sph-list/activate-sph-list';
import { TlhDetailPage } from '../pages/tlh/tlh-detail/tlh-detail';
import { TlhProductReceiptPage } from '../pages/tlh/tlh-product-receipt/tlh-product-receipt';
import { TlhReceiptDetailPage } from '../pages/tlh/tlh-receipt-detail/tlh-receipt-detail';
import { TlhSphListPage } from '../pages/tlh/tlh-sph-list/tlh-sph-list';


import { NotificationsArchivePage } from '../pages/notification/notifications-archive/notifications-archive';
import { NotificationsNewPage } from '../pages/notification/notifications-new/notifications-new';
import { NotificationsTabPage } from '../pages/notification/notifications-tab/notifications-tab';

import { SDKBrowserModule } from '../shared/loopback_sdk';
import {BusyModule} from 'angular2-busy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { ElasticModule } from 'angular2-elastic';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { addHpbFormPage } from "../pages/hpb-pages/hpb-add-form/hpb-add-form";
import { HpbListPage, HpbListContractorPage, HpbListMasonPage } from "../pages/hpb-pages/hpb-list/hpb-list";
import { HpbFilterPage } from "../pages/hpb-pages/hpb-filter/hpb-filter";
import { HpbDetailsPage } from "../pages/hpb-pages/hpb-detail/hpb-detail";
import { ProjectDetailsPage } from "../pages/project/project-details/project-details";
import { addSrkuPage } from "../pages/project/add-srku/add-srku";
import { ProjectParentTabsPage } from "../pages/project/project-parent-tab-page/project-parent-tab-page";
import { ProjectProductRequestsPage } from "../pages/project/project-product-request/project-product-request";
import { ProjectProductReceiptsPage } from "../pages/project/project-product-receipts/project-product-receipts";
import { HpbProductRequestsPage } from "../pages/hpb-pages/hpb-product-request/hpb-product-request";
import { HpbParentTabsPage } from "../pages/hpb-pages/hpb-parent-tab-page/hpb-parent-tab-page";
import { HpbProjectListPage } from "../pages/hpb-pages/hpb-project-list/hpb-project-list";
import { HpbProductReceiptsPage } from "../pages/hpb-pages/hpb-product-receipts/hpb-product-receipts";
import { TlhProductReceiptsPendingPage } from "../pages/tlh/tlh-product-receipts-pending/tlh-product-receipts-pending";

import { MbscModule, mobiscroll } from '../lib/mobiscroll/js/mobiscroll.custom.min.js'
import { VisitParentTabsPage } from "../pages/visit-pages/visit-parent-tab-page/visit-parent-tab-page";
import { VisitMasonListPage } from "../pages/visit-pages/visit-mason-list-page/visit-mason-list-page";
import { VisitContractorListPage } from "../pages/visit-pages/visit-contractor-list-page/visit-contractor-list-page";
import { AddVisitFormPage } from "../pages/visit-pages/visit-add-form/visit-add-form";
import { VisitDetailsPage } from "../pages/visit-pages/visit-detail-page/visit-detail-page";

import { DistributorListVisitPage } from "../pages/visit-pages/visit-distributor-list-page/visit-distributor-list-page";
import { RetailerListVisitPage } from "../pages/visit-pages/visit-retailer-list-page/visit-retailer-list-page";
import { DistributorRetailerDetailPage, DistributorDetail, DistributorVisitListPage } from "../pages/distributor-retailer-page/distributor-retailer-detail-page/distributor-retailer-detail-page";
import { DistributorRetailerListPage } from "../pages/distributor-retailer-page/distributor-retailer-list/distributor-retailer-list";
import { CheckInOutDirective } from "../directives/check-in-out-directive/checkInOutDirective";

import { SignaturePadModule } from 'angular2-signaturepad';

import { CustomFormsModule } from 'ng2-validation'

import { SyncPage } from "../pages/sync/sync";
import { TlhProductReceiptsAllPage } from "../pages/tlh/tlh-product-receipts-all/tlh-product-receipts-all";

import { TlhProductReceiptsTabPage } from "../pages/tlh/tlh-product-receipts-tab/tlh-product-receipts-tab";
import { TlhProjectsTabPage } from "../pages/tlh/tlh-projects-tab/tlh-projects-tab";
import { TlhProjectsPendingPage } from "../pages/tlh/tlh-projects-pending/tlh-projects-pending";
import { TlhProjectsAllPage } from "../pages/tlh/tlh-projects-all/tlh-projects-all";
import { TlhProjectDetailPage } from "../pages/tlh/tlh-project-detail/tlh-project-detail";
import { AcProductReceiptPendingPage } from "../pages/ac/ac-product-receipt-pending/ac-product-receipt-pending";
import { AcProductReceiptAllPage } from "../pages/ac/ac-product-receipt-all/ac-product-receipt-all";
import { TlhHpbDetailsPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-detail/tlh-hpb-detail";
import { TlhHpbListMasonPage, TlhHpbListContractorPage, TlhHpbListPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-list/tlh-hpb-list";
import { TlhHpbProjectListPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-project-list/tlh-hpb-project-list";
import { TlhHpbProductReceiptsPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-product-receipts/tlh-hpb-product-receipts";
import { TlhHpbProductRequestsPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-product-request/tlh-hpb-product-request";
import { TlhHpbParentTabsPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-parent-tab-page/tlh-hpb-parent-tab-page";
import { TlhHpbProjectDetailPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-project-detail/tlh-hpb-project-detail";
import { TlhHpbReceiptDetailPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-receipt-detail/tlh-hpb-receipt-detail";

import { acSwitchingPage } from "../pages/ac/ac-switching/ac-switching";
import { acSrkuPage } from "../pages/ac/ac-srku/ac-srku";
import { acNewMemberPage } from "../pages/ac/ac-new-member/ac-new-member";
import { acMaintainPage } from "../pages/ac/ac-maintain/ac-maintain";
import { tlhDistributorRetailerListPage } from "../pages/tlh/tlh-distributor-retailer-pages/tlh-distributor-retailer-list/tlh-distributor-retailer-list";
import { tlhDistributorRetailerDetailPage } from "../pages/tlh/tlh-distributor-retailer-pages/tlh-distributor-retailer-detail-page/tlh-distributor-retailer-detail-page";
import { tlhDistributorDetail,tlhDistributorVisitListPage } from "../pages/tlh/tlh-distributor-retailer-pages/tlh-distributor-retailer-detail-page/tlh-distributor-retailer-detail-page";
import { tlhVisitDetailsPage } from "../pages/tlh/tlh-distributor-retailer-pages/tlh-visit-detail-page/tlh-visit-detail-page";
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AcHpbReceiptDetailPage } from "../pages/ac/ac-hpb-pages/ac-hpb-receipt-detail/ac-hpb-receipt-detail";

import { AcHpbProjectDetailPage } from "../pages/ac/ac-hpb-pages/ac-hpb-project-detail/ac-hpb-project-detail";
import { AcHpbProductRequestsPage } from "../pages/ac/ac-hpb-pages/ac-hpb-product-request/ac-hpb-product-request";
import { AcHpbProductReceiptsPage } from "../pages/ac/ac-hpb-pages/ac-hpb-product-receipts/ac-hpb-product-receipts";
import { AcHpbParentTabsPage } from "../pages/ac/ac-hpb-pages/ac-hpb-parent-tab-page/ac-hpb-parent-tab-page";
import { AcHpbDetailsPage } from "../pages/ac/ac-hpb-pages/ac-hpb-detail/ac-hpb-detail";
import { AcHpbListPage, AcHpbListMasonPage, AcHpbListContractorPage } from "../pages/ac/ac-hpb-pages/ac-hpb-list/ac-hpb-list";
import { AcHpbProjectListPage } from "../pages/ac/ac-hpb-pages/ac-hpb-project-list/ac-hpb-project-list";
import { AcHpbProductRequestsDetailsPage } from "../pages/ac/ac-hpb-pages/ac-hpb-product-requests-details/ac-hpb-product-requests-details";
import { TlhHpbProductRequestsDetailsPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-product-requests-details/tlh-hpb-product-requests-details";
import { AcDistributorVisitListPage, AcDistributorDetail, AcDistributorRetailerDetailPage } from "../pages/ac/ac-distributor-retailer-pages/ac-distributor-retailer-detail-page/ac-distributor-retailer-detail-page";
import { AcDistributorRetailerListPage } from "../pages/ac/ac-distributor-retailer-pages/ac-distributor-retailer-list/ac-distributor-retailer-list";
import { AcVisitDetailsPage } from "../pages/ac/ac-distributor-retailer-pages/ac-visit-detail-page/ac-visit-detail-page";
import { AcHpbFilterPage } from "../pages/ac/ac-hpb-pages/ac-hpb-filter/ac-hpb-filter";
import { Device } from '@ionic-native/device';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { FileOpener } from '@ionic-native/file-opener';
import { AcProductReceiptsSearchPage } from "../pages/ac/ac-product-receipts-search/ac-product-receipts-search";
import { TlhHpbFilterPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-filter/tlh-hpb-filter";
import { TlhProductReceiptsSearchPage } from "../pages/tlh/tlh-product-receipts-search/tlh-product-receipts-search";
import { TlhProjectFilterPage } from "../pages/tlh/tlh-project-filter/tlh-project-filter";
import { TlhProductRequestsListPage } from "../pages/tlh/tlh-product-request-list/tlh-product-request-list";
import { TlhProductRequestsSearchPage } from "../pages/tlh/tlh-product-requests-search/tlh-product-requests-search";
import { AcProductRequestsSearchPage } from "../pages/ac/ac-product-requests-search/ac-product-requests-search";
import { AcProductRequestsListPage } from "../pages/ac/ac-product-request-list/ac-product-request-list";
import { AmAchievementsTabPage } from "../pages/am/am-achievements-tab/am-achievements-tab";
import { AmAchievementsTlhPage } from "../pages/am/am-achievements-tlh/am-achievements-tlh";
import { AmAchievementsSphPage } from "../pages/am/am-achievements-sph/am-achievements-sph";
import { AcProjectsAllPage } from "../pages/ac/ac-projects-all/ac-projects-all";
import { AcProjectsTabPage } from "../pages/ac/ac-projects-tab/ac-projects-tab";
import { AcProjectFilterPage } from "../pages/ac/ac-project-filter/ac-project-filter";
import { AcProjectsPendingPage } from "../pages/ac/ac-projects-pending/ac-projects-pending";
import { AcProjectDetailPage } from "../pages/ac/ac-project-detail/ac-project-detail";
import { AcProjectEditPage } from "../pages/ac/ac-project-edit/ac-project-edit";
import { amSrkuPage } from "../pages/am/am-srku/am-srku";
import { amSwitchingPage } from "../pages/am/am-switching/am-switching";
import { amMaintainPage } from "../pages/am/am-maintain/am-maintain";
import { amNewMemberPage } from "../pages/am/am-new-member/am-new-member";
import { TlhDistributorRetailerSearchPage } from "../pages/tlh/tlh-distributor-retailer-pages/tlh-distributor-retailer-search/tlh-distributor-retailer-search";
import { AcDistributorRetailerSearchPage } from "../pages/ac/ac-distributor-retailer-pages/ac-distributor-retailer-search/ac-distributor-retailer-search";
import { AcCementBagRemovalSearchPage } from "../pages/ac/ac-cement-bag-removal-search/ac-cement-bag-removal-search";
import { DisallowRootPage } from "../pages/disallow-root/disallow-root";

/* EAP Page : Start  */
import { EapLeadList } from "../pages/eap-sph/eap-lead-list/eap-lead-list";
import { EapLeadDetails } from "../pages/eap-sph/eap-lead-details/eap-lead-details";
import { EapLeadChat } from "../pages/eap-sph/eap-lead-chat/eap-lead-chat";
import { EapLeadSearchModal } from "../pages/eap-sph/eap-lead-list-search-modal/eap-lead-list-search-modal";


import { EapLeadListAc } from "../pages/ac/eap-ac/eap-lead-list-ac/eap-lead-list-ac";
import { EapLeadDetailsAc } from "../pages/ac/eap-ac/eap-lead-details-ac/eap-lead-details-ac";
import { EapLeadChatAc } from "../pages/ac/eap-ac/eap-lead-chat-ac/eap-lead-chat-ac";
import { EapLeadSearchModalAc } from "../pages/ac/eap-ac/eap-lead-list-search-modal-ac/eap-lead-list-search-modal-ac";


import { EapLeadListTlh } from "../pages/tlh/eap-tlh/eap-lead-list-tlh/eap-lead-list-tlh";
import { EapLeadDetailsTlh } from "../pages/tlh/eap-tlh/eap-lead-details-tlh/eap-lead-details-tlh";
import { EapLeadChatTlh } from "../pages/tlh/eap-tlh/eap-lead-chat-tlh/eap-lead-chat-tlh";
import { EapLeadSearchModalTlh } from "../pages/tlh/eap-tlh/eap-lead-list-search-modal-tlh/eap-lead-list-search-modal-tlh";

/* EAP Page : End  */

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MobileVerifyPage,
    OtpPage,
    ActivationRegisterPage,
    addHpbFormPage,
    HpbListPage,
    HpbFilterPage,
    HpbDetailsPage,
    AddProjectPage,
    ProjectFilterPage,
    ProjectListPage,
    addSrkuPage,
    ProjectDetailsPage,
    CementBagRemovalFormPage,
    CementBagRemovalDetailsPage,
    CementBagRemovalListPage,
    CementBagRemovalSearchPage,
    DistributorRetailerVisitFormPage,
    DistributorRetailerVisitDetailsPage,
    DistributorRetailerVisitListPage,
    DistributorRetailerVisitSearchPage,
    ProductReceiptsFormPage,
    ProductReceiptsDetailsPage,
    ProductReceiptsListPage,
    ProductReceiptsSearchPage,
    ProductRequestsFormPage,
    ProductRequestsDetailsPage,
    ProductRequestsListPage,
    ProductRequestsSearchPage,
    ImageSelectPopPage,
    DigitalSignCanvasPage,
    TimerComponent,
    SrkuPage,
    SwitchingPage,
    MaintainPage,
    NewMemberPage,
    ProductStatsPage,
    ProductStatsAcTlhPage,
    tlhSrkuPage,
    tlhSwitchingPage,
    tlhMaintainPage,
    tlhNewMemberPage,
    acSrkuPage,
    acSwitchingPage,
    acMaintainPage,
    acNewMemberPage,
    amSrkuPage,
    amSwitchingPage,
    amMaintainPage,
    amNewMemberPage,
    SelectLanguagePage,
    TermsAndConditon,
    HpbListContractorPage,
    HpbListMasonPage,
    AcDashboardPage,
    AcAchievementsTabPage,
    AcAchievementsSphPage,
    AcAchievementsTlhPage,
    AcActivateSphListPage,
    AcSphTlsListPage,
    AmDashboardPage,
    AmAchievementsTabPage,
    AmAchievementsSphPage,
    AmAchievementsTlhPage,
    AcAchievementsTabPage,
    AcAchievementsSphPage,
    AcAchievementsTlhPage,
    MasonDashboardPage,
    MasonReceiptListPage,
    MasonRedeemListPage,
    MasonRedeemHistoryPage,
    MasonRedeemInvoicePage,   
    SphListPage,
    HomeSlidePage,
    DistributorDetail,
    DistributorVisitListPage,
    AcDashboardPage,
    AcCementBagRemovalDetailPage,
    AcCementBagRemovalFormPage,
    AcCementBagRemovalListPage,
    AcProductReceiptPageTab,
    AcReceiptDetailsPage,
    AcSphTlsListPage,
    TlhAchievementsPage,
    TlhDashboardPage,
    ActivateSphListPage,
    TlhDetailPage,
    TlhProductReceiptPage,
    TlhReceiptDetailPage,
    TlhSphListPage,
    MasonRedeemTabPage,
    TlhProductReceiptsAllPage,
    TlhProductReceiptsPendingPage,
    NotificationsArchivePage,
    NotificationsNewPage,
    NotificationsTabPage,
    TlhProductReceiptsTabPage,
    PopupDemoPage,
    ProjectParentTabsPage,
    ProjectProductRequestsPage,
    ProjectProductReceiptsPage,
    HpbProductRequestsPage,
    HpbProductReceiptsPage,
    HpbParentTabsPage,
    HpbProjectListPage,
    VisitParentTabsPage,
    VisitMasonListPage,
    VisitContractorListPage,
    AddVisitFormPage,
    VisitDetailsPage,
    DistributorRetailerDetailPage,
    DistributorListVisitPage,
    RetailerListVisitPage,
    DistributorRetailerListPage,
    tlhDistributorRetailerListPage,
    tlhDistributorRetailerDetailPage,
    tlhDistributorDetail,
    tlhDistributorVisitListPage,
    CheckInOutDirective,
    NoInternet,
    ReceiptDetailPage,
    SyncPage,
    TlhProjectsTabPage,
    TlhProjectsPendingPage,
    TlhProjectsAllPage,
    TlhProjectDetailPage,
    AcProductReceiptPendingPage,
    AcProductReceiptAllPage,
    TlhHpbDetailsPage,
    TlhHpbListMasonPage,
    TlhHpbListContractorPage,
    TlhHpbProjectListPage,
    TlhHpbProductReceiptsPage,
    TlhHpbProductRequestsPage,
    TlhHpbListPage,
    TlhHpbParentTabsPage,
    TlhHpbProjectDetailPage,
    TlhHpbReceiptDetailPage,
    tlhVisitDetailsPage,
    AcHpbReceiptDetailPage,
    AcHpbProjectListPage,
    AcHpbProjectDetailPage,
    AcHpbProductRequestsPage,
    AcHpbProductReceiptsPage,
    AcHpbParentTabsPage,
    AcHpbDetailsPage,
    AcHpbListPage,
    AcHpbListMasonPage,
    AcHpbListContractorPage,
    AcHpbProductRequestsDetailsPage,
    TlhHpbProductRequestsDetailsPage,
    AcDistributorVisitListPage,
    AcDistributorDetail,
    AcDistributorRetailerDetailPage,
    AcDistributorRetailerListPage,
    AcVisitDetailsPage,
    AcHpbFilterPage,
    AcProductReceiptsSearchPage,
    TlhHpbFilterPage,
    TlhProductReceiptsSearchPage,
    TlhProjectFilterPage,
    TlhProductRequestsListPage,
    TlhProductRequestsSearchPage,
    AcProductRequestsListPage,
    AcProductRequestsSearchPage,
    AcProjectsAllPage,
    AcProjectsTabPage,
    AcProjectFilterPage,
    AcProjectsPendingPage,
    AcProjectDetailPage,
    AcProjectEditPage,
    TlhDistributorRetailerSearchPage,
    AcDistributorRetailerSearchPage,
    AcCementBagRemovalSearchPage,
    DisallowRootPage,
    EapLeadList,
    EapLeadDetails,
    EapLeadChat,
    EapLeadSearchModal,
    EapLeadListAc,
    EapLeadDetailsAc,
    EapLeadChatAc,
    EapLeadSearchModalAc,
    EapLeadListTlh,
    EapLeadDetailsTlh,
    EapLeadChatTlh,
    EapLeadSearchModalTlh
  ],
  imports: [
    BrowserModule,
//    ElasticModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MbscModule,
    SignaturePadModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    IonicStorageModule.forRoot(),
    SDKBrowserModule.forRoot(),
    BusyModule,
    CustomFormsModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MobileVerifyPage,
    OtpPage,
    ActivationRegisterPage,
    addHpbFormPage,
    HpbListPage,
    HpbFilterPage,
    HpbDetailsPage,
    AddProjectPage,
    ProjectFilterPage,
    ProjectListPage,
    addSrkuPage,
    ProjectDetailsPage,
    CementBagRemovalFormPage,
    CementBagRemovalDetailsPage,
    CementBagRemovalListPage,
    CementBagRemovalSearchPage,
    DistributorRetailerVisitFormPage,
    DistributorRetailerVisitDetailsPage,
    DistributorRetailerVisitListPage,
    DistributorRetailerVisitSearchPage,
    ProductReceiptsFormPage,
    ProductReceiptsDetailsPage,
    ProductReceiptsListPage,
    ProductReceiptsSearchPage,
    ProductRequestsFormPage,
    ProductRequestsDetailsPage,
    ProductRequestsListPage,
    ProductRequestsSearchPage,
    ImageSelectPopPage,
    DigitalSignCanvasPage,
    SrkuPage,
    SwitchingPage,
    MaintainPage,
    NewMemberPage,
    ProductStatsPage,
    ProductStatsAcTlhPage,
    tlhSrkuPage,
    tlhSwitchingPage,
    tlhMaintainPage,
    tlhNewMemberPage,
    acSrkuPage,
    acSwitchingPage,
    acMaintainPage,
    acNewMemberPage,
    amSrkuPage,
    amSwitchingPage,
    amMaintainPage,
    amNewMemberPage,    
    SelectLanguagePage,
    TermsAndConditon,
    HpbListContractorPage,
    HpbListMasonPage,
    AcDashboardPage,
    AcAchievementsTabPage,
    AcAchievementsSphPage,
    AcAchievementsTlhPage,
    AcActivateSphListPage,
    AcSphTlsListPage,
    AmDashboardPage,
    AmAchievementsTabPage,
    AmAchievementsSphPage,
    AmAchievementsTlhPage,
    AcAchievementsTabPage,
    AcAchievementsSphPage,
    AcAchievementsTlhPage,
    MasonDashboardPage,
    MasonReceiptListPage,
    MasonRedeemListPage,
    MasonRedeemHistoryPage,
    MasonRedeemInvoicePage,
    SphListPage,
    HomeSlidePage,
    DistributorDetail,
    DistributorVisitListPage,
    AcDashboardPage,
    AcCementBagRemovalDetailPage,
    AcCementBagRemovalFormPage,
    AcCementBagRemovalListPage,
    AcProductReceiptPageTab,
    AcReceiptDetailsPage,
    AcSphTlsListPage,
    TlhAchievementsPage,
    TlhDashboardPage,
    ActivateSphListPage,
    TlhDetailPage,
    TlhProductReceiptPage,
    TlhReceiptDetailPage,
    TlhSphListPage,    
    MasonRedeemTabPage,
    TlhProductReceiptsAllPage,
    TlhProductReceiptsTabPage,
    TlhProductReceiptsPendingPage,
    NotificationsArchivePage,
    NotificationsNewPage,
    NotificationsTabPage,
    PopupDemoPage,
    ProjectParentTabsPage,
    ProjectProductRequestsPage,
    ProjectProductReceiptsPage,
    HpbProductRequestsPage,
    HpbProductReceiptsPage,
    HpbParentTabsPage,
    HpbProjectListPage,
    VisitParentTabsPage,
    VisitMasonListPage,
    VisitContractorListPage,
    AddVisitFormPage,
    VisitDetailsPage,
    DistributorRetailerDetailPage,
    DistributorListVisitPage,
    RetailerListVisitPage,
    DistributorRetailerListPage,
    tlhDistributorRetailerListPage,
    tlhDistributorRetailerDetailPage,
    tlhDistributorDetail,
    tlhDistributorVisitListPage,
    NoInternet,
    ReceiptDetailPage,
    SyncPage,
    TlhProjectsTabPage,
    TlhProjectsPendingPage,
    TlhProjectsAllPage,
    TlhProjectDetailPage,
    AcProductReceiptPendingPage,
    AcProductReceiptAllPage,
    TlhHpbDetailsPage,
    TlhHpbListMasonPage,
    TlhHpbListContractorPage,
    TlhHpbProjectListPage,
    TlhHpbProductReceiptsPage,
    TlhHpbProductRequestsPage,
    TlhHpbListPage,
    TlhHpbParentTabsPage,
    TlhHpbProjectDetailPage,
    TlhHpbReceiptDetailPage,
    tlhVisitDetailsPage,
    AcHpbReceiptDetailPage,
    AcHpbProjectListPage,
    AcHpbProjectDetailPage,
    AcHpbProductRequestsPage,
    AcHpbProductReceiptsPage,
    AcHpbParentTabsPage,
    AcHpbDetailsPage,
    AcHpbListPage,
    AcHpbListMasonPage,
    AcHpbListContractorPage,
    AcHpbProductRequestsDetailsPage,
    TlhHpbProductRequestsDetailsPage,
    AcDistributorVisitListPage,
    AcDistributorDetail,
    AcDistributorRetailerDetailPage,
    AcDistributorRetailerListPage,
    AcVisitDetailsPage,
    AcHpbFilterPage,
    AcProductReceiptsSearchPage,
    TlhHpbFilterPage,
    TlhProductReceiptsSearchPage,
    TlhProjectFilterPage,
    TlhProductRequestsListPage,
    TlhProductRequestsSearchPage,
    AcProductRequestsListPage,
    AcProductRequestsSearchPage,
    AcProjectsAllPage,
    AcProjectsTabPage,
    AcProjectFilterPage,
    AcProjectsPendingPage,
    AcProjectDetailPage,
    AcProjectEditPage,
    TlhDistributorRetailerSearchPage,
    AcDistributorRetailerSearchPage,
    AcCementBagRemovalSearchPage,
    DisallowRootPage,
    EapLeadList,
    EapLeadDetails,
    EapLeadChat,
    EapLeadSearchModal,
    EapLeadListAc,
    EapLeadDetailsAc,
    EapLeadChatAc,
    EapLeadSearchModalAc,
    EapLeadListTlh,
    EapLeadDetailsTlh,
    EapLeadChatTlh,
    EapLeadSearchModalTlh
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Geolocation,
    NativeGeocoder,
    File,
    Transfer,
    CallNumber,
    appCommonMethods,
    ShareService,
    SqlServices,
    SyncServices,
    AppPreferences,
    Network,
    FileChooser ,
    FilePath,
    UniqueDeviceID,
    Device,
    FileOpener,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
export { mobiscroll }