import { Component, OnInit } from '@angular/core';
import { ReponseService } from 'src/app/_services/Reponse/reponse.service';

@Component({
  selector: 'app-reponsesrecues',
  templateUrl: './reponsesrecues.component.html',
  styleUrls: ['./reponsesrecues.component.css'],
})
export class ReponsesrecuesComponent implements OnInit {
  data: any[] = [];
  loading = true;

  constructor(private reponseService: ReponseService) {}

  ngOnInit(): void {
    this.reponseService.getAllReponsesParEntreprise().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des réponses', err);
        this.loading = false;
      },
    });
  }
}
