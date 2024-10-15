import { Component, input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuditoriaService } from '../../services/auditoria.service';
import { IncidenciaDTO } from '../../dtos/incidencias.dto';
import { AccesoService } from '../../services/acceso.service';
import { AuditoriaDTO } from '../../dtos/auditoria.dto';
import Swal from 'sweetalert2';
import { OthersDTO } from '../../dtos/other.dto';
import { AuditoriaTipoEventoService } from '../../services/auditoria-tipo-evento.service';

@Component({
  selector: 'app-registro-incidencias',
  templateUrl: './registro-incidencias.component.html',
  styleUrl: './registro-incidencias.component.css'
})
export class RegistroIncidenciasComponent {
  IncidenciaForm: FormGroup;
  othersAuditoriaTipoEvento: OthersDTO[] = [];
  AudTipoEvento: any;

  constructor(
    private accesoService: AccesoService,
    private auditoriaService: AuditoriaService,
    otherauditoriaTipoEventoService: AuditoriaTipoEventoService,
  ) {
    this.othersAuditoriaTipoEvento = otherauditoriaTipoEventoService.ObtenerAuditoriaTipoEvento();
    this.IncidenciaForm = new FormGroup({
      inputTituloIncidencia: new FormControl('', [Validators.required,Validators.maxLength(100)]),
      inputDescripcionIncidencia: new FormControl('', [Validators.maxLength(500)]),
    });
  }

  // Propiedad que permite obtener los controles del formulario de alumnos
  get Controls() {
    return this.IncidenciaForm?.controls;
  }

  AsignarIncidencia(incidencia: IncidenciaDTO) {
    this.AsignarValoresAControles(incidencia);
  }

  AsignarValoresAControles(incidencia: IncidenciaDTO) {

    this.IncidenciaForm.get('inputTituloIncidencia')?.setValue(incidencia.AudincTituloIncidencia);
    this.IncidenciaForm.get('inputDescripcionIncidencia')?.setValue(incidencia.AudincDescripcionIncidencia);
  }

  // Método para registrar la incidencia
  registrarIncidencias() {
    for (let i in this.IncidenciaForm.controls) {
      this.IncidenciaForm.controls[i].markAsTouched();
    }
    if (this.IncidenciaForm.valid) {
      let incidencia = new IncidenciaDTO();
      const audtipoevento = this.othersAuditoriaTipoEvento.find((event: any) => event.id === 'Incidencia');

      incidencia.AudincTituloIncidencia = this.IncidenciaForm.get('inputTituloIncidencia')?.value;
      incidencia.AudincDescripcionIncidencia = this.IncidenciaForm.get('inputDescripcionIncidencia')?.value;
      incidencia.AuditoriaDTO = new AuditoriaDTO();

      const userID = this.accesoService.getUserID(); if (userID !== null) {
        incidencia.AuditoriaDTO.Idusuario = userID; // Asigna el ID de usuario si existe
      } else {
        console.error('Error: userID es null');
        this.MostrarMensajeError("Error", "No se pudo obtener el ID del usuario");
        return; // Salimos del método si no se puede obtener el ID
      }

      incidencia.AuditoriaDTO.AudTipoEvento = audtipoevento ? audtipoevento.id : "";
      console.log(incidencia);

      this.auditoriaService.registrarIncidencia(incidencia).subscribe(
        (response: any) => {
          if (response.isSuccess) {
            this.MostrarMensajeExito('Registro de incidencia', 'La incidencia se registró correctamente');
            this.LimpiarFormulario();
          } else {
            this.MostrarMensajeError('Error al registrar la incidencia', 'Error');
          }
        },
        (error) => {
          console.error('Error en el servidor:', error);
          this.MostrarMensajeError('Error', 'Ocurrió un error en el servidor');
        }
      );
    } else {
      this.MostrarMensajeError("Por favor, complete los campos obligatorios", "Oops! Algo salió mal");
    }
  }

  MostrarMensajeExito(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      showConfirmButton: false,
      timer: 1800,
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
    this.IncidenciaForm.reset();
  }
}
