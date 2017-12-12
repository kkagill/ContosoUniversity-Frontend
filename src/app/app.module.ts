import { CreateCourseModalComponent } from './courses/modals/createCourse-modal';
import { DetailStudentModalComponent } from './students/modals/detailStudent-modal';
import { ItemsService } from './shared/utils/items.service';
import { DataService } from './shared/services/data.service';
import { ConfigService } from './shared/utils/config.service';
import { NotificationService } from './shared/utils/notification.service';
import { AuthService } from './shared/services/auth.service';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { routing, routedComponents } from './app.routing';
import { AppErrorHandler } from './app.error-handler';
import { ErrorHandler } from '@angular/core';
import { AuthGuard } from './shared/services/authguard.service';

import { AuthModule } from './auth/auth.module';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule  } from '@angular/http';
import { ToastyModule } from 'ng2-toasty';
import { PaginationModule, ModalModule, DatepickerModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './core/home/home.component';
import { StudentListComponent } from './students/student-list.component';
import { CourseListComponent } from './courses/course-list.component';
import { InstructorListComponent } from './instructors/instructor-list.component';
import { CreateStudentModalComponent } from './students/modals/createStudent-modal';
import { EditStudentModalComponent } from './students/modals/editStudent-modal';
import { EditCourseModalComponent } from './courses/modals/editCourse-modal';
import { CreateInstructorModalComponent } from './instructors/modals/createInstructor-modal';
import { DetailInstructorModalComponent } from './instructors/modals/detailInstructor-modal';
import { EditInstructorModalComponent } from './instructors/modals/editInstructor-modal';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [
    AppComponent, 
    HomeComponent,    
    DateFormatPipe,
    HeaderComponent, 
    routedComponents,
    StudentListComponent,
    CourseListComponent,
    InstructorListComponent,
    CreateStudentModalComponent,
    DetailStudentModalComponent,
    EditStudentModalComponent,
    CreateCourseModalComponent,
    EditCourseModalComponent,
    CreateInstructorModalComponent,
    DetailInstructorModalComponent,
    EditInstructorModalComponent,
    AdminComponent,
    UserComponent
  ],
  imports: [
    routing,
    HttpModule, 
    AuthModule,
    FormsModule,     
    BrowserModule,
    BrowserAnimationsModule,   
    ModalModule.forRoot(), 
    ToastyModule.forRoot(),
    PaginationModule.forRoot(),
    DatepickerModule.forRoot()
  ],
  providers: [
    Title,
    AuthGuard,
    AuthService,
    DataService,
    ItemsService,
    ConfigService,
    NotificationService,  
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
