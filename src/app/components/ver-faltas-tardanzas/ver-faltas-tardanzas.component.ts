import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListaAlumnosDTO } from '../../dtos/lista-alumnos.dto';
import { OthersIntDTO } from '../../dtos/other.dto';
import { AsistenciaDTO } from '../../dtos/asistencia.dto';
import { VistasService } from '../../services/vistas.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { AsistenciaService } from '../../services/asistencia.service';
import Swal from 'sweetalert2';
import { ResumenAsistenciaDTO } from '../../dtos/resumenasistencia.dto';

@Component({
  selector: 'app-ver-faltas-tardanzas',
  templateUrl: './ver-faltas-tardanzas.component.html',
  styleUrl: './ver-faltas-tardanzas.component.css'
})
export class VerFaltasTardanzasComponent implements OnInit{
  listaasistenciaform: FormGroup;
  alumnos: ListaAlumnosDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  buscarAlumno: ListaAlumnosDTO[] = []; 
  anos: string[] = [];  // Para almacenar los años únicos
  resumenAsistencia: ResumenAsistenciaDTO[] = [];
  meses = ['03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];  // Array de meses en formato numérico



  constructor(
    private vistasService: VistasService,
    private gradoAcademicoService: GradoAcademicoService,
    private asistenciaService: AsistenciaService
  ) {
    this.otherGradoAcademico = this.gradoAcademicoService.ObtenerGradoAcademico();
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

    this.obtenerAlumnos();

  }
  
  // Obtener alumnos por grado seleccionado
  obtenerAlumnos() {
    const gradoAcademico = this.listaasistenciaform.get('selectGradoAcademico')?.value;
    if (!gradoAcademico) {
        return;
    }

    this.vistasService.obtenerAlumnos().subscribe(
      (data: ListaAlumnosDTO[]) => {
        this.alumnos = data.filter(alumno => alumno.idgrado === gradoAcademico);
        this.obtenerResumenAsistencia();
      },
      (error) => {
        console.error('Error al obtener los alumnos', error);
        Swal.fire('Error', 'Hubo un problema al obtener los alumnos.', 'error');
      }
    );
  }

  obtenerResumenAsistencia() {
    const periodo = this.listaasistenciaform.get('PeriodoInformacionAsistencia')?.value;
    const gradoAcademico = this.listaasistenciaform.get('selectGradoAcademico')?.value;
    console.log('Coger datos de periodo y grado',periodo);

    if (periodo && gradoAcademico) {
      this.asistenciaService.obtenerResumenAsistencia(periodo, gradoAcademico).subscribe(
        (data: ResumenAsistenciaDTO[]) => {
          this.resumenAsistencia = data;
        },
        error => {
          console.error('Error al obtener el resumen de asistencia:', error);
          Swal.fire('Error', 'Hubo un problema al obtener el resumen de asistencia.', 'error');
        }
      );
    }
  }

  // Métodos para obtener las tardanzas y faltas por mes
  getTardanzasMes(idAlumno: number, mes: string): number {
    const resumen = this.resumenAsistencia.find(
      r => r.idalumno === idAlumno && r.resmasisMes === mes
    );
    return resumen ? resumen.totalTardanzas : 0;
  }

  getFaltasMes(idAlumno: number, mes: string): number {
    const resumen = this.resumenAsistencia.find(
      r => r.idalumno === idAlumno && r.resmasisMes === mes
    );
    return resumen ? resumen.totalFaltas : 0;
  }

  getTotalTardanzas(idAlumno: number): number {
    return this.resumenAsistencia
      .filter(r => r.idalumno === idAlumno)
      .reduce((sum, r) => sum + r.totalTardanzas, 0);
  }

  getTotalFaltas(idAlumno: number): number {
    return this.resumenAsistencia
      .filter(r => r.idalumno === idAlumno)
      .reduce((sum, r) => sum + r.totalFaltas, 0);
  }

  LimpiarFormulario() {
    this.listaasistenciaform.reset();
    this.alumnos = [];
  }

}
