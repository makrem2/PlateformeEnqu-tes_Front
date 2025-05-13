import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/_services/Authentification/user.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  lang: string = 'fr';
  isRtl: boolean = false;
  loading: boolean = false;
  private activeRequests = 0;
  private destroy$ = new Subject<void>();

  email = '';
  newPassword = '';
  token = '';
  resetPasswordForm: FormGroup;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.toastr.error('Invalid or missing token');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setLoadingState(isLoading: boolean) {
    this.activeRequests += isLoading ? 1 : -1;
    this.activeRequests = Math.max(0, this.activeRequests);
    this.loading = this.activeRequests > 0;
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('newPassword')?.value ===
      group.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    this.setLoadingState(true);
    if (this.resetPasswordForm.invalid) {
      this.loading = false;
      return;
    }
    const { newPassword } = this.resetPasswordForm.value;
    this.userService
      .resetPassword(this.token, newPassword)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);

        },
        error: (err) => {
          this.toastr.error(err.error.message);
        },
      });
  }

  changeLanguage(lang: any) {
    this.loading = true;
    localStorage.setItem('Lang', lang.target.value);
    window.location.reload();
  }
}
