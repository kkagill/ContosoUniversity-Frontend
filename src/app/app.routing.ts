import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './shared/services/authguard.service';
import { Routes, RouterModule } from '@angular/router';
 
import { HeaderComponent } from "./core/header/header.component";
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { StudentListComponent } from './students/student-list.component';
import { CourseListComponent } from './courses/course-list.component';
import { InstructorListComponent } from './instructors/instructor-list.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'students', component: StudentListComponent, canActivate: [AuthGuard] },
    { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard] },
    { path: 'instructors', component: InstructorListComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
];
 
export const routing = RouterModule.forRoot(appRoutes);
 
export const routedComponents = [
    HeaderComponent,
    HomeComponent, 
    LoginComponent,
    RegisterComponent
];
//export const routedComponents = [AboutComponent, IndexComponent, ContactComponent, LoginComponent, RegisterComponent];