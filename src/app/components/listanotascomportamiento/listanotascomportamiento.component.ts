import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListaAlumnosDTO } from '../../dtos/lista-alumnos.dto';
import { OthersIntDTO } from '../../dtos/other.dto';
import { UnidadAcademicaDTO } from '../../dtos/unidadacademica.dto';
import { VistasService } from '../../services/vistas.service';
import { UnidadAcademicoService } from '../../services/unidad-academico.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { NotasComportamientoService } from '../../services/nota-comportamiento.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotasPorAlumnoDTO } from '../../dtos/listanotacomportamiento.dto';
import { TipoNotasDTO } from '../../dtos/tiponotas.dto';
import { TiponotasService } from '../../services/tiponotas.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditarNotasComportamientoComponent } from './editar-notas-comportamiento/editar-notas-comportamiento.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NotaComportamientoDTO } from '../../dtos/notacomportamiento.dto';


@Component({
  selector: 'app-listanotascomportamiento',
  templateUrl: './listanotascomportamiento.component.html',
  styleUrl: './listanotascomportamiento.component.css'
})
export class ListanotascomportamientoComponent {
  notascomporform: FormGroup;
  alumnos: ListaAlumnosDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  otherTipoNota: TipoNotasDTO[] = [];
  otherUnidad: UnidadAcademicaDTO[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];
  listadoalumnos: string[] = []; 
  notasPorAlumno: NotasPorAlumnoDTO[] = [];

  modalRef!: BsModalRef;
  selectedAlumno!: NotasPorAlumnoDTO;

  mostrarDatos = false;

  constructor(
    private router: Router,
    private vistasService: VistasService,
    private tipoNotasService: TiponotasService,
    private UnidadAcademicaService: UnidadAcademicoService,
    gradoAcademicoService: GradoAcademicoService,
    private notaService: NotasComportamientoService,
    
    private modalService: BsModalService
){  
  this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
  this.notascomporform = new FormGroup({
    inputEstudiante: new FormControl(''),
    inputNroDocumento: new FormControl('', [Validators.pattern('^[0-9]*$')]),
    selectGradoAcademico: new FormControl('', Validators.required),
    selectUnidadAcademica: new FormControl('', Validators.required),
  });
  console.log('Valores del formulario:', this.notascomporform.value);
  }

  ngOnInit(): void {
  this.obtenerAlumnos();
  this.obtenerUnidadesAcademicas();
  this.obtenerTiposDeNota(); 
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

  obtenerTiposDeNota() {
    this.tipoNotasService.getTiposNota().subscribe(
      (data: TipoNotasDTO[]) => {
        this.otherTipoNota = data.filter(tipo => tipo.idcategoriaNotas === 4);
      },
      (error) => {
        console.error('Error al obtener los tipos de nota', error);
        this.MostrarMensajeError('Error al cargar tipos de nota', 'Error');
      }
    );
  }
  

  BuscarAlumno() {
    if (!this.validarCamposBusqueda()) {
      this.MostrarMensajeError('Por favor, rellene al menos un campo de búsqueda.', 'Error');
      return;
    }

    const terminobusqueda = this.notascomporform.get('inputEstudiante')?.value;
    const nroDocumento = this.notascomporform.get('inputNroDocumento')?.value || '';
    const gradoAcademico = this.notascomporform.get('selectGradoAcademico')?.value;
    const unidadacademica = this.notascomporform.get('selectUnidadAcademica')?.value;

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
    const terminobusqueda = this.notascomporform.get('inputEstudiante')?.value;
    const nroDocumento = this.notascomporform.get('inputNroDocumento')?.value;
    const gradoAcademico = this.notascomporform.get('selectGradoAcademico')?.value;
    return !!(terminobusqueda || nroDocumento || gradoAcademico );
  }

  obtenerNotas(): void {
    const idGrado = this.notascomporform.get('selectGradoAcademico')?.value;
    const idUnidad = this.notascomporform.get('selectUnidadAcademica')?.value;
  
    if (idGrado && idUnidad) {
      this.mostrarDatos = true; 
      this.notaService.obtenerNotas(idGrado, idUnidad).subscribe(
        (data) => {
          this.notasPorAlumno = data.map(alumno => {
            const notasComportamiento = this.otherTipoNota
              .map(tipoNota => alumno.notas[tipoNota.idtipoNotas])
              .filter(nota => nota !== null) as number[];
  
            const promedio = notasComportamiento.length > 0
              ? Number((notasComportamiento.reduce((a, b) => a + b, 0) / notasComportamiento.length).toFixed(2))
              : '00.00';  
  
            return { ...alumno, promedio };
          });
        },
        (error) => Swal.fire('Error', 'No se pudieron obtener las notas.', 'error')
      );
    } else {
      Swal.fire('Error', 'Seleccione un grado y una unidad.', 'warning');
    }
  }
  
  

  
  obtenerGradoNombre(): string {
    const idGrado = this.notascomporform.get('selectGradoAcademico')?.value;
    const grado = this.otherGradoAcademico.find(g => g.id === idGrado);
    return grado ? grado.nombre : '';
  }
  
  obtenerUnidadNombre(): string {
    const idUnidad = this.notascomporform.get('selectUnidadAcademica')?.value;
    const unidad = this.otherUnidad.find(u => u.idunidad === idUnidad);
    return unidad ? unidad.uniNombre : '';
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

  LimpiarFormulario() {
    this.notascomporform.reset();
    this.buscarAlumno = [...this.alumnos];
    this.mostrarDatos = false;
    this.notasPorAlumno = [];
  }

  abrirModalEdicion(alumno: NotasPorAlumnoDTO): void {
    const initialState = { alumno: alumno, tiposDeNota: this.otherTipoNota };
    this.modalRef = this.modalService.show(EditarNotasComportamientoComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static'
    });
  
    this.modalRef.content.notasActualizadas.subscribe((notasActualizadas: { [idTipoNota: number]: number }) => {
      this.actualizarNotas(alumno, notasActualizadas);
    });
  }

  actualizarNotas(alumno: NotasPorAlumnoDTO, notasActualizadas: { [idTipoNota: number]: number }): void {
    const idUnidad = this.notascomporform.get('selectUnidadAcademica')?.value;
    const idGrado = this.notascomporform.get('selectGradoAcademico')?.value;
    
    // Crear una lista de promesas para esperar todas las actualizaciones
    const actualizacionPromesas = Object.keys(notasActualizadas).map(idTipoNota => {
      const datosActualizados: NotaComportamientoDTO = {
        IdtipoNotas: parseInt(idTipoNota),
        Idunidad: idUnidad,
        Idgrado: idGrado,
        Notas: [
          {
            idalumno: alumno.idalumno,
            NotNotaNumerica: notasActualizadas[parseInt(idTipoNota)]
          }
        ]
      };
  
      // Retornar cada llamada de actualización como una promesa
      return this.notaService.actualizarNotas(datosActualizados).toPromise()
        .catch((error: HttpErrorResponse) => {
          console.error('Error al actualizar notas:', error);
          Swal.fire('Error', `No se pudieron actualizar las notas para el tipo ${idTipoNota}.`, 'error');
        });
    });
  
    // Ejecutar todas las promesas de actualización y mostrar un solo mensaje de éxito cuando terminen
    Promise.all(actualizacionPromesas)
      .then(() => {
        Swal.fire('Éxito', 'Todas las notas fueron actualizadas correctamente', 'success');
        this.obtenerNotas();
      })
      .catch(() => {
        Swal.fire('Error', 'Hubo un problema al actualizar algunas notas.', 'error');
      });
  }
  
  
  

}
