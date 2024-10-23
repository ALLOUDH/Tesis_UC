import { Component } from '@angular/core';
import { OthersIntDTO } from '../../dtos/other.dto';
import { EstadoUsuarioService } from '../../services/estado-usuario.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VistasService } from '../../services/vistas.service';
import { ListaAlumnosDTO } from '../../dtos/lista-alumnos.dto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActualizarAlumnosComponent } from './actualizar-alumnos/actualizar-alumnos.component';
import { AlumnosDTO } from '../../dtos/alumnos.dto';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrl: './lista-alumnos.component.css'
})
export class ListaAlumnosComponent {
  listaalumnoform: FormGroup;
  alumnos: ListaAlumnosDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];
  listadoalumnos: string[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];

  constructor(
    private router: Router,
    private vistasService: VistasService,
    private modalEditarAlumno: BsModalRef,
    private modalService: BsModalService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
  ) {
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.listaalumnoform = new FormGroup({
      inputEstudiante: new FormControl(''),
      inputNroDocumento: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      selectGradoAcademico: new FormControl(''),
      selectEstadoUsuario: new FormControl(''),
      selectPeriodoAcademico: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.obtenerAlumnos();
  }

  AbrirModalEditarAlumno(alumno: ListaAlumnosDTO) {
    const initialState = {
      alumno: alumno // Pasa los datos del alumno seleccionado
    };
    this.modalEditarAlumno = this.modalService.show(ActualizarAlumnosComponent, {
      initialState,
      backdrop: 'static',
      class: 'modal-xl'
    });
    this.modalEditarAlumno.content.alumnoActualizado.subscribe(() => {
      this.obtenerAlumnos(); // Volver a obtener la lista de alumnos
    });
  }

  obtenerAlumnos() {
    this.vistasService.obtenerAlumnos().subscribe(
      (data: ListaAlumnosDTO[]) => {
        this.alumnos = data; // Asigna los datos obtenidos
        this.listadoalumnos = data.map(alumno =>
          `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`
        ); // Llena el arreglo de nombres
      },
      (error) => {
        console.error('Error al obtener los alumnos', error);
      }
    );
  }

  RegistrarAlumno() {
    this.router.navigate(['/registroalumno']).then(() => {
      window.location.reload();
    });
  }

  LimpiarFormulario() {
    this.listaalumnoform.reset();
    this.buscarAlumno = [...this.alumnos];
  }

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
        this.vistasService.cambiarEstadoAlumno(alumno.idusuario, nuevoEstado).subscribe(
          () => {
            alumno.usEstado = nuevoEstado;
            this.obtenerAlumnos();
            this.MostrarMensajeExito('Alumno eliminado', 'El estado del alumno se actualizó correctamente');
          },
          (error) => {
            console.error('Error al eliminar el alumno', error);
            this.MostrarMensajeError('Hubo un error al eliminar el alumno', 'Error');
          }
        );
      }
    });
  }

  BuscarAlumno() {
    if (!this.validarCamposBusqueda()) {
      this.MostrarMensajeError('Por favor, rellene al menos un campo de búsqueda.', 'Error');
      return;
    }

    const terminobusqueda = this.listaalumnoform.get('inputEstudiante')?.value;
    const nroDocumento = this.listaalumnoform.get('inputNroDocumento')?.value || '';
    const gradoAcademico = this.listaalumnoform.get('selectGradoAcademico')?.value;
    const estadoUsuario = this.listaalumnoform.get('selectEstadoUsuario')?.value;

    this.buscarAlumno = this.alumnos.filter(alumno => {
      const nombreCompleto = `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`.toLowerCase();

      return (
        (terminobusqueda ? nombreCompleto.includes(terminobusqueda.toLowerCase()) : true) &&
        (nroDocumento ? alumno.usDni.includes(nroDocumento) : true) &&
        (gradoAcademico ? alumno.idgrado === gradoAcademico : true) &&
        (estadoUsuario === true || estadoUsuario === false ? alumno.usEstado === estadoUsuario : true)
      );
  });

    console.log(this.buscarAlumno);
}

validarCamposBusqueda(): boolean {
  const terminobusqueda = this.listaalumnoform.get('inputEstudiante')?.value;
  const nroDocumento = this.listaalumnoform.get('inputNroDocumento')?.value;
  const gradoAcademico = this.listaalumnoform.get('selectGradoAcademico')?.value;
  const estadoUsuario = this.listaalumnoform.get('selectEstadoUsuario')?.value;

  return !!(terminobusqueda || nroDocumento || gradoAcademico || estadoUsuario === true || estadoUsuario === false);
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
