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
  meses = ['marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];  

  // Estructura para mapear las tardanzas y faltas por alumno y mes
  asistenciaMap: { [idalumno: number]: { [mes: string]: { tardanzas: number, faltas: number } } } = {};

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
      },
      (error) => {
        console.error('Error al obtener los alumnos', error);
        Swal.fire('Error', 'Hubo un problema al obtener los alumnos.', 'error');
      }
    );
  }

  // Método que se llama cuando se selecciona un periodo (año)
  onPeriodoChanged(event: any) {
    const periodo = event.value;
    console.log('Año seleccionado:', periodo);
    this.obtenerResumenAsistencia(periodo);
  }

  // Obtener el resumen de asistencia por año
  obtenerResumenAsistencia(periodo: string) {
    const gradoAcademico = this.listaasistenciaform.get('selectGradoAcademico')?.value;
    if (periodo && gradoAcademico) {
      this.asistenciaService.obtenerResumenAsistencia(periodo, gradoAcademico).subscribe(
        (data: ResumenAsistenciaDTO[]) => {
          this.resumenAsistencia = data;
          this.organizarAsistenciaPorAlumnoYMes();
        },
        error => {
          console.error('Error al obtener el resumen de asistencia:', error);
          Swal.fire('Error', 'Hubo un problema al obtener el resumen de asistencia.', 'error');
        }
      );
    }
  }

  organizarAsistenciaPorAlumnoYMes() {
    this.asistenciaMap = {};
    console.log("Resumen de asistencia antes de organizar:", this.resumenAsistencia); // Log inicial para ver los datos de entrada
  
    this.resumenAsistencia.forEach(registro => {
      const { idalumno, resmasisMes, totalTardanzas, totalFaltas } = registro;
  
      console.log(`Procesando registro: idalumno=${idalumno}, mes=${resmasisMes}, tardanzas=${totalTardanzas}, faltas=${totalFaltas}`);
  
      // Inicializar el objeto para el alumno si no existe
      if (!this.asistenciaMap[idalumno]) {
        this.asistenciaMap[idalumno] = {};
      }
  
      // Guardar los datos de tardanzas y faltas para el mes correspondiente
      this.asistenciaMap[idalumno][resmasisMes] = {
        tardanzas: totalTardanzas,
        faltas: totalFaltas
      };
  
      console.log(`Estado actual de asistenciaMap para idalumno ${idalumno}:`, this.asistenciaMap[idalumno]);
    });
  
    console.log("Mapa final de asistencia después de organizar:", this.asistenciaMap); // Log final para ver la estructura completa
  }

  getTardanzasMes(idalumno: number, mes: string): number {
    return this.asistenciaMap[idalumno]?.[mes]?.tardanzas || 0;
  }

  getFaltasMes(idalumno: number, mes: string): number {
    return this.asistenciaMap[idalumno]?.[mes]?.faltas || 0;
  }

  getTotalTardanzas(idalumno: number): number {
    return Object.values(this.asistenciaMap[idalumno] || {}).reduce((total, mesData) => total + (mesData.tardanzas || 0), 0);
  }

  getTotalFaltas(idalumno: number): number {
    return Object.values(this.asistenciaMap[idalumno] || {}).reduce((total, mesData) => total + (mesData.faltas || 0), 0);
  }



/*
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
*/
/*
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
*/

}
