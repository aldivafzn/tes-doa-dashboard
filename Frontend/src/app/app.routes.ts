import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { FormNCRComponent } from './reports/form-ncr/form-ncr.component';
import { SearchNCRComponent } from './reports/search-ncr/search-ncr.component';
import { FormIORComponent } from './reports/form-ior/form-ior.component';
import { SearchIORComponent } from './reports/search-ior/search-ior.component';
import { FollowonIORComponent } from './reports/followon-ior/followon-ior.component';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { EditNCRComponent } from './reports/edit-ncr/edit-ncr.component';
import { EditIORComponent } from './reports/edit-ior/edit-ior.component';
import { EditFollowonIORComponent } from './reports/edit-followon-ior/edit-followon-ior.component';
import { ReplyNCRComponent } from './reports/reply-ncr/reply-ncr.component';
import { ShowReplyNCRComponent } from './reports/show-reply-ncr/show-reply-ncr.component';
import { EditReplyNCRComponent } from './reports/edit-reply-ncr/edit-reply-ncr.component';
import { DetailNCRComponent } from './reports/detail-ncr/detail-ncr.component';
import { DetailIORComponent } from './reports/detail-ior/detail-ior.component';
import { ResultNCRComponent } from './reports/result-ncr/result-ncr.component';
import { EditResultNCRComponent } from './reports/edit-result-ncr/edit-result-ncr.component';
import { SearchPersonnelComponent } from './personnel/search-personnel/search-personnel.component';
import { AddPersonnelComponent } from './personnel/add-personnel/add-personnel.component';
import { DetailPersonnelComponent } from './personnel/detail-personnel/detail-personnel.component';
import { EditPersonnelComponent } from './personnel/edit-personnel/edit-personnel.component';

export const routes: Routes = [
    // Essential routes
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'account', component: AccountComponent },
    { path: 'userGuide', component: UserGuideComponent},
    // Report routes
    { path: 'formNCR', component: FormNCRComponent },
    { path: 'searchNCR', component: SearchNCRComponent },
    { path: 'detailNCR', component: DetailNCRComponent },
    { path: 'editNCR', component: EditNCRComponent },
    { path: 'addReplyNCR', component: ReplyNCRComponent },
    { path: 'showReplyNCR', component: ShowReplyNCRComponent },
    { path: 'editReplyNCR', component: EditReplyNCRComponent },
    { path: 'addResultNCR', component: ResultNCRComponent },
    { path: 'editResultNCR', component: EditResultNCRComponent },
    { path: 'formIOR', component: FormIORComponent },
    { path: 'searchIOR', component: SearchIORComponent },
    { path: 'detailIOR', component: DetailIORComponent},
    { path: 'addFollowonIOR', component: FollowonIORComponent },
    { path: 'editIOR', component: EditIORComponent },
    { path: 'editFollowonIOR', component: EditFollowonIORComponent },
    // Personnel routes
    { path: 'searchPersonnel', component: SearchPersonnelComponent },
    { path: 'addPersonnel', component: AddPersonnelComponent },
    { path: 'detailPersonnel', component: DetailPersonnelComponent },
    { path: 'editPersonnel', component: EditPersonnelComponent },
    // Redirects
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }