import { EditProductPage } from './../pages/edit-product/edit-product';
import { EditLoginPage } from './../pages/edit-login/edit-login';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LongPressModule } from 'ionic-long-press';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NotificationsPage } from '../pages/notifications/notifications';
import { LoginPage } from '../pages/login/login';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { SocketIoModule} from 'ng-socket-io';
import {FileChooser} from '@ionic-native/file-chooser';
import { ImagePicker } from '@ionic-native/image-picker';
import { CommercePage } from '../pages/commerce/commerce';
import { 
  SocketServiceCommerce, 
  SocketServiceHomeService, 
  SocketServiceProduct, 
  SocketServiceUser, 
  SocketServiceComportamiento, 
  SocketServiceReserva} from '../providers/socket-config/socket-config';
import { UserOnlyProvider } from '../providers/user-only/user-only';
import { ListProductsPage } from '../pages/list-products/list-products';
import { CommerceProvider } from '../providers/commerce/commerce';
import { RegisterProductsPage } from '../pages/register-products/register-products';
import { EditProductsPage } from '../pages/edit-products/edit-products';
import { ViewProductsPage } from '../pages/view-products/view-products';
import { ProductProvider } from '../providers/product/product';
import { DenunciaPage } from '../pages/denuncia/denuncia';
import { ReservaPage } from '../pages/reserva/reserva';
import { BilleteraPage } from '../pages/billetera/billetera';
import { ModalViewStatisticsPageModule } from '../pages/modal-view-statistics/modal-view-statistics.module';
import { ReservationProvider } from '../providers/reservation/reservation';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    NotificationsPage,
    EditLoginPage,
    CommercePage,
    ListProductsPage,
    RegisterProductsPage,
    EditProductsPage,
    ViewProductsPage,
    DenunciaPage,
    BilleteraPage,
    EditProductPage,
    ReservaPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule,
    SocketIoModule,
    LongPressModule,
    IonicModule.forRoot(MyApp,{
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot({
      name: '__ionic3_start_theme',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    ModalViewStatisticsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    NotificationsPage,
    EditLoginPage,
    CommercePage,
    ListProductsPage,
    RegisterProductsPage,
    EditProductsPage,
    EditProductPage,
    ViewProductsPage,
    DenunciaPage,
    BilleteraPage,
    ReservaPage
  ],
  providers: [
    StatusBar,
    SocketIoModule,
    FileChooser,
    SocketServiceCommerce,
    SocketServiceHomeService,
    SocketServiceProduct,
    SocketServiceUser,
    SocketServiceComportamiento,
    SocketServiceReserva,
    ReservationProvider,
    SplashScreen,
    ImagePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserOnlyProvider,
    CommerceProvider,
    ProductProvider,
    ReservationProvider
  ]
})
export class AppModule {}
