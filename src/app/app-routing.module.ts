import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { TableExampleComponent } from './table-example/table-example.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { CreateTeacherProfileComponent } from './create-teacher-profile/create-teacher-profile.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { WallpaperComponent } from './wallpaper/wallpaper.component';
import { HomeComponent } from './home/home.component';
import { HomeTeacherComponent } from './home-teacher/home-teacher.component';
import { StatusTeacherComponent } from './status-teacher/status-teacher.component';
import { ViewResponsesComponent } from './view-responses/view-responses.component';
import { ViewExternalApplicationComponent } from './view-external-application/view-external-application.component'

const routes: Routes = [
  { path: 'teacher-profile', component: TeacherProfileComponent },
  { path: 'create-profile/:id', component: CreateProfileComponent },
  { path: 'create-teacher-profile/:id', component: CreateTeacherProfileComponent },
  { path: 'status-info-table', component: TableExampleComponent },
  { path: 'login-page', component: LoginPageComponent },
  { path: '', component: LoginPageComponent },
  { path: 'student-profile', component: StudentProfileComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home-teacher', component: HomeTeacherComponent },
  { path: 'teacher-status', component: StatusTeacherComponent },
  { path: 'view-responses/:internshipID', component: ViewResponsesComponent },
  { path: 'view-external-application/:formID/:studentID', component: ViewExternalApplicationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
