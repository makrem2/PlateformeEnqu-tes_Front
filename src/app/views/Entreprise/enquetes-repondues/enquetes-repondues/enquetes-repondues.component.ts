import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from 'src/app/_services/Entreprise/entreprise.service';
import { ReponseService } from 'src/app/_services/Reponse/reponse.service';

@Component({
  selector: 'app-enquetes-repondues',
  templateUrl: './enquetes-repondues.component.html',
  styleUrls: ['./enquetes-repondues.component.css'],
})
export class EnquetesReponduesComponent implements OnInit {
  entrepriseId: string = '';
  userid: string = '';
  derniereEnquete: any;
  loading: boolean = true;
  error: string | null = null;

  constructor(private reponseService: ReponseService,private entrepriseService: EntrepriseService,) {}

  ngOnInit(): void {
    this.userid = localStorage.getItem('Id_Key') || '';
    if (this.userid) {
      this.getOneEntreprise();
    } else {
      this.error = 'Entreprise ID introuvable';
      this.loading = false;
    }
  }

  
  getOneEntreprise() {
    this.entrepriseService.getOneEntreprise(this.userid).subscribe({
      next: (value) => {
        this.entrepriseId = value.id;
        this.getLastReponduEnquete(this.entrepriseId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getLastReponduEnquete(entrepriseId:any): void {
    this.reponseService
      .getDerniereEnqueteRepondue(entrepriseId)
      .subscribe({
        next: (data) => {
          this.derniereEnquete = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la récupération';
          this.loading = false;
          console.error(err);
        },
      });
  }
}
