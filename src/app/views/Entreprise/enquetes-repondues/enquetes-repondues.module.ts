import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnquetesReponduesRoutingModule } from './enquetes-repondues-routing.module';
import { EnquetesReponduesComponent } from './enquetes-repondues/enquetes-repondues.component';


@NgModule({
  declarations: [
    EnquetesReponduesComponent
  ],
  imports: [
    CommonModule,
    EnquetesReponduesRoutingModule
  ]
})
export class EnquetesReponduesModule { }
