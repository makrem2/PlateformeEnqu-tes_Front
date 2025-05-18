import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, Subscription, takeUntil } from 'rxjs';
import { TokenServiceService } from 'src/app/_services/Authentification/token-service.service';
import { UserService } from 'src/app/_services/Authentification/user.service';
import { environment } from 'src/app/environments/environment';
import Validation from 'src/app/utils/validation';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  passwordForm: FormGroup;
  UserData: any = {};
  loading = false;
  photochange = false;
  visible = true;
  changetype = true;
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
    private tokenService: TokenServiceService,
    private Activatedroute: ActivatedRoute,
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      date_naissance: ['', Validators.required],
      genre: ['', Validators.required],
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
    this.User_id =
    this.Activatedroute.snapshot.queryParamMap.get('UserCode') || 0;
    this.GetUserByCode();
  }


  GetUserByCode() {
    this.userService.getOneUser(this.User_id).subscribe({
      next:(data)=> {
        this.UserData = data;
        this.userForm.patchValue(data);
      },error:(err)=> {
        this.toastr.error(err.error.message);
      },
    })
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
}