import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateEnqueteRoutingModule } from './create-enquete-routing.module';
import { CreateEnqueteComponent } from './create-enquete/create-enquete.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreateEnqueteComponent
  ],
  imports: [
    CommonModule,
    CreateEnqueteRoutingModule,
    ReactiveFormsModule
  ]
})
export class CreateEnqueteModule { }
