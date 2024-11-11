import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListaAlumnosDTO } from '../../dtos/lista-alumnos.dto';
import { ResumenAsistenciaDTO } from '../../dtos/resumenasistencia.dto';
import { VistasService } from '../../services/vistas.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-editar-asistencia',
  templateUrl: './editar-asistencia.component.html',
  styleUrl: './editar-asistencia.component.css'
})
export class EditarAsistenciaComponent{  
  listaasistenciaform: FormGroup;
  anos: string[] = [];  // Para almacenar los años únicos
  resumenAsistencia: ResumenAsistenciaDTO[] = [];
  meses = ['marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];  

  // Estructura para mapear las tardanzas y faltas por alumno y mes
  asistenciaMap: { [idalumno: number]: { [mes: string]: { tardanzas: number, faltas: number } } } = {};

  constructor(
    private vistasService: VistasService,
    private gradoAcademicoService: GradoAcademicoService,
    private asistenciaService: AsistenciaService
  ) {
    this.listaasistenciaform = new FormGroup({
      selectGradoAcademico: new FormControl('', Validators.required),
      PeriodoInformacionAsistencia: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.asistenciaService.obtenerAnosConRegistros().subscribe(
      anos => {
        this.anos = anos;  // Asigna los años al arreglo
      },
      error => {
        console.error('Error al obtener los años:', error); // Log para manejar cualquier error
      }
    );

  }
  
  // Método que se llama cuando se selecciona un periodo (año)
  onPeriodoChanged(event: any) {
    const periodo = event.value;
    console.log('Año seleccionado:', periodo);
  }

}
