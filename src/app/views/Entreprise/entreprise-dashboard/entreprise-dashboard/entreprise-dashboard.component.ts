import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from 'src/app/_services/Entreprise/entreprise.service';
import { StatentrepriseService } from 'src/app/_services/StatistiquesEntreprise/statentreprise.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-entreprise-dashboard',
  templateUrl: './entreprise-dashboard.component.html',
  styleUrls: ['./entreprise-dashboard.component.css'],
})
export class EntrepriseDashboardComponent implements OnInit {
  entrepriseId: string = '';
  userid: string = '';
  stat: any;
  constructor(
    private statentrepriseService: StatentrepriseService,
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
        this.getEntrepriseStats(this.entrepriseId);
        this.loadCharts(this.entrepriseId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getEntrepriseStats(entrepriseId: string) {
    this.statentrepriseService.getEntrepriseStats(entrepriseId).subscribe({
      next: (data) => {
        this.stat = data;
      },
      error: (err) => {
        console.error(
          "Erreur lors du chargement des statistiques de l'entreprise :",
          err
        );
      },
    });
  }

  loadCharts(entrepriseId: string) {
    this.statentrepriseService
      .getReponsesParType(entrepriseId)
      .subscribe((data) => {
        const labels = data.map((d: any) => d.type);
        const counts = data.map((d: any) => d.count);

        new Chart('reponsesTypeChart', {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Réponses par type d’enquête',
                data: counts,
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
              },
            ],
          },
        });
      });

    this.statentrepriseService
      .getReponsesMensuelles(entrepriseId)
      .subscribe((data) => {
        const labels = data.map((d: any) => d.month);
        const totals = data.map((d: any) => d.total);

        new Chart('reponsesMensuellesChart', {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Réponses mensuelles',
                data: totals,
                borderColor: '#3f51b5',
                backgroundColor: 'rgba(63, 81, 181, 0.3)',
                fill: true,
                tension: 0.3,
              },
            ],
          },
        });
      });
  }
}
