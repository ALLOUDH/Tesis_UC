import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder, FormArray } from '@angular/forms';
import { AsignarDocenteDTO } from '../../dtos/asignardocente.dto';
import { AccesoService } from '../../services/acceso.service';
import { VistasService } from '../../services/vistas.service';
import { AsignaturaService } from '../../services/asignatura.service';
import { OthersIntDTO } from '../../dtos/other.dto';
import { AsignaturaDTO } from '../../dtos/asignatura.dto';
import { GradoAcademicoService } from '../../services/grados.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignardocentes',
  templateUrl: './asignardocentes.component.html',
  styleUrls: ['./asignardocentes.component.css'],
})
export class AsignardocentesComponent implements OnInit {

  asignarDocenteForm: FormGroup;
  docente: any[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  otherAsignatura: AsignaturaDTO[] = [];
  asignarDocentes: AsignarDocenteDTO[] = [];
  selectedDocenteId: number | null = null;

  selectedAsignaturas: number[] = [];

  constructor(
    private vistasService: VistasService,
    private asignaturaService: AsignaturaService,
    private accesoService: AccesoService,
    private gradoAcademicoService: GradoAcademicoService,
    private fb: FormBuilder,


  ) {
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.asignarDocenteForm = new FormGroup({
      SelectDocente: new FormControl('', Validators.required),
      SelectGrado: new FormControl('', Validators.required),
      SelectAsignatura: this.fb.array([], Validators.required),
    
    });
  }

  onCheckboxChange(event: any, asignaturaId: number) {
    const formArray: FormArray = this.asignarDocenteForm.get('SelectAsignatura') as FormArray;

    if (event.target.checked) {
      this.selectedAsignaturas.push(asignaturaId);
      formArray.push(new FormControl(asignaturaId));
    } else {
      const index = this.selectedAsignaturas.indexOf(asignaturaId);
      this.selectedAsignaturas.splice(index, 1);
      formArray.removeAt(index);
    }
  }

  ngOnInit(): void {
    this.cargarDocentes();
    this.cargarAsignaturas();
  }

  cargarDocentes(): void {
    this.vistasService.obtenerDocentes().subscribe(
      (data) => {
        this.docente = data.map((docente) => ({
          ...docente,
          fullName: `${docente.usNombre} ${docente.usApellidoPaterno} ${docente.usApellidoMaterno}`,
        }));
      },
      (error) => {
        console.error('Error al obtener docentes', error);
      }
    );
  }
  obtenerNombreCompleto(): string {
  const selectedId = this.asignarDocenteForm.get('SelectDocente')?.value;
  const selectedDocente = this.docente.find(d => d.iddocente === selectedId);
  return selectedDocente ? selectedDocente.fullName : '';
  }

  cargarAsignaturas(): void {
    this.asignaturaService.getAsignaturas().subscribe(
      (asignaturas) => {
        this.otherAsignatura = asignaturas;
      },
      (error) => {
        console.error('Error al cargar asignaturas:', error);
        this.MostrarMensajeError('Error al cargar asignaturas', error.message);
      }
    );
  }

  agregarAsignacion(): void {
    for (const control in this.asignarDocenteForm.controls) {
      this.asignarDocenteForm.controls[control].markAsTouched();
    }

    if (this.asignarDocenteForm.valid) {
      const docente = new AsignarDocenteDTO();
      docente.IdDocente = this.asignarDocenteForm.get('SelectDocente')?.value;
      docente.IdGrado = this.asignarDocenteForm.get('SelectGrado')?.value;
      docente.IdAsignaturas = this.asignarDocenteForm.get('SelectAsignatura')?.value;

      this.accesoService.asignarDocente(docente).subscribe(
        (response: any) => {
          if (response.isSuccess) {
            this.MostrarMensajeExito('Registro exitoso', 'El docente ha sido asignado correctamente');
            this.LimpiarGradoYasignatura();
            this.cargarAsignaciones();
          } else {
            this.MostrarMensajeError('Registro Fallido', 'Oops! Algo salió mal');
          }
        },
        (error) => {
          console.error('Error en el servidor:', error);
          this.MostrarMensajeError('Error', 'Ocurrió un error en el servidor');
        }
      );
    } else {
      this.MostrarMensajeError('Por favor, complete los campos obligatorios', 'Oops! Algo salió mal');
    }
  }

  cargarAsignaciones(): void {
    const idDocente = this.asignarDocenteForm.get('SelectDocente')?.value;
  
    if (idDocente) {
      this.accesoService.listarAsignaciones(idDocente).subscribe(
        (response: any) => {
          console.log('Respuesta del servicio:', response);
          if (response && response.asignaciones) {
            // Agrupar asignaturas por grado
            const asignacionesPorGrado = response.asignaciones.reduce((acc: any, asignacion: any) => {
              const grado = asignacion.idGrado;
              const nombreGrado = asignacion.gradoNombre;
  
              if (!acc[grado]) {
                acc[grado] = {
                  IdGrado: grado,
                  graNombre: nombreGrado,
                  IdAsignaturas: [],  
                  asigNombre: []
                };
              }
  
              // Agregar la asignatura al array de asignaturas del grado correspondiente
              if (asignacion.idAsignatura && asignacion.asignaturas) {
                acc[grado].IdAsignaturas.push(asignacion.idAsignatura);
                acc[grado].asigNombre.push(asignacion.asignaturas);
              }
  
              return acc;
            }, {});
  
            // Convertir el objeto agrupado en un array que se ajuste al DTO
            this.asignarDocentes = Object.values(asignacionesPorGrado).map((item: any) => ({
              //IdAsignar: item.IdAsignar,
              //usApellidoMaterno: item.usApellidoMaterno,
              //usApellidoPaterno: item.usApellidoPaterno,
              //usNombre: item.usNombre,
              IdGrado: item.IdGrado,
              graNombre: item.graNombre,
              IdAsignaturas: item.IdAsignaturas,
              asigNombre: item.asigNombre
            }));
            console.log('Asignaciones agrupadas:', this.asignarDocentes);
          } else {
            this.asignarDocentes = [];
          }
        },
        (error) => {
          console.error('Error al cargar asignaciones:', error);
          this.MostrarMensajeError('Error al cargar asignaciones', error.message);
        }
      );
    } else {
      this.asignarDocentes = [];
    }
  }

  eliminarAsignacion(index: number): void {
    if (index < 0 || index >= this.asignarDocentes.length) {
        this.MostrarMensajeError('Error', 'Índice de asignación no válido');
        return;
    }

    const asignacion = this.asignarDocentes[index];
    console.log('Asignación seleccionada:', asignacion);

    const IdDocente = this.asignarDocenteForm.get('SelectDocente')?.value;
    const IdGrado = asignacion.IdGrado;  // Obtener el ID del grado de la asignación seleccionada

    if (!IdGrado) {
        console.error('Grado no válido en la asignación seleccionada:', asignacion);
        this.MostrarMensajeError('Error', 'Grado no válido en la asignación seleccionada');
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Una vez eliminada, no podrás recuperar esta asignación.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            if (IdDocente && IdGrado) {
                this.accesoService.eliminarAsignacion(IdDocente, IdGrado).subscribe(
                    (response) => {
                      this.cargarAsignaciones();
                        if (response.isSuccess) {
                            this.asignarDocentes.splice(index, 1);  // Eliminar la asignación eliminada de la lista
                            this.MostrarMensajeExito('Eliminado', 'La asignación ha sido eliminada correctamente');
                        } else {
                            this.MostrarMensajeError('Error', 'No se pudo eliminar la asignación');
                        }
                    },
                    (error) => {
                        console.error('Error al eliminar asignación:', error);
                        this.MostrarMensajeError('Error', 'No se pudo eliminar la asignación');
                    }
                );
            } else {
                this.MostrarMensajeError('Error', 'ID de docente o grado no válidos');
            }
        }
    });
}


  
  MostrarMensajeExito(titulo: string, mensaje: string): void {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
    });
  }

  MostrarMensajeError(titulo: string, mensaje: string): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
    });
  }
  LimpiarFormulario() {
    this.asignarDocenteForm.reset();
     // Limpia el FormArray manualmente
  const formArray: FormArray = this.asignarDocenteForm.get('SelectAsignatura') as FormArray;
  while (formArray.length !== 0) {
    formArray.removeAt(0);
  }
  this.selectedAsignaturas = [];
  this.asignarDocentes = [];
    }

  LimpiarGradoYasignatura(){
    this.asignarDocenteForm.get('SelectGrado')?.setValue(null);
    const formArray: FormArray = this.asignarDocenteForm.get('SelectAsignatura') as FormArray;
  while (formArray.length !== 0) {
    formArray.removeAt(0);
  }
  this.selectedAsignaturas = [];
  }
}
