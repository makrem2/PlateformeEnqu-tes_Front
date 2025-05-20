import { Component, OnInit } from '@angular/core';
import { StatadminService } from 'src/app/_services/StatistiquesAdmin/statadmin.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  stat: any;

  constructor(private statadminService: StatadminService) {}

  ngOnInit(): void {
    this.getAdminStats();
    this.loadCharts();
  }

  getAdminStats() {
    this.statadminService.getAdminStats().subscribe({
      next: (data) => {
        this.stat = data;
      },
      error: (err) => {
        console.error('Erreur chargement stats admin :', err);
      },
    });
  }

  loadCharts() {
    // this.statadminService.getTotalEnquetesParEntreprise().subscribe((data) => {

    //   console.log('Total Enquetes:', data);
    //   const labels = data.map((d: any) => d.entreprise);
    //   const counts = data.map((d: any) => d.total);

    //   new Chart('enquetesParEntrepriseChart', {
    //     type: 'bar',
    //     data: {
    //       labels: labels,
    //       datasets: [
    //         {
    //           label: 'Nombre d’enquêtes',
    //           data: counts,
    //           backgroundColor: '#FF7043',
    //         },
    //       ],
    //     },
    //   });
    // });

    this.statadminService.getTauxReponseParEntreprise().subscribe((data) => {
      const labels = data.map((d: any) => d.entrepriseId);
      const taux = data.map((d: any) => d.tauxReponse);

      console.log('Taux de Réponse:', data);

      new Chart('tauxReponseEntrepriseChart', {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Taux de réponse (%)',
              data: taux,
              backgroundColor: ['#8BC34A', '#03A9F4', '#FFC107', '#E91E63'],
            },
          ],
        },
      });
    });
  }
}
