import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnquetesRoutingModule } from './enquetes-routing.module';
import { EnquetesComponent } from './enquetes/enquetes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntrepriseFilterPipe } from './EntrepriseFilter.Pipe';


@NgModule({
  declarations: [
    EnquetesComponent,
    EntrepriseFilterPipe
  ],
  imports: [
    CommonModule,
    EnquetesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EnquetesModule { }
