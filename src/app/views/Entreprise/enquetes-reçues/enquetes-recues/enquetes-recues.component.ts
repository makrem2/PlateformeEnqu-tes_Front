import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnqueteService } from 'src/app/_services/Enquete/enquete.service';
import { EntrepriseService } from 'src/app/_services/Entreprise/entreprise.service';
import { QuestionService } from 'src/app/_services/Question/question.service';
import { ReponseService } from 'src/app/_services/Reponse/reponse.service';

@Component({
  selector: 'app-enquetes-recues',
  templateUrl: './enquetes-recues.component.html',
  styleUrls: ['./enquetes-recues.component.css'],
})
export class EnquetesRecuesComponent implements OnInit {
  form!: FormGroup;
  questions: any[] = [];
  enqueteId!: string;
  entrepriseId: any;
  userid: any;
  Enquete: any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private entrepriseService: EntrepriseService,
    private enqueteService: EnqueteService,
    private toastr: ToastrService,
    private router: Router,
    private reponseService: ReponseService
  ) {}

  ngOnInit(): void {
    this.enqueteId = this.route.snapshot.queryParamMap.get('id') || '0';

    if (this.enqueteId == '0') {
      this.toastr.error(
        '❌ Erreur',
        'Veuillez sélectionner une enquête valide.'
      );
      setTimeout(() => {
        this.router.navigate(['/entreprise']);
      }, 3000);
    }

    this.userid = localStorage.getItem('Id_Key');

    this.getQuestionByEnquete_id();
    this.getOneEntreprise();
    this.getEnqueteById();
  }

  getEnqueteById() {
    this.enqueteService.getEnqueteById(this.enqueteId).subscribe({
      next: (value) => {
        this.Enquete = value;
        console.log(this.Enquete);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getQuestionByEnquete_id() {
    this.questionService
      .getQuestionByEnquete_id(this.enqueteId)
      .subscribe((data) => {
        this.questions = data;
        this.initForm();
      });
  }

  getOneEntreprise() {
    this.entrepriseService.getOneEntreprise(this.userid).subscribe({
      next: (value) => {
        this.entrepriseId = value.id;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  initForm() {
    const group: any = {};
    this.questions.forEach((q) => {
      group[q.question_id] = [''];
    });
    this.form = this.fb.group(group);
  }

  onSubmit() {
    const values = this.form.value;
    const payload = {
      entreprise_id: this.entrepriseId,
      enquete_id: this.enqueteId,
      reponses: Object.entries(values).map(([question_id, valeur]) => ({
        question_id,
        valeur,
      })),
    };

    this.reponseService.createReponse(payload).subscribe({
      next: (value) => {
        this.toastr.success(
          '✅ Succès',
          'Vos réponses ont été envoyées avec succès.'
        );
        console.log(value);
      },
      error: (err) => {
        this.toastr.error(err.error.message, '❌ Erreur');
      },
    });
  }
}
