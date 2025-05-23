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
    this.router.navigate(['/admin/entreprise/edit'], {
      queryParams: { UserCode: code },
    });
  }

  Adduser() {
    this.router.navigate(['/admin/entreprise/add']);
  }

  onImageError(event: any) {
    event.target.src =
      'data:image/jpeg;base64,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';
  }
}
