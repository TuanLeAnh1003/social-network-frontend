import { AppRoutingModule } from './app-routing.module';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './components/post/post.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { CommentComponent } from './components/comment/comment.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@NgModule({
  declarations: [
    HeaderComponent,
    PostComponent,
    CommentComponent,

  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FontAwesomeModule,
    NzDropDownModule,
    NzBadgeModule,
    NzAutocompleteModule,

    FormsModule,
    ReactiveFormsModule,
    NzMenuModule,
    NzModalModule,
    NzButtonModule,
    NzCommentModule,
    NzIconModule,
    NzAvatarModule,
    NzPopoverModule,
  ],
  exports: [
    HeaderComponent,
    PostComponent,
]
})
export class ShareModule { }
