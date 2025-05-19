import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnqueteService } from 'src/app/_services/Enquete/enquete.service';
import { QuestionService } from 'src/app/_services/Question/question.service';

declare const bootstrap: any;

@Component({
  selector: 'app-enquetes',
  templateUrl: './enquetes.component.html',
  styleUrls: ['./enquetes.component.css'],
})
export class EnquetesComponent implements OnInit {
  enquetes: any[] = [];
  searchTerm: string = '';
  modalInstance: any;

  questionForm!: FormGroup;
  enquete_id!: string;
  constructor(
    private enqueteService: EnqueteService,
    private fb: FormBuilder,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEnquetes();
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      texte: ['', Validators.required],
      type: ['TEXTE', Validators.required],
      options: [''], // toujours présent, même si vide
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

  filteredEnquetes(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.enquetes.filter(
      (e) =>
        e.titre.toLowerCase().includes(term) ||
        e.type.toLowerCase().includes(term) ||
        e.statut.toLowerCase().includes(term)
    );
  }

  viewEnquete(enquete: any) {
    // Navigation ou modal
  }

  editEnquete(enquete: any) {
    // Navigation ou formulaire
  }

  deleteEnquete(enquete: any) {
    if (confirm('Supprimer cette enquête ?')) {
      this.enqueteService
        .deleteEnquete(enquete.id)
        .subscribe(() => this.loadEnquetes());
    }
  }

  openModal(enqueteId: string): void {
    this.enquete_id = enqueteId;
    const modalElement = document.getElementById('questionModal');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  closeModal(): void {
    this.modalInstance.hide();
    this.questionForm.reset({ type: 'TEXTE', texte: '', options: '' });
  }

  onTypeChange(): void {
    const type = this.questionForm.get('type')?.value;
    if (type !== 'CHOIX') {
      this.questionForm.get('options')?.setValue('');
    }
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

    console.log('✅ Payload:', payload);

    // this.questionService.createQuestion(payload).subscribe({
    //   next: () => {
    //     alert('✅ Question ajoutée');
    //     this.closeModal();
    //   },
    //   error: () => alert("❌ Erreur lors de l'ajout"),
    // });
  }
}
