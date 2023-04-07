
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { PersonalComponent } from './pages/personal/personal.component';
import { HomeModule } from './home.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { faHouse, faBell, faAngleDown, faPhotoFilm, faEllipsis, faThumbsUp, faMessage, faMagnifyingGlass, faCamera, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import { faBell as faBell2, faThumbsUp as faThumbsUp2, faShareSquare, faHeart, faFaceLaughSquint, faFaceFrown, faFaceAngry, faFaceSurprise } from '@fortawesome/free-regular-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { environment } from "./environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ShareModule } from './share.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PersonalComponent,
    SubHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NzAutocompleteModule,
    NzGridModule,
    NzMenuModule,
    NzMessageModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, "cloud"),
    ImageCropperModule,
    NzModalModule,
    NzButtonModule,
    ShareModule,
    NzTabsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faHouse,
      faFacebookMessenger,
      faBell,
      faBell2,
      faAngleDown,
      faPhotoFilm,
      faEllipsis,
      faThumbsUp,
      faThumbsUp2,
      faMessage,
      faShareSquare,
      faMagnifyingGlass,
      faCamera,faHeart, faFaceLaughSquint, 
      faFaceFrown, faFaceAngry, faFaceSurprise,
      faLocationDot, faClock,
    );
  }
}
