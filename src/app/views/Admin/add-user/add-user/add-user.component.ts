import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Role } from 'src/app/_models/role';
import { AuthenticationService } from 'src/app/_services/Authentification/authentication.service';
import { UserService } from 'src/app/_services/Authentification/user.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  isSubmitting = false;
  roles: Role[] = [];
  loading: boolean = false;
  private activeRequests = 0;
  private destroy$ = new Subject<void>();
  imagepath: any = environment.imgUrl;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private tostor: ToastrService,
    private userService: UserService
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      secteur: ['', Validators.required],
      ville: ['', Validators.required],
      pays: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roles: [['entreprise']],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setLoadingState(isLoading: boolean) {
    this.activeRequests += isLoading ? 1 : -1;
    this.activeRequests = Math.max(0, this.activeRequests);
    this.loading = this.activeRequests > 0;
  }

  onSignup() {
    this.setLoadingState(true);
    this.isSubmitting = true;
    if (this.signupForm.valid) {
      const user = this.signupForm.value;
      user.roles = [Role.entreprise];

      this.authService
        .signup(user)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.setLoadingState(false))
        )
        .subscribe({
          next: (res) => {
            this.tostor.success("s'inscrire avec succès", res.message);
          },
          error: (err) => {
            this.tostor.error('échec du registre', err);
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
    } else {
      this.tostor.error('Login failed', 'Form is invalid');
    }
  }
}
