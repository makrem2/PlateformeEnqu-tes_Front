import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnqueteService } from 'src/app/_services/Enquete/enquete.service';

@Component({
  selector: 'app-create-enquete',
  templateUrl: './create-enquete.component.html',
  styleUrls: ['./create-enquete.component.css'],
})
export class CreateEnqueteComponent {
  enqueteForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private enqueteService: EnqueteService,
    private router: Router,
    private toastr: ToastrService
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
        this.toastr.success('success', '✅ Enquête créée avec succès');
        this.router.navigate(['/admin/enquetes']);
        this.loading = false;
      },
      error: (err) => {
        console.error(err.error.message);
        this.toastr.error('❌ Erreur', err.error.message);
        this.loading = false;
      },
    });
  }
}
