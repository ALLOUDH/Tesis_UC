import { Component, OnInit } from '@angular/core';
import { ResumenAsistenciaDTO } from '../../dtos/resumenasistencia.dto';
import { VistasService } from '../../services/vistas.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { AsistenciaService } from '../../services/asistencia.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccesoService } from '../../services/acceso.service';
import Swal from 'sweetalert2';
import { ListaAlumnosDTO } from '../../dtos/lista-alumnos.dto';


@Component({
  selector: 'app-ver-asistencia-alumno',
  templateUrl: './ver-asistencia-alumno.component.html',
  styleUrl: './ver-asistencia-alumno.component.css'
})
export class VerAsistenciaAlumnoComponent implements OnInit {
  listaasistenciaform: FormGroup;
  alumno: ListaAlumnosDTO[] = [];
  anos: string[] = [];  // Para almacenar los años únicos
  resumenAsistencia: ResumenAsistenciaDTO[] = [];
  meses = ['marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];  
  
  // Estructura para mapear las tardanzas y faltas por alumno y mes
  asistenciaMap: { [mes: string]: { tardanzas: number, faltas: number } } = {};

  idalumno: number | null = null; // Nueva variable para almacenar el idalumno

  constructor(
    private vistasService: VistasService,
    private gradoAcademicoService: GradoAcademicoService,
    private accesoService: AccesoService,
    private asistenciaService: AsistenciaService
  ) {
    this.listaasistenciaform = new FormGroup({
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

    const userID = this.accesoService.getUserID();
    if (userID !== null) {
      console.log('ID del usuario:', userID);

      // Llamamos al servicio para obtener la lista de alumnos
      this.vistasService.obtenerAlumnos().subscribe(
        (alumnos: ListaAlumnosDTO[]) => {
          // Filtramos el alumno que coincida con el userID
          const alumnoEncontrado = alumnos.find(alumno => alumno.idusuario === userID);
          if (alumnoEncontrado) {
            this.idalumno = alumnoEncontrado.idalumno;
            console.log('ID del alumno encontrado:', alumnoEncontrado.idalumno);
          } else {
            console.warn('No se encontró ningún alumno con el ID especificado.');
            this.MostrarMensajeError("No se encontró el alumno con el ID especificado.", "Advertencia");
          }
        },
        error => {
          console.error('Error al obtener los alumnos:', error);
          this.MostrarMensajeError("Hubo un problema al obtener los datos de los alumnos.", "Error");
        }
      );
    } else {
      console.error('Error: userID es null');
      this.MostrarMensajeError("No se pudo obtener el ID del usuario", "Error");
    }

  }

  // Método que se llama cuando se selecciona un periodo (año)
  onPeriodoChanged(event: any) {
    const periodo = event.value;
    console.log('Año seleccionado:', periodo);

    if (this.idalumno !== null) {
      this.obtenerResumenAsistenciaAlumno(periodo, this.idalumno);
      console.log('ID del alumno:', this.idalumno);
    } else {
      console.warn("No se ha cargado el ID del alumno.");
      this.MostrarMensajeError("Error al cargar el ID del alumno.", "Error");
    }
  }

  // Obtener el resumen de asistencia por año y alumno
  obtenerResumenAsistenciaAlumno(periodo: string, idalumno: number) {
    if (periodo) {
      this.asistenciaService.obtenerResumenAsistenciaAlumno(periodo, idalumno).subscribe(
        (data: ResumenAsistenciaDTO[]) => {
          this.resumenAsistencia = data;
          console.log('Resumen de asistencia:', this.resumenAsistencia);
          this.organizarAsistenciaPorMes();
        },
        error => {
          console.error('Error al obtener el resumen de asistencia:', error);
          this.MostrarMensajeError("Hubo un problema al obtener el resumen de asistencia.", "Error");
        }
      );
    }
  }

  organizarAsistenciaPorMes() {
    this.asistenciaMap = {};
    this.resumenAsistencia.forEach(registro => {
      const { resmasisMes, totalTardanzas, totalFaltas } = registro;

      // Guardar los datos de tardanzas y faltas para el mes correspondiente
      this.asistenciaMap[resmasisMes] = {
        tardanzas: totalTardanzas,
        faltas: totalFaltas
      };
    });
    console.log("Mapa de asistencia organizado:", this.asistenciaMap);
  }

  getTardanzasMes(idalumno: number, mes: string): number {
    return this.asistenciaMap[mes]?.tardanzas || 0;
  }

  getFaltasMes(idalumno: number, mes: string): number {
    return this.asistenciaMap[mes]?.faltas || 0;
  }


  MostrarMensajeError(mensaje: string, titulo: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "error"
    });
  }

}
