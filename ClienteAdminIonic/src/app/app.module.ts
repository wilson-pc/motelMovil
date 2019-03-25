import { EditLoginPage } from './../pages/edit-login/edit-login';
import { RegisterRoomPage } from './../pages/register-room/register-room';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NotificationsPage } from '../pages/notifications/notifications';
import { LoginPage } from '../pages/login/login';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { ActivityService } from '../services/activity-service';
import { SocketIoModule,SocketIoConfig } from 'ng-socket-io';
import { TripService } from '../services/trip-service';
import { WeatherProvider } from '../services/weather';
import {FileChooser} from '@ionic-native/file-chooser';
import { ImagePicker } from '@ionic-native/image-picker';
import { AuthProvider } from '../providers/auth/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { CommercePage } from '../pages/commerce/commerce';
import { SocketServiceCommerce, SocketServiceHomeService, SocketServiceProduct, SocketServiceUser } from '../providers/socket-config/socket-config';
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

export const firebaseConfig = {
  apiKey: "AIzaSyDAlY3ozstpEbo4Q4eGoX0LAg7WhuCu8x8",
  authDomain: "hotelmovildb.firebaseapp.com",
  databaseURL: "https://hotelmovildb.firebaseio.com",
  projectId: "hotelmovildb",
  storageBucket: "hotelmovildb.appspot.com",
  messagingSenderId: "1084156115455"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    NotificationsPage,
    EditLoginPage,
    RegisterRoomPage,
    CommercePage,
    ListProductsPage,
    RegisterProductsPage,
    EditProductsPage,
    ViewProductsPage,
    DenunciaPage,
    BilleteraPage,
    ReservaPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule,
    SocketIoModule,
    IonicModule.forRoot(MyApp,{
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(firebaseConfig,'demo104'),
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot({
      name: '__ionic3_start_theme',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    NotificationsPage,
    RegisterRoomPage,
    EditLoginPage,
    CommercePage,
    ListProductsPage,
    RegisterProductsPage,
    EditProductsPage,
    ViewProductsPage,
    DenunciaPage,
    BilleteraPage,
    ReservaPage
  ],
  providers: [
    StatusBar,
    ActivityService,
    SocketIoModule,
    TripService,
    WeatherProvider,
    FileChooser,
    SocketServiceCommerce,
    SocketServiceHomeService,
    SocketServiceProduct,
    SocketServiceUser,
    SplashScreen,
    ImagePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    UserOnlyProvider,
    CommerceProvider,
    ProductProvider
  ]
})
export class AppModule {}
