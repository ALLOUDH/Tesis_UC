import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "../auth/login/login.component";
import { NotFoundComponentComponent } from "../handle-errors/not-found-component/not-found-component.component";
import { RegistroAlumnoComponent } from "../components/registro-alumno/registroalumno.component";
import { RegistrodocenteComponent } from "../components/registrodocente/registrodocente.component";
import { AuthGuard } from "../guards/auth.guard";
import { RegistroComentarioComponent } from "../components/registro-comentario/registro-comentario.component";
import { RegistroIncidenciasComponent } from "../components/registro-incidencias/registro-incidencias.component";
import { PeriodoAcademicoComponent } from "../components/periodo-academico/periodo-academico.component";
import { ListaUnidadesAcademicasComponent } from "../components/lista-unidades-academicas/lista-unidades-academicas.component";
import { ListaBimestresAcademicosComponent } from "../components/lista-bimestres-academicos/lista-bimestres-academicos.component";
import { ListaAreaCursosComponent } from "../components/lista-area-cursos/lista-area-cursos.component";
import { ListaAsignaturasComponent } from "../components/lista-asignaturas/lista-asignaturas.component";
import { ListaCategoriaNotasComponent } from "../components/lista-categoria-notas/lista-categoria-notas.component";
import { ListaTiposNotasComponent } from "../components/lista-tipos-notas/lista-tipos-notas.component";
import { ListaAlumnosComponent } from "../components/lista-alumnos/lista-alumnos.component";
import { ListaDocentesComponent } from "../components/lista-docentes/lista-docentes.component";
import { AdministracionNotasRegistroAuxiliarComponent } from "../components/administracion-notas-registro-auxiliar/administracion-notas-registro-auxiliar.component";
import { AdministracionNotasConductaComponent } from "../components/administracion-notas-conducta/administracion-notas-conducta.component";
import { AdministracionNotasPadreComponent } from "../components/administracion-notas-padre/administracion-notas-padre.component";
import { EditarAsistenciaComponent } from "../components/editar-asistencia/editar-asistencia.component";
import { VerFaltasTardanzasComponent } from "../components/ver-faltas-tardanzas/ver-faltas-tardanzas.component";
import { AsignardocentesComponent } from "../components/asignardocentes/asignardocentes.component";
import { RegistrarAsistenciaComponent } from "../components/registrar-asistencia/registrar-asistencia.component";

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
            { path: 'listaalumnos', component: ListaAlumnosComponent },
            { path: 'listadocentes', component: ListaDocentesComponent },
            { path: 'administracionnotasregistroauxiliar', component: AdministracionNotasRegistroAuxiliarComponent },
            { path: 'administracionnotasconducta', component: AdministracionNotasConductaComponent },
            { path: 'administracionnotaspadre', component: AdministracionNotasPadreComponent },
            { path: 'editarasistencia', component: EditarAsistenciaComponent },
            { path: 'verfaltastardanzas', component: VerFaltasTardanzasComponent },
            { path: 'periodoacademico', component: PeriodoAcademicoComponent},
            { path: 'unidadesacademicas', component: ListaUnidadesAcademicasComponent},
            { path: 'bimestresacademicos', component: ListaBimestresAcademicosComponent},
            { path: 'areaasignaturas', component: ListaAreaCursosComponent},
            { path: 'asignaturas', component: ListaAsignaturasComponent},
            { path: 'categorianotas', component: ListaCategoriaNotasComponent},
            { path: 'tiposnotas', component: ListaTiposNotasComponent},
            { path: 'registroincidencia', component: RegistroIncidenciasComponent},
            { path: 'registrocomentario', component: RegistroComentarioComponent},
            { path: 'asignardocentes', component: AsignardocentesComponent},
            { path: 'registrarasistencia', component: RegistrarAsistenciaComponent},
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