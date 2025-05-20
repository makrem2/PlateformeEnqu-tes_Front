import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnquetesReponduesDetailsComponent } from './enquetes-repondues-details/enquetes-repondues-details.component';

const routes: Routes = [
  {path:'',component:EnquetesReponduesDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnquetesReponduesDetailsRoutingModule { }
