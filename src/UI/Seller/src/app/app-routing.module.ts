// components
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasTokenGuard as HasToken } from '@app-seller/shared';
import { HomeComponent } from '@app-seller/layout/home/home.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [HasToken],
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
