import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntrepriseDashboardRoutingModule } from './entreprise-dashboard-routing.module';
import { EntrepriseDashboardComponent } from './entreprise-dashboard/entreprise-dashboard.component';


@NgModule({
  declarations: [
    EntrepriseDashboardComponent
  ],
  imports: [
    CommonModule,
    EntrepriseDashboardRoutingModule
  ]
})
export class EntrepriseDashboardModule { }
