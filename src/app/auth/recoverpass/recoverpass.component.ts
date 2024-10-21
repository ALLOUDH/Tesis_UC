import { ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OptionselectComponent } from './optionselect/optionselect.component';
import { ValidatesecuritycodeComponent } from './validatesecuritycode/validatesecuritycode.component';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recoverpass',
  templateUrl: './recoverpass.component.html',
  styleUrl: './recoverpass.component.css'
})
export class RecoverpassComponent {

  email: string = '';
  verificationCode: string = '';
  token: string = '';
  nuevaContrasena: string = '';
  isSending: boolean = false;


  constructor(
    private modalService: BsModalService,
    private bsModalRecoverPass: BsModalRef,
    private passwordRecoveryService: PasswordRecoveryService,
  ) {

  }


  solicitarRecuperacion() {
    // Validar que el correo electrónico no esté vacío
    if (!this.email) {
      Swal.fire("Error", "Por favor, ingresa un correo electrónico.", "error");
      return;
    }

    // Evitar el envío múltiple
    if (this.isSending) {
      Swal.fire("Error", "Ya se está enviando el código. Por favor, espera.", "error");
      return;
    }

    // Marcar como enviando
    this.isSending = true;

    this.passwordRecoveryService.solicitarRecuperacion(this.email).subscribe(
      response => {
        // Manejo de la respuesta
        this.isSending = false; // Restablecer el estado al recibir respuesta
        if (response.isSuccess) {
          // Mostrar mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Código enviado exitosamente a tu correo. Revise su bandeja de entrada.',
            showCancelButton: false,
            confirmButtonText: 'Continuar',
          }).then((result) => {
            // Siempre abrir el modal de validación después de la respuesta
            this.AbrirModalValidatesecuritycode();
          });
        } else {
          Swal.fire("Error", response.message || 'Ocurrió un error al solicitar la recuperación.', "error");
        }
        this.token = response.token; // Guardar el token para usarlo después
      },
      error => {
        this.isSending = false; // Restablecer el estado al recibir error
        console.error('Error al solicitar recuperación:', error);
        Swal.fire("Error", "Correo no encontrado. Inténtalo de nuevo.", "error");
      }
    );
  }



  /// Autor: Hector Chavez Perez
  /// Fecha: 02/09/2024
  /// Vesión: 1.0
  /// <sumary>
  /// Método que permite cerrar el modal
  /// </sumary>
  AbrirModalValidatesecuritycode() {
    this.bsModalRecoverPass.hide();
    setTimeout(() => {
      this.modalService.show(ValidatesecuritycodeComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    }, 300);
  }


  CerrarModal() {
    this.bsModalRecoverPass.hide();
  }
}
