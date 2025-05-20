import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_services/Authentification/authentication.service';
import { TokenServiceService } from 'src/app/_services/Authentification/token-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  lang: string = 'fr';
  isRtl: boolean = false;
  loading: boolean = false;
  private activeRequests = 0;
  private destroy$ = new Subject<void>();

  loginForm!: FormGroup;
  error: string | null = null;

  private roleRedirectUrls: { [key: string]: string } = {
    ROLE_ADMIN: '/admin',
    ROLE_ENTREPRISE: '/entreprise',
  };

  private returnUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private tokenService: TokenServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];

    // Redirect if already logged in
    this.redirectIfLoggedIn();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private redirectIfLoggedIn(): void {
    const roleRedirect = Object.keys(this.roleRedirectUrls).find((role) =>
      this.authService.isRole(role)
    );
    if (roleRedirect) {
      this.router.navigate([this.roleRedirectUrls[roleRedirect]]);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  onSubmit(): void {
    this.setLoadingState(true);
    if (this.loginForm.invalid) {
      this.setLoadingState(false);
      return;
    }
    this.authService
      .signin(this.loginForm.value)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe({
        next: (response) => this.handleSuccessfulLogin(response),
        error: (err) => this.handleLoginError(err),
      });
  }

  private handleSuccessfulLogin(response: any): void {
    const role = response.roles?.[0];
    this.tokenService.saveTokenAndRole(response.token, role, response.id);

    const redirectTarget = decodeURIComponent(
      this.returnUrl || this.roleRedirectUrls[role] || '/'
    );

    console.log('Redirecting to:', redirectTarget);

    setTimeout(() => {
      this.router.navigateByUrl(redirectTarget);
    }, 0);

    this.resetFormState();
  }

  private handleLoginError(err: any): void {
    this.toastr.error(
      'Login failed',
      err.error?.message || 'An error occurred'
    );
    this.resetFormState();
  }

  private resetFormState(): void {
    this.loading = false;
    this.error = null;
  }

  setLoadingState(isLoading: boolean) {
    this.activeRequests += isLoading ? 1 : -1;
    this.loading = this.activeRequests > 0;
  }
}
