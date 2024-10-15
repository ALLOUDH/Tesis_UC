import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { PasswordRecoveryService } from '../../../services/password-recovery.service';
import { Token } from '@angular/compiler';


@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrl: './changepass.component.css'
})
export class ChangepassComponent {

  public verificationCode: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  constructor(
    private modalService: BsModalService,
    private bsModalChangePass: BsModalRef,
    private passwordRecoveryService: PasswordRecoveryService
  ) {

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

  GuardarNewPass() {
    const errorMessage = this.validarEntradas();
    if (errorMessage) {
      Swal.fire("Error", errorMessage, "error");
      return;
    }

    const token = localStorage.getItem('recuperacionToken');
    if (!token) {  // Asegúrate de que el token no sea null
      Swal.fire("Error", "No se encontró el token de recuperación.", "error");
      return;
    }
    const data = { token: token, nuevaContrasena: this.nuevaContrasena };

    this.passwordRecoveryService.restablecerContrasena(data).subscribe(
      (response) => {
        this.manejarRespuesta(response);
      },
      (error) => {
        this.manejarError(error);
      }
    );
  }

  private validarEntradas(): string | null {
    if (!this.verificationCode) return "El código de verificación es obligatorio.";
    if (!this.nuevaContrasena || !this.confirmarContrasena) return "Ambas contraseñas son obligatorias.";
    if (this.nuevaContrasena !== this.confirmarContrasena) return "Las contraseñas no coinciden.";
    return null;
  }

  private manejarRespuesta(response: any) {
    if (response.isSuccess) {
      Swal.fire("Éxito", response.message, "success");
      this.bsModalChangePass.hide();
    } else {
      Swal.fire("Error", response.message, "error");
    }
  }

  private manejarError(error: any) {
    const errorMessage = error.error?.message || "Ocurrió un error al restablecer la contraseña.";
    Swal.fire("Error", errorMessage, "error");
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
        this.bsModalChangePass.hide();
      }
    });
  }

}
