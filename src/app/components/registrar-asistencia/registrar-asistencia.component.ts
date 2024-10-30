import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListaAlumnosDTO } from '../../dtos/lista-alumnos.dto';
import { OthersIntDTO } from '../../dtos/other.dto';
import { AsistenciaDTO } from '../../dtos/asistencia.dto';
import { VistasService } from '../../services/vistas.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { AsistenciaService } from '../../services/asistencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-asistencia',
  templateUrl: './registrar-asistencia.component.html',
  styleUrls: ['./registrar-asistencia.component.css']
})
export class RegistrarAsistenciaComponent implements OnInit {
  listaasistenciaform: FormGroup;
  alumnos: ListaAlumnosDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];
  asistenciaSeleccionada: { [id: number]: number } = {}; 
  descripcionAsistencia: { [id: number]: string } = {}; 

  constructor(
    private vistasService: VistasService,
    private gradoAcademicoService: GradoAcademicoService,
    private asistenciaService: AsistenciaService
  ) {
    this.otherGradoAcademico = this.gradoAcademicoService.ObtenerGradoAcademico();
    this.listaasistenciaform = new FormGroup({
      selectGradoAcademico: new FormControl('', Validators.required),
      inputFechaRegistroAsistencia: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.obtenerAlumnos();

    // Establece la fecha actual en el campo de fecha del formulario
    const fechaActual = new Date();
    this.listaasistenciaform.get('inputFechaRegistroAsistencia')?.setValue(fechaActual);
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

  // Formatear la fecha para enviarla al backend
  formatearFecha(fecha: Date): string {
    const utcOffset = -5; 
    fecha.setHours(fecha.getHours() + utcOffset);
  
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const day = ('0' + fecha.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  }
  
  
  // Guardar la asistencia de los alumnos
  GuardarAsistencia() {
    // Cambiar de numero a texto
  const tipoAsistenciaMap: { [key: number]: string } = {
    1: 'Asistio',
    2: 'Tarde',
    3: 'Falto'
  };
  
    const fechaRegistro = this.listaasistenciaform.get('inputFechaRegistroAsistencia')?.value;
    if (!fechaRegistro) {
      Swal.fire('Error', 'Por favor, selecciona una fecha de registro', 'error');
      return;
    }
  
    const asistencias: AsistenciaDTO[] = this.alumnos.map(alumno => {
      const asisTipo = this.asistenciaSeleccionada[alumno.idalumno] !== undefined
      ? tipoAsistenciaMap[this.asistenciaSeleccionada[alumno.idalumno]] || 'No definido'
      : 'No definido'; 
  
      return {
        asisFecha: this.formatearFecha(new Date(fechaRegistro)),
        asisTipo: asisTipo,
        asisDescripcion: this.descripcionAsistencia[alumno.idalumno] || '',
        idalumno: alumno.idalumno
      };
    });
  
    console.log("Datos enviados al backend:", asistencias);
  
    this.asistenciaService.createAsistencia(asistencias).subscribe(
      response => {
        Swal.fire('Éxito', 'Asistencia registrada exitosamente', 'success');
      },
      error => {
        console.error('Error al registrar asistencia', error);
        Swal.fire('Error', 'Ocurrió un error al registrar la asistencia', 'error');
      }
    );
  }
  
  
 
  
  LimpiarFormulario() {
    this.listaasistenciaform.reset();
    this.alumnos = [];
    this.asistenciaSeleccionada = {};
    this.descripcionAsistencia = {};
  }
}
