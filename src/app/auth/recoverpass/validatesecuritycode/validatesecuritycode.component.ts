import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OptionselectComponent } from '../optionselect/optionselect.component';
import { ChangepassComponent } from '../changepass/changepass.component';

@Component({
  selector: 'app-validatesecuritycode',
  templateUrl: './validatesecuritycode.component.html',
  styleUrl: './validatesecuritycode.component.css'
})
export class ValidatesecuritycodeComponent {

  constructor(
    private modalService: BsModalService,
    private bsModalValidateSecurityCode: BsModalRef
  ) {

  }
  
  /// Autor: Hector Chavez Perez
  /// Fecha: 02/09/2024
  /// Vesión: 1.0
  /// <sumary>
  /// Método que permite cerrar el modal
  /// </sumary>
  CerrarModal() {
    this.bsModalValidateSecurityCode.hide();
  }

  /// Autor: Hector Chavez Perez
  /// Fecha: 02/09/2024
  /// Vesión: 1.0
  /// <sumary>
  /// Método que permite cerrar el modal
  /// </sumary>
  AbrirModalRecoverPass() {
    this.bsModalValidateSecurityCode.hide();
    setTimeout(() => {
      this.modalService.show(ChangepassComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    }, 300);
  }

}
