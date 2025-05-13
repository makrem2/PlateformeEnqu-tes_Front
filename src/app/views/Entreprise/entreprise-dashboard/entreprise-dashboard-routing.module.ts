import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrepriseDashboardComponent } from './entreprise-dashboard/entreprise-dashboard.component';

const routes: Routes = [
  {path:'',component:EntrepriseDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntrepriseDashboardRoutingModule { }
