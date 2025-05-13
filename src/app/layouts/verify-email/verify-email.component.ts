import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_services/Authentification/authentication.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  lang: string = 'fr';
  isRtl: boolean = false;
  loading: boolean = false;
  private activeRequests = 0;
  private destroy$ = new Subject<void>();

  token: string = '';
  codeDigits: string[] = ['', '', '', '', '', ''];
  constructor(private fb: FormBuilder, private authService: AuthenticationService,
      private toastr:ToastrService,private route:ActivatedRoute,private router:Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe((params) => {
        this.token = params['token'] || '';
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

  onSubmit(): void {
    this.setLoadingState(true);
    const verificationCode = this.codeDigits.join('');

    if (verificationCode.length !== 6) {
      this.toastr.error('Please enter a valid 6-digit code.');
      this.setLoadingState(false)
      return;
    }

    this.authService
      .verifyEmail(this.token, verificationCode)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe({
        next: (value) => {
          this.toastr.success('', value.message);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (err) => {
          console.log(err.error.message);
          this.toastr.error('', err.error.message);
        },
      });
  }

  moveToNext(event: any, index: number): void {
    const input = event.target;
    if (input.value.length === 1 && index < this.codeDigits.length - 1) {
      const nextInput = input.nextElementSibling;
      if (nextInput) nextInput.focus();
    }
  }

  changeLanguage(lang: any) {
    localStorage.setItem('Lang', lang.target.value);
    window.location.reload();
  }
}
