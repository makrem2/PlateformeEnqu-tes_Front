import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { Role } from 'src/app/_models/role';
import { AuthenticationService } from 'src/app/_services/Authentification/authentication.service';
import { UserService } from 'src/app/_services/Authentification/user.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css'],
})
export class UtilisateursComponent implements OnInit, OnDestroy {
  IDUser: any;
  BlockOrUnblock: boolean = false;
  p: number = 1;
  totalItems: number = 0;
  totalPages: number = 0;
  limit: number = 10;
  roleid: number = 2;
  User_Id: any;
  signupForm: FormGroup;
  roles: Role[] = [];
  UserData: any;
  loading: boolean = false;
  private activeRequests = 0;
  private destroy$ = new Subject<void>();
  userdataSubscription?: Subscription;
  defaultImage = '../../../../../assets/images/avatar/avatar1.png';
  imagepath: any = environment.imgUrl;
  searchText: any;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private Authservice: AuthenticationService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone_number: [
          '',
          [Validators.required, Validators.pattern('^[0-9]+$')],
        ],
        date_of_birth: ['', Validators.required],
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        gender: ['male', Validators.required],
        gouvernorat: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  setLoadingState(isLoading: boolean) {
    this.activeRequests += isLoading ? 1 : -1;
    this.loading = this.activeRequests > 0;
  }

  ngOnDestroy(): void {
    if (this.userdataSubscription) this.userdataSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(page: number): void {
    this.getAllUsers(page);
    this.p = page;
  }

  GetUserId(arg0: any) {
    this.userService.getOneUser(arg0).subscribe({
      next: (value) => {
        this.UserData = value;
        this.signupForm.patchValue({
          first_name: this.UserData.first_name,
          last_name: this.UserData.last_name,
          phone_number: this.UserData.phone_number,
          date_of_birth: this.UserData.date_of_birth,
          username: this.UserData.username,
          email: this.UserData.email,
          gender: this.UserData.gender,
          gouvernorat: this.UserData.gouvernorat,
          User_Id: this.UserData.id,
        });
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }
  getAllUsers(page: number = 1) {
    this.setLoadingState(true);
    this.userService.getAllUsers(page, this.limit).subscribe({
      next: (res) => {
        this.UserData = res.data;
        this.totalItems = res.pagination.total;
        this.totalPages = res.pagination.totalPages;
        this.p = res.pagination.page;
        this.setLoadingState(false);
        console.log(this.UserData);
      },
      error: (error) => {
        this.toastr.error('échec du registre', error.error.message);
        this.setLoadingState(false);
      },
    });
  }

  onSubmit() {
    this.setLoadingState(true);
    if (this.signupForm.valid) {
      const user = this.signupForm.value;
      delete user.confirmPassword;

      user.roles = [Role.entreprise];

      this.Authservice.signup(user).subscribe({
        next: (res) => {
          this.toastr.success("s'inscrire avec succès", res.message);
          this.setLoadingState(false);
          this.signupForm.reset();
          this.getAllUsers();
        },
        error: (err) => {
          this.toastr.error('échec du registre', err);
          this.setLoadingState(false);
        },
      });
    } else {
      this.toastr.error('Login failed', 'Form is invalid');
      this.setLoadingState(false);
    }
  }

  onUpdateUser() {}

  GetIdUserToDeleteUser(arg0: any) {
    this.User_Id = arg0;
  }
  DeleteUser() {
    this.setLoadingState(true);
    this.userService.delete$(this.User_Id).subscribe({
      next: (value) => {
        this.setLoadingState(false);
        this.toastr.success('User deleted successfully');
        this.getAllUsers();
      },
      error: (err) => {
        this.setLoadingState(false);
        this.toastr.error('échec du registre', err.error.message);
      },
    });
  }

  BlockUser(arg0: any) {
    this.BlockOrUnblock = true;
    this.IDUser = arg0;
  }

  UnBlockUser(arg0: any) {
    this.BlockOrUnblock = false;
    this.IDUser = arg0;
  }

  BlockUnblockUser() {
    this.setLoadingState(true);

    if (this.BlockOrUnblock) {
      this.userService.toggleUserStatus(this.IDUser).subscribe({
        next: (value) => {
          this.setLoadingState(false);
          this.toastr.success('User blocked successfully');
          this.getAllUsers();
        },
        error: (err) => {
          this.setLoadingState(false);
          this.toastr.error('échec du blocage', err.error.message);
        },
      });
    } else {
      this.userService.toggleUserStatus(this.IDUser).subscribe({
        next: (value) => {
          this.setLoadingState(false);
          this.toastr.success('User unblocked successfully');
          this.getAllUsers();
        },
        error: (err) => {
          this.setLoadingState(false);
          this.toastr.error('échec du déblocage', err.error.message);
        },
      });
    }
  }

  Edit_Voir_User(code: any) {
    this.router.navigate(['/admin/user/edit'], {
      queryParams: { UserCode: code },
    });
  }

  Adduser() {
    this.router.navigate(['/admin/user/add']);
  }

  onImageError(event: any) {
    event.target.src =
      'https://cdn3.iconfinder.com/data/icons/corona-pandemic-disease/512/003-patient-512.png';
  }
}
