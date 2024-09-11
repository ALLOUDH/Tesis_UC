import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrl: './changepass.component.css'
})
export class ChangepassComponent {

  constructor(
    private modalService: BsModalService,
    private bsModalChangePass: BsModalRef
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
    this.bsModalChangePass.hide();
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
