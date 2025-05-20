import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReponsesrecuesComponent } from './reponsesrecues/reponsesrecues.component';

const routes: Routes = [
  {path:'',component:ReponsesrecuesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReponsesrecuesRoutingModule { }
