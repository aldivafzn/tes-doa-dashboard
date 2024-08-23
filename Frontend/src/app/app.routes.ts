import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { FormNCRComponent } from './reports/form-ncr/form-ncr.component';
import { SearchNCRComponent } from './reports/search-ncr/search-ncr.component';
import { FollowonNCRComponent } from './reports/followon-ncr/followon-ncr.component';
import { FormIORComponent } from './reports/form-ior/form-ior.component';
import { SearchIORComponent } from './reports/search-ior/search-ior.component';
import { FollowonIORComponent } from './reports/followon-ior/followon-ior.component';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { EditNCRComponent } from './reports/edit-ncr/edit-ncr.component';
import { EditIORComponent } from './reports/edit-ior/edit-ior.component';
import { PersonnelComponent } from './personnel/personnel.component';

export const routes: Routes = [
    // Essential routes
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'account', component: AccountComponent },
    { path: 'userGuide', component: UserGuideComponent},
    { path: 'personnel', component: PersonnelComponent},
    // Report routes
    { path: 'formNCR', component: FormNCRComponent },
    { path: 'searchNCR', component: SearchNCRComponent },
    { path: 'followNCR', component: FollowonNCRComponent },
    { path: 'editNCR', component: EditNCRComponent },
    { path: 'formIOR', component: FormIORComponent },
    { path: 'searchIOR', component: SearchIORComponent },
    { path: 'followIOR', component: FollowonIORComponent },
    { path: 'editIOR', component: EditIORComponent },
    // Redirects
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }