import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoriqueEntrepriseRoutingModule } from './historique-entreprise-routing.module';
import { HistoriqueEntrepriseComponent } from './historique-entreprise/historique-entreprise.component';


@NgModule({
  declarations: [
    HistoriqueEntrepriseComponent
  ],
  imports: [
    CommonModule,
    HistoriqueEntrepriseRoutingModule
  ]
})
export class HistoriqueEntrepriseModule { }
