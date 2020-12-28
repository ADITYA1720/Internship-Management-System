import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Material } from './material/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatButtonModule } from '@angular/material';
//import { AlertModule } from 'ngx-bootstrap';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { TableExampleComponent } from './table-example/table-example.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { CreateTeacherProfileComponent } from './create-teacher-profile/create-teacher-profile.component';
import { EditStudentProfileDialogComponent } from './edit-student-profile-dialog/edit-student-profile-dialog.component';
import { FormsModule } from "@angular/forms";
import { WallpaperComponent } from './wallpaper/wallpaper.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';

import {MatGridListModule} from '@angular/material/grid-list';
import { FooterComponent } from './footer/footer.component';
import { HomeTeacherComponent } from './home-teacher/home-teacher.component';
import { StatusTeacherComponent } from './status-teacher/status-teacher.component';
import { InternshipDetailsComponent } from './internship-details/internship-details.component';
import { AttachResumeComponent } from './attach-resume/attach-resume.component';
import { HeaderTeacherComponent } from './header-teacher/header-teacher.component';
import { ViewResponsesComponent } from './view-responses/view-responses.component';
import { StudentProfileDialogComponent } from './student-profile-dialog/student-profile-dialog.component';
import { ViewExternalApplicationComponent } from './view-external-application/view-external-application.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    StudentProfileComponent,
    TableExampleComponent,
    CreateProfileComponent,
    TeacherProfileComponent,
    CreateTeacherProfileComponent,
    EditStudentProfileDialogComponent,
    WallpaperComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    HomeTeacherComponent,
    StatusTeacherComponent,
    InternshipDetailsComponent,
    AttachResumeComponent,
    HeaderTeacherComponent,
    ViewResponsesComponent,
    StudentProfileDialogComponent,
    ViewExternalApplicationComponent
  ],
  imports: [
  //  AlertModule.forRoot(),
    FormsModule,
    BrowserModule,
    Material,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
   MatGridListModule

  ],
  entryComponents: [
    EditStudentProfileDialogComponent
    , InternshipDetailsComponent,
    AttachResumeComponent,
    StudentProfileDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
