import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnqueteService } from 'src/app/_services/Enquete/enquete.service';
import { EntrepriseService } from 'src/app/_services/Entreprise/entreprise.service';
import { QuestionService } from 'src/app/_services/Question/question.service';
import { ReponseService } from 'src/app/_services/Reponse/reponse.service';

@Component({
  selector: 'app-enquetes-repondues-details',
  templateUrl: './enquetes-repondues-details.component.html',
  styleUrls: ['./enquetes-repondues-details.component.css']
})
export class EnquetesReponduesDetailsComponent implements OnInit {
  enqueteId!: string;
  entrepriseId!: string;
  questions: any[] = [];
  reponses: any[] = [];
  enquete: any;
  loading = true;
  userid: string = '';
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private reponseService: ReponseService,
    private enqueteService: EnqueteService,
    private entrepriseService: EntrepriseService
  ) {}

  ngOnInit(): void {
    this.enqueteId = this.route.snapshot.queryParamMap.get('id') || '';
    this.userid = localStorage.getItem('Id_Key') || '';

    this.getOneEntreprise();
  }


    getOneEntreprise() {
    this.entrepriseService.getOneEntreprise(this.userid).subscribe({
      next: (value) => {
        this.entrepriseId = value.id;
        this.loadData(this.entrepriseId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadData(entrepriseId:any) {
    this.enqueteService.getEnqueteById(this.enqueteId).subscribe(enquete => {
      this.enquete = enquete;
    });

    this.questionService.getQuestionByEnquete_id(this.enqueteId).subscribe(qs => {
      this.questions = qs;
    });

    this.reponseService
      .getReponsesByEnqueteAndEntreprise(this.enqueteId, entrepriseId)
      .subscribe(rep => {
        this.reponses = rep;
        this.loading = false;
      });
  }

  getReponseForQuestion(qid: string): string {
    const rep = this.reponses.find((r) => r.question_id === qid);
    return rep ? rep.valeur : 'Aucune réponse';
  }
}