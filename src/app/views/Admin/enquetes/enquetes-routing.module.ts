import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnquetesComponent } from './enquetes/enquetes.component';

const routes: Routes = [
  {path:'',component:EnquetesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnquetesRoutingModule { }
