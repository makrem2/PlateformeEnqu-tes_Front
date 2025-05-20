import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntrepriseDashboardRoutingModule } from './entreprise-dashboard-routing.module';
import { EntrepriseDashboardComponent } from './entreprise-dashboard/entreprise-dashboard.component';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';

@NgModule({
  declarations: [
    EntrepriseDashboardComponent
  ],
  imports: [
    CommonModule,
    EntrepriseDashboardRoutingModule,
    BaseChartDirective
  ],
    providers: [provideCharts(withDefaultRegisterables())],
})
export class EntrepriseDashboardModule { }
