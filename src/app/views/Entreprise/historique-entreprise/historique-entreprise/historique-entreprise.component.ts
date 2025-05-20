import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from 'src/app/_services/Entreprise/entreprise.service';
import { ReponseService } from 'src/app/_services/Reponse/reponse.service';

@Component({
  selector: 'app-historique-entreprise',
  templateUrl: './historique-entreprise.component.html',
  styleUrls: ['./historique-entreprise.component.css'],
})
export class HistoriqueEntrepriseComponent implements OnInit {
  enquetesRepondues: any[] = [];
  entrepriseId: string = '';
  userid: string = '';

  constructor(
    private reponseService: ReponseService,
    private entrepriseService: EntrepriseService
  ) {}

  ngOnInit(): void {
    this.userid = localStorage.getItem('Id_Key') || '';
    this.getOneEntreprise();
  }

  getOneEntreprise() {
    this.entrepriseService.getOneEntreprise(this.userid).subscribe({
      next: (value) => {
        this.entrepriseId = value.id;
        this.getEnquetesRepondues(this.entrepriseId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getEnquetesRepondues(entrepriseId:any) {
    this.reponseService.getAllEnquetesRepondues(entrepriseId).subscribe({
      next: (data) => {
        this.enquetesRepondues = data;
        console.log('Enquêtes répondues:', this.enquetesRepondues);
      },
      error: (err) => {
        console.error(
          'Erreur lors du chargement des enquêtes répondues :',
          err
        );
      },
    });
  }
}
