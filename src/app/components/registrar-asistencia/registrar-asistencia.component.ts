import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('rellenarCheckboxRef') rellenarCheckboxRef!: ElementRef; // Referencia al checkbox
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

    // Escuchar cambios en el campo de fecha
    this.listaasistenciaform.get('inputFechaRegistroAsistencia')?.valueChanges.subscribe(() => {
      this.autoRellenarAsistencia(); // Llama a la función al cambiar la fecha
      this.desmarcarCheckbox(); // Desmarcar checkbox
  });
  }
  
  // Formatear la fecha para enviarla al backend
  formatearFecha(fecha: Date): string {
    const year = fecha.getUTCFullYear();
    const month = ('0' + (fecha.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + fecha.getUTCDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
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
        this.autoRellenarAsistencia();  // Auto rellenar después de obtener alumnos
        this.desmarcarCheckbox(); // Desmarcar checkbox
      },
      (error) => {
        console.error('Error al obtener los alumnos', error);
        Swal.fire('Error', 'Hubo un problema al obtener los alumnos.', 'error');
      }
    );
  }

  // Método para desmarcar el checkbox manualmente
  desmarcarCheckbox() {
    if (this.rellenarCheckboxRef) {
      this.rellenarCheckboxRef.nativeElement.checked = false;
    }
  }

  // Autollenado de asistencia
  autoRellenarAsistencia() {
    const fechaRegistro = this.listaasistenciaform.get('inputFechaRegistroAsistencia')?.value;

    if (fechaRegistro) {
        const fechaFormateada = this.formatearFecha(new Date(fechaRegistro));

        // Llamada al servicio para obtener asistencia por fecha
        this.asistenciaService.obtenerAsistenciaPorFecha(fechaFormateada).subscribe(
            (asistencias: AsistenciaDTO[]) => {
                // Limpiar valores previos
                  this.asistenciaSeleccionada = {};
                  this.descripcionAsistencia = {};
                // Rellenar radio buttons y descripciones según los datos obtenidos
                asistencias.forEach(asistencia => {
                    this.asistenciaSeleccionada[asistencia.idalumno] = asistencia.asisTipo === 'Asistio' ? 1 :
                                                                      asistencia.asisTipo === 'Tarde' ? 2 : 3;
                    this.descripcionAsistencia[asistencia.idalumno] = asistencia.asisDescripcion;
                });
            },
            (error) => {
                console.error('Error al obtener asistencia por fecha', error);
                Swal.fire('Error', 'No se pudo cargar la asistencia previa.', 'error');
            }
        );
    }
  }

  rellenarAsistencia(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      this.alumnos.forEach(alumno => {
        this.asistenciaSeleccionada[alumno.idalumno] = 1; // "Asistió" corresponde a 1
      });
    } else {
      // Si se desmarca, limpiamos la selección
      this.alumnos.forEach(alumno => {
        delete this.asistenciaSeleccionada[alumno.idalumno];
      });
    }
  }
  
  // Guardar la asistencia de los alumnos
  GuardarAsistencia() {
    const tipoAsistenciaMap: { [key: number]: string } = {
      1: 'Asistio',
      2: 'Tarde',
      3: 'Falto'
    };
  
    const fechaRegistro = (this.listaasistenciaform.get('inputFechaRegistroAsistencia')?.value);
    if (!fechaRegistro) {
      Swal.fire('Error', 'Por favor, selecciona una fecha de registro', 'error');
      return;
    }
  
    // Verificar si todos los alumnos tienen una asistencia seleccionada
    const incompletos = this.alumnos.some(alumno => !this.asistenciaSeleccionada[alumno.idalumno]);
    if (incompletos) {
      Swal.fire('Error', 'Debe completar la asistencia de todos los alumnos', 'error');
      return;
    }

    const fechaFormateada = this.formatearFecha(new Date(fechaRegistro));

    // Obtener asistencias existentes para la fecha seleccionada
    this.asistenciaService.obtenerAsistenciaPorFecha(fechaFormateada).subscribe(
      (asistenciasExistentes: AsistenciaDTO[]) => {
        const asistenciasAActualizar: AsistenciaDTO[] = [];
        const nuevasAsistencias: AsistenciaDTO[] = [];

        this.alumnos.forEach(alumno => {
          const asisTipo = tipoAsistenciaMap[this.asistenciaSeleccionada[alumno.idalumno]] || 'No definido';

          const asistencia: AsistenciaDTO = {
            asisFecha: fechaFormateada,
            asisTipo: asisTipo,
            asisDescripcion: this.descripcionAsistencia[alumno.idalumno] || '',
            idalumno: alumno.idalumno
          };

          // Verificar si ya existe un registro para este alumno y fecha
          const registroExistente = asistenciasExistentes.find(a => a.idalumno === alumno.idalumno);

          if (registroExistente) {
            asistenciasAActualizar.push(asistencia);
          } else {
            nuevasAsistencias.push(asistencia);
          }
        });

        // Guardar las nuevas asistencias
        if (nuevasAsistencias.length > 0) {
          this.asistenciaService.createAsistencia(nuevasAsistencias).subscribe(
            response => {
              Swal.fire('Éxito', 'Asistencia registrada exitosamente', 'success');
            },
            error => {
              console.error('Error al registrar asistencia', error);
              Swal.fire('Error', 'Ocurrió un error al registrar la asistencia', 'error');
            }
          );
        }

        // Actualizar asistencias existentes
        if (asistenciasAActualizar.length > 0) {
          this.asistenciaService.updateAsistencia(asistenciasAActualizar).subscribe(
            response => {
              Swal.fire('Éxito', 'Asistencia actualizada exitosamente', 'success');
            },
            error => {
              console.error('Error al actualizar asistencia', error);
              Swal.fire('Error', 'Ocurrió un error al actualizar la asistencia', 'error');
            }
          );
        }
      },
      error => {
        console.error('Error al obtener asistencias para la fecha seleccionada', error);
        Swal.fire('Error', 'No se pudo verificar las asistencias previas.', 'error');
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
