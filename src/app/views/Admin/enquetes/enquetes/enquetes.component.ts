import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnqueteService } from 'src/app/_services/Enquete/enquete.service';
import { EntrepriseService } from 'src/app/_services/Entreprise/entreprise.service';
import { QuestionService } from 'src/app/_services/Question/question.service';

declare const bootstrap: any;

@Component({
  selector: 'app-enquetes',
  templateUrl: './enquetes.component.html',
  styleUrls: ['./enquetes.component.css'],
})
export class EnquetesComponent implements OnInit {
  enquetes: any[] = [];
  question: any;
  searchTerm: string = '';
  searchText: string = '';
  modalInstance: any;

  questionForm!: FormGroup;
  EnrollsEntrepriseForm!: FormGroup;
  enquete_id!: string;

  editForm!: FormGroup;
  selectedEnqueteId: string = '';

  editingQuestionId: string | null = null;

  Entreprise: any;
  constructor(
    private enqueteService: EnqueteService,
    private fb: FormBuilder,
    private questionService: QuestionService,
    private entrepriseService: EntrepriseService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.editForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    });

    this.EnrollsEntrepriseForm = this.fb.group({
      entrepriseIds: ['', Validators.required],
      id: [''],
    });
    this.loadEnquetes();
    this.GetAllEntreprise();
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      texte: ['', Validators.required],
      type: ['TEXTE', Validators.required],
      options: [''],
    });
  }

  loadEnquetes(): void {
    this.enqueteService.getAllEnquetes({}).subscribe({
      next: (res) => {
        this.enquetes = res.data || res;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des enquêtes', err);
      },
    });
  }

  GetAllEntreprise() {
    this.entrepriseService.GetAllEntreprise().subscribe({
      next: (value) => {
        this.Entreprise = value;
      },
      error: (err) => {},
    });
  }

  filteredEnquetes(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.enquetes.filter(
      (e) =>
        e.titre.toLowerCase().includes(term) ||
        e.type.toLowerCase().includes(term) ||
        e.statut.toLowerCase().includes(term)
    );
  }

  editEnquete(enquete: any): void {
    this.selectedEnqueteId = enquete.enquete_id;

    this.editForm.patchValue({
      titre: enquete.titre,
      description: enquete.description,
      type: enquete.type,
      dateDebut: enquete.dateDebut.split('T')[0], // format date
      dateFin: enquete.dateFin.split('T')[0],
    });

    const modal = new bootstrap.Modal('#editEnqueteModal');
    modal.show();
  }

  updateEnquete(): void {
    if (this.editForm.invalid) return;
    this.enqueteService
      .updateEnquete(this.selectedEnqueteId, this.editForm.value)
      .subscribe({
        next: () => {
          this.toastr.success('Enquête mise à jour avec succès ✅');
          this.closeEditModal();
          this.loadEnquetes();
        },
        error: () => this.toastr.error('Erreur lors de la mise à jour ❌'),
      });
  }
  closeEditModal(): void {
    const modalElement = document.getElementById('editEnqueteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
  closeEditModalstatus(): void {
    const modalElement = document.getElementById('changestatusToEN_COURS');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
  closeDeleteModal(): void {
    const modalElement = document.getElementById('delete');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
  closeVoirQuestionsModal(): void {
    const modalElement = document.getElementById('VoirQuestions');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }

  closeModal(): void {
    this.modalInstance.hide();
    this.questionForm.reset({ type: 'TEXTE', texte: '', options: '' });
  }

  GetEnqueteId(enquete_id: any) {
    this.enquete_id = enquete_id;
    const modalElement = document.getElementById('changestatusToEN_COURS');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  GetEnqueteIdToDelete(enquete_id: any) {
    this.enquete_id = enquete_id;
    const modalElement = document.getElementById('delete');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  deleteEnquete() {
    if (confirm('Supprimer cette enquête ?')) {
      this.enqueteService
        .deleteEnquete(this.enquete_id)
        .subscribe(() => this.loadEnquetes());
    }
  }

  openModal(enqueteId: string): void {
    this.enquete_id = enqueteId;
    const modalElement = document.getElementById('questionModal');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  onTypeChange(): void {
    const type = this.questionForm.get('type')?.value;

    if (type != 'CHOIX') {
      this.questionForm.get('options')?.setValue('');
    }
  }

  // submitQuestion(): void {
  //   if (this.questionForm.invalid) return;
  //   const { texte, type, options } = this.questionForm.value;
  //   const payload = {
  //     texte,
  //     type,
  //     options:
  //       type == 'CHOIX' && options
  //         ? options.split(',').map((opt: string) => opt.trim())
  //         : null,
  //     enquete_id: this.enquete_id,
  //   };
  //   this.questionService.createQuestion(payload).subscribe({
  //     next: () => {
  //       this.toastr.success('Question ajoutée avec succès ✅');
  //       this.closeModal();
  //     },
  //     error: () =>
  //       this.toastr.error("Erreur lors de l'ajout de la question ❌"),
  //   });
  // }

  changestatusToEN_COURS() {
    this.enqueteService.changestatusToEN_COURS(this.enquete_id).subscribe({
      next: () => {
        this.toastr.success('Enquête mise à jour avec succès ✅');
        this.closeEditModalstatus();
      },
      error: () =>
        this.toastr.error('Erreur lors de la mise à jour du statut ❌'),
    });
  }

  VoirQuestions(enqueteId: any) {
    this.enquete_id = enqueteId;
    const modalElement = document.getElementById('VoirQuestions');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();

    this.questionService.getQuestionByEnquete_id(this.enquete_id).subscribe({
      next: (data) => {
        this.question = data;
      },
      error: () =>
        this.toastr.error('Erreur lors de la récupération des questions ❌'),
    });
  }

  GetEnqueteIdToAssignEnquete(enqueteId: any) {
    this.enquete_id = enqueteId;
    const modalElement = document.getElementById('Entreprise');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  closeEntreprise(): void {
    const modalElement = document.getElementById('Entreprise');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }

  assignEnqueteToEntreprises() {
    const payload = {
      entrepriseIds: this.EnrollsEntrepriseForm.value.entrepriseIds,
    };

    this.enqueteService
      .assignEnqueteToEntreprises(payload, this.enquete_id)
      .subscribe({
        next: () => {
          this.toastr.success("Enquête assignée à l'entreprise ✅");
          this.closeEntreprise();
        },
        error: () =>
          this.toastr.error(
            "Erreur lors de l'assignation de l'enquête à l'entreprise ❌"
          ),
      });
  }

  editQuestion(question: any): void {
    this.closeVoirQuestionsModal();
    this.enquete_id = question.enquete_id;
    this.questionForm.patchValue({
      texte: question.texte,
      type: question.type,
      options: question.options ? question.options.join(', ') : '',
    });

    this.editingQuestionId = question.question_id;

    const modalElement = document.getElementById('questionModal');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  submitQuestion(): void {
    if (this.questionForm.invalid) return;

    const { texte, type, options } = this.questionForm.value;
    const payload = {
      texte,
      type,
      options:
        type === 'CHOIX' && options
          ? options.split(',').map((opt: string) => opt.trim())
          : null,
      enquete_id: this.enquete_id,
    };

    if (this.editingQuestionId) {
      // Update
      this.questionService
        .updateQuestion(this.editingQuestionId, payload)
        .subscribe({
          next: () => {
            this.toastr.success('✅ Question mise à jour avec succès');
            this.closeVoirQuestionsModal();
            this.VoirQuestions(this.enquete_id); // Refresh questions
            this.editingQuestionId = null;
          },
          error: () =>
            this.toastr.error(
              '❌ Erreur lors de la mise à jour de la question'
            ),
        });
    } else {
      // Create
      this.questionService.createQuestion(payload).subscribe({
        next: () => {
          this.toastr.success('✅ Question ajoutée avec succès');
          this.closeVoirQuestionsModal();
          this.VoirQuestions(this.enquete_id); // Refresh questions
        },
        error: () => this.toastr.error("❌ Erreur lors de l'ajout"),
      });
    }
  }

  deleteQuestion(questionId: string): void {
    if (confirm('Supprimer cette question ?')) {
      this.questionService.deleteQuestion(questionId).subscribe({
        next: () => {
          this.toastr.success('✅ Question supprimée');
          this.VoirQuestions(this.enquete_id); // Refresh list
        },
        error: () => this.toastr.error('❌ Erreur lors de la suppression'),
      });
    }
  }
}
