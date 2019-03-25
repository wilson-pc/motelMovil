import { ProfileUserPage } from './../pages/profile-user/profile-user';
import { SocketUsuarioService2 } from './../services/socket-config.service';
import { RegisterRoomPage } from './../pages/register-room/register-room';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {GooglePlus} from '@ionic-native/google-plus'
import { ListPage } from '../pages/list/list';
import {AndroidPermissions} from '@ionic-native/android-permissions'
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
import { ActivityService } from '../services/activity-service';
import { TripService } from '../services/trip-service';
import { WeatherProvider } from '../services/weather';
import {FileChooser} from '@ionic-native/file-chooser';
import { ImagePicker } from '@ionic-native/image-picker';
import { AuthProvider } from '../providers/auth/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { LicoreriaPage } from '../pages/licoreria/licoreria';
import { TopsPage } from '../pages/tops/tops';
import { MotelPage } from '../pages/motel/motel';
import { SexShopPage } from '../pages/sex-shop/sex-shop';
import { CercaDeMiPage } from '../pages/cerca-de-mi/cerca-de-mi';
import { TabsPage } from '../pages/tabs/tabs';
import { MapsPage } from '../pages/maps/maps';
import { ListaDeseosPage } from '../pages/lista-deseos/lista-deseos';
import { ListaReservasPage } from '../pages/lista-reservas/lista-reservas';
import { ListaFavoritosPage } from '../pages/lista-favoritos/lista-favoritos';
import { DescripcionProductoPage } from '../pages/descripcion-producto/descripcion-producto';
import { ProviderProductosProvider } from '../providers/provider-productos/provider-productos';
import { SocketConfigService, SocketLoginService } from '../services/socket-config.service';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { IonicStorageModule } from '@ionic/storage';
import { EditLoginPage } from '../pages/edit-login/edit-login';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { DescriptionMotelPage } from '../pages/description-motel/description-motel';
import { DescriptionLicoreriaPage } from '../pages/description-licoreria/description-licoreria';
import { DescriptionSexshopPage } from '../pages/description-sexshop/description-sexshop';

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
    LicoreriaPage,
    TopsPage,
    MotelPage,
    SexShopPage,
    CercaDeMiPage,
    TabsPage,
    MapsPage,
    ListaDeseosPage,
    ListaReservasPage,
    ListaFavoritosPage,
    ProfileUserPage,
    DescripcionProductoPage,
    DescriptionMotelPage,
    DescriptionLicoreriaPage,
    DescriptionSexshopPage,
    EditUserPage,
    EditLoginPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp,{
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig,'demo104'),
    AngularFireDatabaseModule
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
    LicoreriaPage,
    TopsPage,
    MotelPage,
    SexShopPage,
    CercaDeMiPage,
    TabsPage,
    MapsPage,
    ListaDeseosPage,
    ListaReservasPage,
    ListaFavoritosPage,
    DescripcionProductoPage,
    DescriptionMotelPage,
    DescriptionLicoreriaPage,
    DescriptionSexshopPage,
    EditUserPage,
    ProfileUserPage,
    EditLoginPage
  
  ],
  providers: [
    StatusBar,
    ActivityService,
    TripService,
    WeatherProvider,
    Facebook,
    FileChooser,
    SplashScreen,
    ImagePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    GooglePlus,
    AndroidPermissions,
    ProviderProductosProvider,
    SocketUsuarioService2,
    SocketConfigService,
    SocketLoginService,
    UsuarioProvider
  ]
})
export class AppModule {}
