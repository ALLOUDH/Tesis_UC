import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { PasswordRecoveryService } from '../../../services/password-recovery.service';
import { ChangepassComponent } from '../changepass/changepass.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-validatesecuritycode',
  templateUrl: './validatesecuritycode.component.html',
  styleUrl: './validatesecuritycode.component.css'
})
export class ValidatesecuritycodeComponent{
  
  verificationCode: string = '';

  constructor(
    private modalService: BsModalService,
    private bsModalValidateSecurityCode: BsModalRef,
    private passwordRecoveryService: PasswordRecoveryService,
  ) {

  }

 

  verificarCodigo() {
    // Obtener token de localStorage
    const token = localStorage.getItem('recuperacionToken');
  
    this.passwordRecoveryService.verificarCodigo(this.verificationCode).subscribe(
      response => {
        if (response.isSuccess) {
          console.log("Código verificado. Puedes cambiar tu contraseña.");

          localStorage.setItem('recuperacionToken', response.token); // Guardar el token en localStorage
          // Mostrar un mensaje de éxito
          Swal.fire({
            title: 'Éxito',
            text: 'Código verificado. Puedes proceder a cambiar tu contraseña.',
            icon: 'success',
            confirmButtonColor: '#0B5ED7',
          }).then(() => {
            this.AbrirModalChangepass(); // Abrir modal para cambiar contraseña
          });
        } 
      },
      error => {
        console.error('Error en la petición:', error);
        // Mostrar un mensaje de error si hay un problema con la petición
        Swal.fire({
          title: 'Error',
          text: 'Codigo Incorrecto. Por favor, inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonColor: '#BB2D3B',
        });
      }
    );
  }
  
  
  
  /// Autor: Hector Chavez Perez
  /// Fecha: 02/09/2024
  /// Vesión: 1.0
  /// <sumary>
  /// Método que permite cerrar el modal
  /// </sumary>
  CerrarModal() {
    this.MensajeAlerta("Estas segur@ de volver al inicio?","No podrás deshacer esta acción!");
  }

  
  /// Autor: Hector Chavez Perez
  /// Fecha: 02/09/2024
  /// Vesión: 1.0
  /// <sumary>
  /// Método que permite cerrar el modal
  /// </sumary>

  AbrirModalChangepass() {
    this.bsModalValidateSecurityCode.hide();
    setTimeout(() => {
      const initialState = {
        verificationCode: this.verificationCode // Asegúrate de que esto coincida con la propiedad en ChangepassComponent
      };
      this.modalService.show(ChangepassComponent, { 
        backdrop: 'static', 
        class: 'modal-dialog-centered', 
        initialState 
      });
    }, 300);
  }

  MensajeAlerta(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0B5ED7",
      cancelButtonColor: "#BB2D3B",
      confirmButtonText: "Si, cancelar",
      cancelButtonText: "No, continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          confirmButtonColor: "#0B5ED7",
        });
        this.bsModalValidateSecurityCode.hide();
      }
    });
  }
}
