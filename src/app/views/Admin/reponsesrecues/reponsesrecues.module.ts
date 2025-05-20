import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReponsesrecuesRoutingModule } from './reponsesrecues-routing.module';
import { ReponsesrecuesComponent } from './reponsesrecues/reponsesrecues.component';


@NgModule({
  declarations: [
    ReponsesrecuesComponent
  ],
  imports: [
    CommonModule,
    ReponsesrecuesRoutingModule
  ]
})
export class ReponsesrecuesModule { }
