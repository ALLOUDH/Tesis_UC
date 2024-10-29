import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaAlumnosComponent } from './lista-alumnos/lista-alumnos.component';
import { ListaDocentesComponent } from './lista-docentes/lista-docentes.component';
import { RegistroAlumnoComponent } from './registro-alumno/registroalumno.component';
import { RegistrodocenteComponent } from './registrodocente/registrodocente.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DxAutocompleteModule, DxDateBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { PeriodoAcademicoComponent } from './periodo-academico/periodo-academico.component';
import { ListaUnidadesAcademicasComponent } from './lista-unidades-academicas/lista-unidades-academicas.component';
import { ListaBimestresAcademicosComponent } from './lista-bimestres-academicos/lista-bimestres-academicos.component';
import { ListaAreaCursosComponent } from './lista-area-cursos/lista-area-cursos.component';
import { ListaAsignaturasComponent } from './lista-asignaturas/lista-asignaturas.component';
import { ListaCategoriaNotasComponent } from './lista-categoria-notas/lista-categoria-notas.component';
import { ListaTiposNotasComponent } from './lista-tipos-notas/lista-tipos-notas.component';
import { AdministracionNotasRegistroAuxiliarComponent } from './administracion-notas-registro-auxiliar/administracion-notas-registro-auxiliar.component';
import { AdministracionNotasConductaComponent } from './administracion-notas-conducta/administracion-notas-conducta.component';
import { AdministracionNotasPadreComponent } from './administracion-notas-padre/administracion-notas-padre.component';
import { EditarAsistenciaComponent } from './editar-asistencia/editar-asistencia.component';
import { VerFaltasTardanzasComponent } from './ver-faltas-tardanzas/ver-faltas-tardanzas.component';
import { AgregarPeriodoAcademicoComponent } from './periodo-academico/agregar-periodo-academico/agregar-periodo-academico.component';
import { AgregarUnidadAcademicaComponent } from './lista-unidades-academicas/agregar-unidad-academica/agregar-unidad-academica.component';
import { AgregarBimestreAcademicoComponent } from './lista-bimestres-academicos/agregar-bimestre-academico/agregar-bimestre-academico.component';
import { AgregarAreaAcademicaComponent } from './lista-area-cursos/agregar-area-academica/agregar-area-academica.component';
import { AgregarAsignaturaComponent } from './lista-asignaturas/agregar-asignatura/agregar-asignatura.component';
import { AgregarCategoriaNotaComponent } from './lista-categoria-notas/agregar-categoria-nota/agregar-categoria-nota.component';
import { AgregarTipoNotaComponent } from './lista-tipos-notas/agregar-tipo-nota/agregar-tipo-nota.component';
import { RegistroIncidenciasComponent } from './registro-incidencias/registro-incidencias.component';
import { RegistroComentarioComponent } from './registro-comentario/registro-comentario.component';
import { ActualizarAlumnosComponent } from './lista-alumnos/actualizar-alumnos/actualizar-alumnos.component';
import { AsignardocentesComponent } from './asignardocentes/asignardocentes.component';
import { EditarDocenteComponent } from './lista-docentes/editar-docente/editar-docente.component';
import { PruebaDesignsComponent } from './prueba-designs/prueba-designs.component';
import { RegistrarAsistenciaComponent } from './registrar-asistencia/registrar-asistencia.component';


@NgModule({
  declarations: [
    ListaAlumnosComponent,
    ListaDocentesComponent,
    RegistroAlumnoComponent,
    RegistrodocenteComponent,
    PeriodoAcademicoComponent,
    ListaUnidadesAcademicasComponent,
    ListaBimestresAcademicosComponent,
    ListaAreaCursosComponent,
    ListaAsignaturasComponent,
    ListaCategoriaNotasComponent,
    ListaTiposNotasComponent,
    AdministracionNotasRegistroAuxiliarComponent,
    AdministracionNotasConductaComponent,
    AdministracionNotasPadreComponent,
    EditarAsistenciaComponent,
    VerFaltasTardanzasComponent,
    AgregarPeriodoAcademicoComponent,
    AgregarUnidadAcademicaComponent,
    AgregarBimestreAcademicoComponent,
    AgregarAreaAcademicaComponent,
    AgregarAsignaturaComponent,
    AgregarCategoriaNotaComponent,
    AgregarTipoNotaComponent,
    RegistroIncidenciasComponent,
    RegistroComentarioComponent,
    ActualizarAlumnosComponent,
    AsignardocentesComponent,
    EditarDocenteComponent,
    PruebaDesignsComponent,
    RegistrarAsistenciaComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxAutocompleteModule,
    ReactiveFormsModule 
  ]
})
export class ComponentsModule { }
