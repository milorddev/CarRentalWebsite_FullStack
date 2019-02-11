import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ReservationComponent } from './reservation/reservation.component';

const routes: Routes = [
{ path: 'reservation', component: ReservationComponent },
{ path: 'main', component: MainComponent },
{ path: '', redirectTo:'/main', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
