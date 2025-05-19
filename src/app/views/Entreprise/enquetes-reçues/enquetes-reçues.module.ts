import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnquetesReçuesRoutingModule } from './enquetes-reçues-routing.module';
import { EnquetesRecuesComponent } from './enquetes-recues/enquetes-recues.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EnquetesRecuesComponent
  ],
  imports: [
    CommonModule,
    EnquetesReçuesRoutingModule,
    ReactiveFormsModule
  ]
})
export class EnquetesReçuesModule { }
