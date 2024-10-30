import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListaAlumnosDTO } from '../../dtos/lista-alumnos.dto';
import { OthersIntDTO } from '../../dtos/other.dto';
import { TipoNotasDTO } from '../../dtos/tiponotas.dto';
import { UnidadAcademicaDTO } from '../../dtos/unidadacademica.dto';
import { Route, Router } from '@angular/router';
import { TiponotasService } from '../../services/tiponotas.service';
import { UnidadAcademicoService } from '../../services/unidad-academico.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { VistasService } from '../../services/vistas.service';
import Swal from 'sweetalert2';
import { NotasComportamientoService } from '../../services/nota-comportamiento.service';
import { NotaComportamientoDTO, NotaDTO } from '../../dtos/notacomportamiento.dto';

@Component({
  selector: 'app-administracion-notas-conducta',
  templateUrl: './administracion-notas-conducta.component.html',
  styleUrl: './administracion-notas-conducta.component.css'
})
export class AdministracionNotasConductaComponent {
  notascomportamientoform: FormGroup;
  alumnos: ListaAlumnosDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  otherTipoNota: TipoNotasDTO[] = [];
  otherUnidad: UnidadAcademicaDTO[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];
  listadoalumnos: string[] = [];

  constructor(
    private router: Router,
    private tipoNotasService: TiponotasService,
    private vistasService: VistasService,
    private UnidadAcademicaService: UnidadAcademicoService,
    gradoAcademicoService: GradoAcademicoService,
    private notaService: NotasComportamientoService
  ) {
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.notascomportamientoform = new FormGroup({
      inputEstudiante: new FormControl(''),
      inputNroDocumento: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      selectGradoAcademico: new FormControl(''),
      selectTipoNota: new FormControl(''),
      selectUnidadAcademica: new FormControl(''),
    });
    console.log('Valores del formulario:', this.notascomportamientoform.value);
  }
  
  ngOnInit(): void {
  this.obtenerAlumnos();
  this.obtenerTiposDeNota();
  this.obtenerUnidadesAcademicas();
  }
  
  obtenerAlumnos() {
    this.vistasService.obtenerAlumnos().subscribe(
      (data: ListaAlumnosDTO[]) => {
        // Filtrar solo los alumnos que no están eliminados
        const alumnosActivos = data.filter(alumno => !alumno.usEliminado);
        
        if (alumnosActivos.length === 0) {
          console.warn('No se encontraron alumnos registrados.');
          this.alumnos = []; // Asignar lista vacía para actualizar la tabla
        } else {
          this.alumnos = alumnosActivos; // Asigna solo los alumnos activos
          this.listadoalumnos = alumnosActivos.map(alumno =>
            `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`
          ); // Llena el arreglo de nombres
        }
      },
      (error) => {
        console.error('Error al obtener los alumnos', error);
      }
    );
}

  obtenerTiposDeNota() {
    this.tipoNotasService.getTiposNota().subscribe(
      (data: TipoNotasDTO[]) => {
        this.otherTipoNota = data;
      },
      (error) => {
        console.error('Error al obtener los tipos de nota', error);
        this.MostrarMensajeError('Error al cargar tipos de nota', 'Error');
      }
    );
  }
  obtenerUnidadesAcademicas() {
    this.UnidadAcademicaService.getUnidad().subscribe(
      (data: UnidadAcademicaDTO[]) => {
        this.otherUnidad = data;
      },
      (error) => {
        console.error('Error al obtener las unidades académicas', error);
        this.MostrarMensajeError('Error al cargar unidades académicas', 'Error');
      }
    );
  }

  LimpiarFormulario() {
    this.notascomportamientoform.reset();
    this.buscarAlumno = [...this.alumnos];
  }

  BuscarAlumno() {
    if (!this.validarCamposBusqueda()) {
      this.MostrarMensajeError('Por favor, rellene al menos un campo de búsqueda.', 'Error');
      return;
    }

    const terminobusqueda = this.notascomportamientoform.get('inputEstudiante')?.value;
    const nroDocumento = this.notascomportamientoform.get('inputNroDocumento')?.value || '';
    const gradoAcademico = this.notascomportamientoform.get('selectGradoAcademico')?.value;
    const unidadacademica = this.notascomportamientoform.get('selectUnidadAcademica')?.value;
    const tiponotas = this.notascomportamientoform.get('selectTipoNota')?.value;

    this.buscarAlumno = this.alumnos.filter(alumno => {
      const nombreCompleto = `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`.toLowerCase();

      return (
        (terminobusqueda ? nombreCompleto.includes(terminobusqueda.toLowerCase()) : true) &&
        (nroDocumento ? alumno.usDni.includes(nroDocumento) : true) &&
        (gradoAcademico ? alumno.idgrado === gradoAcademico : true)
      );
    });

    console.log(this.buscarAlumno);
  }

  validarCamposBusqueda(): boolean {
    const terminobusqueda = this.notascomportamientoform.get('inputEstudiante')?.value;
    const nroDocumento = this.notascomportamientoform.get('inputNroDocumento')?.value;
    const gradoAcademico = this.notascomportamientoform.get('selectGradoAcademico')?.value;
    const tiponotas = this.notascomportamientoform.get('selectTipoNota')?.value;
    return !!(terminobusqueda || nroDocumento || gradoAcademico || tiponotas);
  }

  registrarNotas() {
    const Notas: NotaDTO[] = this.buscarAlumno.map(alumno => ({
      idalumno: alumno.idalumno, 
      NotFechaRegistro: new Date().toISOString().split('T')[0],
      NotNotaNumerica: alumno.notasconducta || 0
    }));

    const dto: NotaComportamientoDTO = {
      IdasignarDocente: null, 
      IdtipoNotas: this.notascomportamientoform.get('selectTipoNota')?.value,
      Idunidad: this.notascomportamientoform.get('selectUnidadAcademica')?.value,
      Idgrado: this.notascomportamientoform.get('selectGradoAcademico')?.value,
      Notas: Notas
    };
    console.log('Datos que se envían al backend:', dto);

    this.notaService.registrarNotasComportamiento(dto).subscribe(
      (response) => {
        console.log(this.notascomportamientoform.controls);
        this.MostrarMensajeExito('Registro Exitoso', 'Las notas de comportamiento fueron registradas correctamente.');
        this.LimpiarFormulario();
      },
      (error) => {
        if (error.status === 409) {
          Swal.fire('Advertencia', 'Ya existen notas registradas para la unidad y tipo de nota seleccionados.', 'warning');
        } else {
          this.MostrarMensajeError('Hubo un problema al registrar las notas. Intente nuevamente.', 'Error');
        }
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

  validarNota(alumno: any) {
  if (alumno.notasconducta < 0) {
    alumno.notasconducta = 0;
  } else if (alumno.notasconducta > 20) {
    alumno.notasconducta = 20;
  }
}

}
