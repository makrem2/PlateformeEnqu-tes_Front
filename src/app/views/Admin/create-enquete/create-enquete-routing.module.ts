import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEnqueteComponent } from './create-enquete/create-enquete.component';

const routes: Routes = [
  {path:'',component:CreateEnqueteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateEnqueteRoutingModule { }
