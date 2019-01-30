import { RegisterRoomPage } from './../pages/register-room/register-room';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingsPage } from '../pages/settings/settings';
import { CheckoutTripPage } from '../pages/checkout-trip/checkout-trip';
import { LocalWeatherPage } from '../pages/local-weather/local-weather';
import { NotificationsPage } from '../pages/notifications/notifications';
import { LoginPage } from '../pages/login/login';
import { TripDetailPage } from '../pages/trip-detail/trip-detail';
import { RegisterPage } from '../pages/register/register';
import { SearchLocationPage } from '../pages/search-location/search-location';
import { TripsPage } from '../pages/trips/trips';
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
import { SocketConfigService, SocketConfigService2, SocketConfigService3, SocketConfigHomeService } from '../providers/socket-config/socket-config';
import { CommercePage } from '../pages/commerce/commerce';

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
    ListPage,
    SettingsPage,
    CheckoutTripPage,
    LoginPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    TripsPage,
    RegisterRoomPage,
    CommercePage
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
    ListPage,
    SettingsPage,
    CheckoutTripPage,
    LoginPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    TripsPage,
    RegisterRoomPage,
    CommercePage
  ],
  providers: [
    StatusBar,
    ActivityService,
    SocketIoModule,
    TripService,
    WeatherProvider,
    FileChooser,
    SocketConfigService,SocketConfigService2,SocketConfigService3,SocketConfigHomeService,
    SplashScreen,
    ImagePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
  ]
})
export class AppModule {}
