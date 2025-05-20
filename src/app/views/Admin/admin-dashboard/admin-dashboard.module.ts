import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [CommonModule, AdminDashboardRoutingModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class AdminDashboardModule {}
