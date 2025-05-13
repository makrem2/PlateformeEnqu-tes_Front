import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/_services/Authentification/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  lang: string = 'fr';
  isRtl: boolean = false;
  loading: boolean = false;
  private activeRequests = 0;
  private destroy$ = new Subject<void>();

  email = '';
  loadingButton = false;
  forgetForm!: FormGroup;
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.forgetForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
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

  requestPasswordReset(): void {
    this.setLoadingState(true);
    this.loadingButton = true;
    this.userService
      .requestPasswordReset(this.forgetForm.value.email)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.loadingButton = false;
        },
        error: (error) => {
          this.toastr.error(error.error.message);
          this.loadingButton = false;
        },
      });
  }

  changeLanguage(lang: any) {
    this.loading = true;
    localStorage.setItem('Lang', lang.target.value);
    window.location.reload();
  }
}
