import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnqueteService } from 'src/app/_services/Enquete/enquete.service';

@Component({
  selector: 'app-create-enquete',
  templateUrl: './create-enquete.component.html',
  styleUrls: ['./create-enquete.component.css']
})
export class CreateEnqueteComponent {
  enqueteForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private enqueteService: EnqueteService,
    private router: Router
  ) {
    this.enqueteForm = this.fb.group({
      titre: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['MENSUELLE', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    });
  }

  get f() {
    return this.enqueteForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.enqueteForm.invalid) return;

    this.loading = true;
    this.enqueteService.createEnquete(this.enqueteForm.value).subscribe({
      next: (res) => {
        alert('✅ Enquête créée avec succès');
        this.router.navigate(['/admin/enquetes']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Erreur lors de la création');
        this.loading = false;
      },
    });
  }
}