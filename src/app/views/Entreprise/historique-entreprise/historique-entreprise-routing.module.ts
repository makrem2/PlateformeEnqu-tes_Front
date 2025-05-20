import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriqueEntrepriseComponent } from './historique-entreprise/historique-entreprise.component';

const routes: Routes = [
  {path:'',component:HistoriqueEntrepriseComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoriqueEntrepriseRoutingModule { }
