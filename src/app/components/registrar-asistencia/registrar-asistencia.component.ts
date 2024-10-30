import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OthersIntDTO } from '../../dtos/other.dto';
import { EstadoUsuarioService } from '../../services/estado-usuario.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VistasService } from '../../services/vistas.service';
import { ListaAlumnosDTO } from '../../dtos/lista-alumnos.dto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlumnosDTO } from '../../dtos/alumnos.dto';
import { AsistenciaDTO } from '../../dtos/asistencia.dto';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-registrar-asistencia',
  templateUrl: './registrar-asistencia.component.html',
  styleUrl: './registrar-asistencia.component.css'
})
export class RegistrarAsistenciaComponent  {
  listaasistenciaform: FormGroup;
  alumnos: ListaAlumnosDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  listadoalumnos: string[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];
  isEditMode: boolean = false;
  @Input() asistenciaAlumnos?: AsistenciaDTO;
  @Output() asistenciaGuardada = new EventEmitter<AsistenciaDTO>();
  //asistenciaAlumnos: AsistenciaDTO[] = [];
  asistenciaSeleccionada: { [id: number]: number } = {}; // Almacena la asistencia seleccionada por alumno
  descripcionAsistencia: { [id: number]: string } = {};

  constructor(
    private bsModalRef: BsModalRef,
    private router: Router,
    private vistasService: VistasService,
    private modalService: BsModalService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
    private fb: FormBuilder,
    private asistenciaService: AsistenciaService,

  ) {
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.listaasistenciaform = this.fb.group({
      selectGradoAcademico: new FormControl(''),
      inputFechaRegistroAsistencia: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.obtenerAlumnos();
  }

  BuscarAlumno() {
    if (!this.validarCamposBusqueda()) {
      this.MostrarMensajeError('Por favor, rellene al menos un campo de búsqueda.', 'Error');
      return;
    }

    // Llamamos a obtenerAlumnos solo al aplicar el filtro
    this.obtenerAlumnos();
  }

  obtenerAlumnos() {
    this.vistasService.obtenerAlumnos().subscribe(
      (data: ListaAlumnosDTO[]) => {
        const gradoAcademico = this.listaasistenciaform.get('selectGradoAcademico')?.value;
        this.alumnos = data.filter(alumno => {
          return gradoAcademico ? alumno.idgrado === gradoAcademico : true;
        });
      },
      (error) => {
        console.error('Error al obtener los alumnos', error);
      }
    );
  }

  
  // Función para formatear la fecha en yyyy-MM-dd
  formatearFecha(fecha: Date): string {
    // Convertir la fecha a UTC para evitar problemas de zona horaria
    const utcDate = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());

    const year = utcDate.getFullYear();
    const month = ('0' + (utcDate.getMonth() + 1)).slice(-2); // Mes de 2 dígitos
    const day = ('0' + utcDate.getDate()).slice(-2); // Día de 2 dígitos
    return `${year}-${month}-${day}`; // Cambiar a '-' para el formato esperado
  }

/*
  obtenerAlumnos() {
    this.vistasService.obtenerAlumnos().subscribe(
      (data: ListaAlumnosDTO[]) => {
        if (data.length === 0) {
          console.warn('No se encontraron alumnos registrados.');
          this.alumnos = []; // Asignar lista vacía para actualizar la tabla
        } else {
          this.alumnos = data; // Asigna los datos obtenidos
          this.listadoalumnos = data.map(alumno =>
            `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`
          ); // Llena el arreglo de nombres
        }
      },
      (error) => {
        console.error('Error al obtener los alumnos', error);
      }
    );
  }
*/
  // Método para manejar el cambio en los radio buttons
  onAsistenciaChange(alumnoId: number, valorAsistencia: number): void {
    this.asistenciaSeleccionada[alumnoId] = valorAsistencia;
    console.log(`Alumno con ID ${alumnoId} ha seleccionado asistencia: ${valorAsistencia}`);
    console.log('Asistencia actualizada:', this.asistenciaSeleccionada);
  }

  LimpiarFormulario() {
    this.listaasistenciaform.reset();
    this.buscarAlumno = [...this.alumnos];
  }

/*
  EliminarAlumno(alumno: any) {
    const nuevoEstado = !alumno.usEliminado;
    Swal.fire({
      title: '¿Está seguro?',
      text: "El alumno será eliminado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vistasService.cambiarEstadoUsuario(alumno.idusuario, nuevoEstado).subscribe(
          () => {
            alumno.usEliminado = nuevoEstado;
            this.obtenerAlumnos();
            this.MostrarMensajeExito('Alumno eliminado', 'El alumno fue eliminado correctamente');
          },
          (error) => {
            console.error('Error al eliminar el alumno', error);
            this.MostrarMensajeError('Hubo un error al eliminar el alumno', 'Error');
          }
        );
      }
    });
  }
*/

/*
  BuscarAlumno() {
    if (!this.validarCamposBusqueda()) {
      this.MostrarMensajeError('Por favor, rellene al menos un campo de búsqueda.', 'Error');
      return;
    }
    const gradoAcademico = this.listaalumnoform.get('selectGradoAcademico')?.value;
    const fechaAsistencia = this.listaalumnoform.get('inputFechaRegistroAsistencia')?.value;

    this.buscarAlumno = this.alumnos.filter(alumno => {
      const nombreCompleto = `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`.toLowerCase();

      return (
        (gradoAcademico ? alumno.idgrado === gradoAcademico : true)
      );
    });

    console.log(this.buscarAlumno);
  }
*/

  validarCamposBusqueda(): boolean {
    const gradoAcademico = this.listaasistenciaform.get('selectGradoAcademico')?.value;
    const fechaAsistencia = this.listaasistenciaform.get('inputFechaRegistroAsistencia')?.value;

    return !!(fechaAsistencia || gradoAcademico);
  }

  GuardarAsistencia() {
    // Verificar si la fecha de asistencia está definida
    const fechaRegistro = this.listaasistenciaform.get('inputFechaRegistroAsistencia')?.value;
    if (!fechaRegistro) {
        Swal.fire('Error', 'Por favor, selecciona una fecha de registro', 'error');
        return;
    }

    // Crear la lista de asistencias a registrar como un array de AsistenciaDTO
    const asistencias: AsistenciaDTO[] = this.alumnos.map(alumno => {
        return {
            //asisFecha: fechaRegistro, // Fecha de registro
            asisFecha: this.formatearFecha(fechaRegistro),
            asisTipo: this.asistenciaSeleccionada[alumno.idusuario]?.toString() || '0', // Convertimos a string si no lo es
            asisDescripcion: this.descripcionAsistencia[alumno.idusuario] || '', // Descripción de asistencia
            idalumno: alumno.idusuario, // ID del alumno
            iddocente: 0 // Omitir si no lo necesitas
        } as AsistenciaDTO;
    });

    // Llamar al servicio para registrar las asistencias
    this.asistenciaService.createAsistencia(asistencias).subscribe(
        response => {
            Swal.fire('Éxito', 'Asistencia registrada exitosamente', 'success');
        },
        error => {
            console.error('Error al registrar asistencia', error);
            console.log(asistencias);
            Swal.fire('Error', 'Ocurrió un error al registrar la asistencia', 'error');
        }
    );
}


  MostrarMensajeExito(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      showConfirmButton: false,
      timer: 2300,
      timerProgressBar: true
    });
  }

  MostrarMensajeError(mensaje: string, titulo: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "error"
    });
  }
}
