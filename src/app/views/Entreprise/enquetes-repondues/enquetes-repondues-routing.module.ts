import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnquetesReponduesComponent } from './enquetes-repondues/enquetes-repondues.component';

const routes: Routes = [
  {path:'',component:EnquetesReponduesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnquetesReponduesRoutingModule { }
