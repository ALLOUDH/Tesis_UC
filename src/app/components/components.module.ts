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


@NgModule({
  declarations: [
    ListaAlumnosComponent,
    ListaDocentesComponent,
    RegistroAlumnoComponent,
    RegistrodocenteComponent,
    PeriodoAcademicoComponent
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
