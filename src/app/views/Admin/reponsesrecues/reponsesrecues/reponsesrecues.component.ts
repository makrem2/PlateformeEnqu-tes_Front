import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReponseService } from 'src/app/_services/Reponse/reponse.service';

@Component({
  selector: 'app-reponsesrecues',
  templateUrl: './reponsesrecues.component.html',
  styleUrls: ['./reponsesrecues.component.css'],
})
export class ReponsesrecuesComponent implements OnInit {
  data: any[] = [];
  loading = true;
  enqueteId: string | null = null;

  constructor(
    private reponseService: ReponseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.enqueteId = this.route.snapshot.queryParamMap.get('id');
    if (this.enqueteId) {
      this.reponseService.getReponsesParEnqueteParEntreprise(this.enqueteId).subscribe({
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
}
