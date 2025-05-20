import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnquetesReponduesDetailsRoutingModule } from './enquetes-repondues-details-routing.module';
import { EnquetesReponduesDetailsComponent } from './enquetes-repondues-details/enquetes-repondues-details.component';


@NgModule({
  declarations: [
    EnquetesReponduesDetailsComponent
  ],
  imports: [
    CommonModule,
    EnquetesReponduesDetailsRoutingModule
  ]
})
export class EnquetesReponduesDetailsModule { }
