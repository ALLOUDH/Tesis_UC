import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuditoriaService } from '../../services/auditoria.service';
import Swal from 'sweetalert2';
import { ComentarioDTO } from '../../dtos/comentarios.dto';
import { AccesoService } from '../../services/acceso.service';
import { AuditoriaDTO } from '../../dtos/auditoria.dto';
import { OthersDTO } from '../../dtos/other.dto';
import { AuditoriaTipoEventoService } from '../../services/auditoria-tipo-evento.service';

@Component({
  selector: 'app-registro-comentario',
  templateUrl: './registro-comentario.component.html',
  styleUrl: './registro-comentario.component.css'
})
export class RegistroComentarioComponent {
  ComentarioForm: FormGroup;
  othersAuditoriaTipoEvento: OthersDTO[] = [];
  AudTipoEvento: any;

  constructor(
    private auditoriaService: AuditoriaService,
    private accesoService: AccesoService,
    otherauditoriaTipoEventoService: AuditoriaTipoEventoService,
    
  ) {
    this.othersAuditoriaTipoEvento = otherauditoriaTipoEventoService.ObtenerAuditoriaTipoEvento();
    this.ComentarioForm = new FormGroup({
      inputComentario: new FormControl('', [Validators.required,Validators.maxLength(100)]),
    });
  }

  // Propiedad que permite obtener los controles del formulario de alumnos
  get Controls() {
    return this.ComentarioForm?.controls;
  }

  AsignarIncidencia(comentario: ComentarioDTO) {
    this.AsignarValoresAControles(comentario);
  }

  AsignarValoresAControles(comentario: ComentarioDTO) {

    this.ComentarioForm.get('inputComentario')?.setValue(comentario.AudcomComentario);

  }

  // Método para registrar el comentario
  registrarComentario() {
    for (let i in this.ComentarioForm.controls) {
      this.ComentarioForm.controls[i].markAsTouched();
    }
    if (this.ComentarioForm.valid) {
      let comentario = new ComentarioDTO();
      const audtipoevento = this.othersAuditoriaTipoEvento.find(event => event.id === 'Comentario');

      comentario.AudcomComentario = this.ComentarioForm.get('inputComentario')?.value;
      comentario.AuditoriaDTO = new AuditoriaDTO();

      const userID = this.accesoService.getUserID();if (userID !== null) {
        comentario.AuditoriaDTO.Idusuario = userID; // Asigna el ID de usuario si existe
      } else {
        console.error('Error: userID es null');
        this.MostrarMensajeError("Error", "No se pudo obtener el ID del usuario");
        return; // Salimos del método si no se puede obtener el ID
      }
      
      comentario.AuditoriaDTO.AudTipoEvento = audtipoevento ? audtipoevento.id : '';
      console.log(comentario);

      this.auditoriaService.registrarComentario(comentario).subscribe(
        (response: any) => {
          if (response.isSuccess) {
            this.MostrarMensajeExito('Registro de Comentario', 'El comentario se registró correctamente');
            this.LimpiarFormulario();
          } else {
            this.MostrarMensajeError('Error al registrar el comentario', 'Error');
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
    this.ComentarioForm.reset();
  }
}
