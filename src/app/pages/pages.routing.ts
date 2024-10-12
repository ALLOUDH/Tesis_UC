import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "../auth/login/login.component";
import { NotFoundComponentComponent } from "../handle-errors/not-found-component/not-found-component.component";
import { RegistroAlumnoComponent } from "../components/registro-alumno/registroalumno.component";
import { RegistrodocenteComponent } from "../components/registrodocente/registrodocente.component";
import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
    {
        path: '', redirectTo:'login', pathMatch:'full'
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: '', component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            {path:'dashboard', component:DashboardComponent},
            { path: 'registroalumno', component: RegistroAlumnoComponent },
            { path: 'registrodocente', component: RegistrodocenteComponent },
            {path:'', redirectTo:'/dashboard', pathMatch:'full'}
        ]
    },
    {
        path: '**', component: NotFoundComponentComponent,
    } 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class PagesRoutingModule{}