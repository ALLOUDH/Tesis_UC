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
  alumno: ListaAlumnosDTO = new ListaAlumnosDTO();
  anos: string[] = [];  // Para almacenar los años únicos
  resumenAsistencia: ResumenAsistenciaDTO[] = [];
  meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  asistenciaMap: { [mes: string]: { tardanzas: number, faltas: number } } = {}; // Mapa para almacenar los datos por mes
  idalumno: number | undefined; // Inicializa con undefined
  
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
      this.obtenerDatosAlumno(userID);  // Llamada al servicio para obtener los datos del alumno

    } else {
      console.error('Error: userID es null');
      this.MostrarMensajeError("No se pudo obtener el ID del usuario", "Error");
    }

  }

  // Método para obtener los datos del alumno por su ID de usuario
  obtenerDatosAlumno(userID: number): void {
    this.vistasService.obtenerAlumnoPorUsuario(userID).subscribe(
      (alumno: ListaAlumnosDTO) => {
        console.log('ID del alumno:', alumno.idalumno); // Muestra solo el idalumno en consola
        this.idalumno = alumno.idalumno;  // Asigna el idalumno a la propiedad de la clase
      },
      error => {
        console.error('Error al obtener los datos del alumno:', error);
        this.MostrarMensajeError("No se pudieron obtener los datos del alumno", "Error");
      }
    );
  }

  // Método que se llama cuando se selecciona un periodo (año)
  onPeriodoChanged(event: any) {
    const periodo = event.value;
    console.log('Año seleccionado:', periodo);

    if (this.idalumno) {  // Verifica si ya se ha obtenido el idalumno
      this.obtenerResumenAsistenciaAlumno(periodo, this.idalumno);
    } else {
      console.error('El idalumno no está definido');
    }
  }

  // Método para obtener el resumen de asistencia por año y alumno
  obtenerResumenAsistenciaAlumno(periodo: string, idalumno: number) {
    this.asistenciaService.obtenerResumenAsistenciaAlumno(periodo, idalumno).subscribe(
      (data: ResumenAsistenciaDTO[]) => {
        this.resumenAsistencia = data;
        console.log('Resumen de asistencia:', this.resumenAsistencia);

        // Inicializar asistenciaMap en cada llamada
        this.asistenciaMap = {};

        // Llenar asistenciaMap con los datos de cada mes
        for (let resumen of this.resumenAsistencia) {
          const mes = resumen.resmasisMes.toLowerCase();
          this.asistenciaMap[mes] = {
            tardanzas: resumen.totalTardanzas,
            faltas: resumen.totalFaltas
          };
        }
        console.log('Mapa de asistencia:', this.asistenciaMap);
    },
      error => {
        this.MostrarMensajeError("Hubo un problema al obtener el resumen de asistencia.", "Error");
      }
    );
  }

  MostrarMensajeError(mensaje: string, titulo: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "error"
    });
  }
  
}
