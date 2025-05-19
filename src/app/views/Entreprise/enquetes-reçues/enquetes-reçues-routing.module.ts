import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnquetesRecuesComponent } from './enquetes-recues/enquetes-recues.component';

const routes: Routes = [
  {path:'',component:EnquetesRecuesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnquetesReçuesRoutingModule { }
