import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilisateursRoutingModule } from './utilisateurs-routing.module';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { AdminFilterUserPipe } from './Admin-filter-user.pipe';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UtilisateursComponent,
    AdminFilterUserPipe
  ],
  imports: [
    CommonModule,
    UtilisateursRoutingModule,
    FormsModule
  ]
})
export class UtilisateursModule { }
