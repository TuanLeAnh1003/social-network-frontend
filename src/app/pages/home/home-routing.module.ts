import { ChatgptComponent } from './../chatgpt/chatgpt.component';
import { AuthGuard } from './../../guards/auth.guard';
import { ReelComponent } from '../reel/reel.component';
import { FirstPageComponent } from '../first-page/first-page.component';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'first-page',
        component: FirstPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'reel',
        component: ReelComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'chatgpt',
        component: ChatgptComponent,
        canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule { }
