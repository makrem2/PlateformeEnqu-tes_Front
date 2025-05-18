import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, Subscription, takeUntil } from 'rxjs';
import { TokenServiceService } from 'src/app/_services/Authentification/token-service.service';
import { UserService } from 'src/app/_services/Authentification/user.service';
import { environment } from 'src/app/environments/environment';
import Validation from 'src/app/utils/validation';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  passwordForm: FormGroup;
  UserData: any = {};
  loading = false;
  photochange = false;
  visible = true;
  changetype = true;
  isLocalImage = false;
  defaultImage = '../../../../../assets/images/avatar/avatar1.png';
  imagepath: any = environment.imgUrl;
  User_id: any;
  role: any = '';
  private activeRequests = 0;
  private destroy$ = new Subject<void>();
  userdataSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private tokenService: TokenServiceService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      photo_profil: [null],
      defaultImage: ['']
    });

    this.passwordForm = new FormGroup(
      {
        PreviousPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        NewPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', Validators.required)
      },
      { validators: [Validation.match('NewPassword', 'confirmPassword')] }
    );

    this.role = localStorage.getItem('ROLE_KEY');
  }

  ngOnInit(): void {
    this.setLoadingState(true);
    this.userdataSubscription = this.userService.userdata$
      .pipe(takeUntil(this.destroy$), finalize(() => this.setLoadingState(false)))
      .subscribe((data) => {
        this.UserData = data;
        this.userForm.patchValue(data);
        this.User_id = localStorage.getItem('Id_Key');
      });
  }

  ngOnDestroy(): void {
    if (this.userdataSubscription) this.userdataSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  setLoadingState(isLoading: boolean): void {
    this.activeRequests += isLoading ? 1 : -1;
    this.loading = this.activeRequests > 0;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.photochange = true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewUrl = e.target.result;
        this.userForm.patchValue({ defaultImage: previewUrl, photo_profil: file });
        this.isLocalImage = true;
      };
      reader.readAsDataURL(file);
    }
  }

  saveChanges(): void {
    if (this.userForm.invalid) {
      this.toastr.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.setLoadingState(true);
    const formdata = new FormData();
    Object.keys(this.userForm.controls).forEach(key => {
      const value = this.userForm.get(key)?.value;
      if (value !== null) formdata.append(key, value);
    });

    this.userService.updateUser(this.User_id, formdata)
      .pipe(takeUntil(this.destroy$), finalize(() => this.setLoadingState(false)))
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          window.location.reload();
        },
        error: (err) => this.toastr.error(err.error.message)
      });
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) {
      this.toastr.error('Veuillez corriger les erreurs dans le formulaire de mot de passe.');
      return;
    }

    this.setLoadingState(true);
    this.userService.updateUserPassword(this.User_id, this.passwordForm.value)
      .pipe(takeUntil(this.destroy$), finalize(() => this.setLoadingState(false)))
      .subscribe({
        next: (res) => this.toastr.success(res.message),
        error: (err) => {
          this.toastr.error(err.error.message)
        }
      });
  }

  togglePasswordVisibility(): void {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.passwordForm.controls;
  }

  onImageError(event: any) {
    event.target.src = 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?ga=GA1.1.1050140410.1746898981&semt=ais_hybrid&w=740';
  }
}