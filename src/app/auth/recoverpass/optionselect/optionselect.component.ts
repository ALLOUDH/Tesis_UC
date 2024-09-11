import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ValidatesecuritycodeComponent } from '../validatesecuritycode/validatesecuritycode.component';

@Component({
  selector: 'app-optionselect',
  templateUrl: './optionselect.component.html',
  styleUrl: './optionselect.component.css'
})
export class OptionselectComponent {

  constructor(
    private modalService: BsModalService,
    private bsModalOptionSelect: BsModalRef
  ) {

  }
  
  /// Autor: Hector Chavez Perez
  /// Fecha: 02/09/2024
  /// Vesión: 1.0
  /// <sumary>
  /// Método que permite cerrar el modal
  /// </sumary>
  CerrarModal() {
    this.bsModalOptionSelect.hide();
  }

  /// Autor: Hector Chavez Perez
  /// Fecha: 02/09/2024
  /// Vesión: 1.0
  /// <sumary>
  /// Método que permite cerrar el modal
  /// </sumary>
  AbrirModalValidateSecurityCode() {
    this.bsModalOptionSelect.hide();
    setTimeout(() => {
      this.modalService.show(ValidatesecuritycodeComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    }, 300);
  }
}
