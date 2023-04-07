import { ChatgptComponent } from './pages/chatgpt/chatgpt.component';
import { ShareModule } from './share.module';
import { ChatComponent } from './components/chat/chat.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeRoutingModule } from './pages/home/home-routing.module';
import { ReelComponent } from './pages/reel/reel.component';
import { FirstPageComponent } from './pages/first-page/first-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHouse, faBell, faAngleDown, faPhotoFilm, faEllipsis, faPhone, faVideo, faWindowMinimize, faXmark, faCirclePlus, faPaperPlane, faMinus, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faBell as faBell2 } from '@fortawesome/free-regular-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@NgModule({
  declarations: [
    HomeComponent,
    FirstPageComponent,
    ReelComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    ChatComponent,
    ChatgptComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FontAwesomeModule,
    NzModalModule,
    NzButtonModule,
    BrowserAnimationsModule,
    NzAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzBadgeModule,
    ShareModule,
    NzCollapseModule,
  ]
})
export class HomeModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faHouse,
      faFacebookMessenger,
      faBell,
      faBell2,
      faAngleDown,
      faPhotoFilm,
      faEllipsis,
      faPhone, faVideo, faWindowMinimize, faXmark, faCirclePlus, faPaperPlane, faMinus, faCircle
    );
  }
}
