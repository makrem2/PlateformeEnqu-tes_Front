import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, Subscription, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/_services/Authentification/authentication.service';
import { EventBusService } from 'src/app/_services/Authentification/event-bus-service.service';
import { TokenServiceService } from 'src/app/_services/Authentification/token-service.service';
import { UserService } from 'src/app/_services/Authentification/user.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-entreprise-layout',
  templateUrl: './entreprise-layout.component.html',
  styleUrls: ['./entreprise-layout.component.css']
})
export class EntrepriseLayoutComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  private activeRequests = 0;
  private destroy$ = new Subject<void>();
  UserData: any;
  eventBusSub?: Subscription;
  User_Id: string | null = null;
  role: string | null = null;
  OBtoken = {
    token: '',
    userId: '',
  };
  imagepath: any = environment.imgUrl;


  activeMenu: string | null = null;
  isSidebarOpen = false;

  isDarkMode: boolean = false;

  constructor(
    private renderer: Renderer2,
    private authadmin: AuthenticationService,
    private tokenService: TokenServiceService,
    private userProfileService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private eventBusService: EventBusService
  ) {}

  ngOnInit() {
    this.OBtoken.token = this.tokenService.getToken() || '';
    this.User_Id = localStorage.getItem('Id_Key') || '';
    this.role = localStorage.getItem('ROLE_KEY') || '';
    this.OBtoken.userId = this.User_Id;
    this.GetUserProfile();

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.LogOut();
    });
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
    this.updateTheme();
  }

  ngOnDestroy(): void {
    if (this.eventBusSub) {
      this.eventBusSub.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setLoadingState(isLoading: boolean) {
    this.activeRequests += isLoading ? 1 : -1;
    this.activeRequests = Math.max(0, this.activeRequests);
    this.loading = this.activeRequests > 0;
  }

  GetUserProfile() {
    this.setLoadingState(true);
    this.userProfileService
      .getOneUser(this.User_Id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe({
        next: (value) => {
          this.UserData = value;
          this.userProfileService.setUserdata(value);
          console.log(this.UserData);
        },
        error: (err) => {
          if (err.status === 403) {
            this.LogOut();
          }
        },
      });
  }

  LogOut(): void {
    this.setLoadingState(true);
    this.authadmin
      .logout(this.OBtoken)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe({
        next: (res) => {
          this.toastr.error(res.message);
          this.tokenService.clearTokens();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        },
      });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    this.updateTheme();
  }

  updateTheme() {
    const htmlElement = document.documentElement; // <html> element
    this.renderer.setAttribute(
      htmlElement,
      'data-theme',
      this.isDarkMode ? 'dark' : 'light'
    );
  }

  toggleSubmenu(menu: string): void {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  // Detect clicks outside the sidebar to close it
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.toggle-btn');

    if (
      this.isSidebarOpen &&
      sidebar &&
      !sidebar.contains(event.target as Node) &&
      !toggleButton?.contains(event.target as Node)
    ) {
      this.closeSidebar();
    }
  }

  onImageError(event: any) {
    event.target.src = 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?ga=GA1.1.1050140410.1746898981&semt=ais_hybrid&w=740';
  }
}
