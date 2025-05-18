import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { EntrepriseLayoutComponent } from './layouts/entreprise-layout/entreprise-layout.component';
import { SignInComponent } from './layouts/sign-in/sign-in.component';
import { SignUpComponent } from './layouts/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './layouts/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './layouts/reset-password/reset-password.component';
import { VerifyEmailComponent } from './layouts/verify-email/verify-email.component';
import { adminGuard } from './guards/admin.guard';
import { entrepriseGuard } from './guards/entreprise.guard';


const routes: Routes = [
  {path:'admin',component:AdminLayoutComponent , canActivate: [adminGuard], children : [
    {path: '', loadChildren: () => import('./views/Admin/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule) },
    {path:'dashboard' , loadChildren:()=>import('./views/Admin/admin-dashboard/admin-dashboard.module').then(m=>m.AdminDashboardModule)},
    {path:'myprofile' , loadChildren:()=>import('./views/Admin/myprofile/myprofile.module').then(m=>m.MyprofileModule)},
    {path:'utilisateurs' , loadChildren:()=>import('./views/Admin/utilisateurs/utilisateurs.module').then(m=>m.UtilisateursModule)},
    {path:'user/edit' , loadChildren:()=>import('./views/Admin/edit-user/edit-user.module').then(m=>m.EditUserModule)},
    {path:'user/add' , loadChildren:()=>import('./views/Admin/add-user/add-user.module').then(m=>m.AddUserModule)},

  ]},
  {path:'entreprise',component:EntrepriseLayoutComponent ,canActivate: [entrepriseGuard], children : [
    {path: '', loadChildren: () => import('./views/Entreprise/entreprise-dashboard/entreprise-dashboard.module').then(m => m.EntrepriseDashboardModule) },
    {path:'dashboard' , loadChildren:()=>import('./views/Entreprise/entreprise-dashboard/entreprise-dashboard.module').then(m=>m.EntrepriseDashboardModule)},
    {path:'myprofile' , loadChildren:()=>import('./views/Entreprise/myprofile/myprofile.module').then(m=>m.MyprofileModule)},

  ]},
  {path:'',component:SignInComponent},
  {path:'register',component:SignUpComponent},
  {path:'forgot-password',component:ForgotPasswordComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'verify-email',component:VerifyEmailComponent},
  {path:'**',redirectTo:''},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
