import { ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OptionselectComponent } from './optionselect/optionselect.component';

@Component({
  selector: 'app-recoverpass',
  templateUrl: './recoverpass.component.html',
  styleUrl: './recoverpass.component.css'
})
export class RecoverpassComponent {

  constructor(
    private modalService: BsModalService,
    private bsModalRecoverPass: BsModalRef
  ) {

  }

  /// Autor: Hector Chavez Perez
  /// Fecha: 02/09/2024
  /// Vesión: 1.0
  /// <sumary>
  /// Método que permite cerrar el modal
  /// </sumary>
  CerrarModal() {
    this.bsModalRecoverPass.hide();
  }

  /// Autor: Hector Chavez Perez
  /// Fecha: 02/09/2024
  /// Vesión: 1.0
  /// <sumary>
  /// Método que permite cerrar el modal
  /// </sumary>
  AbrirModalOptionSelect() {
    this.bsModalRecoverPass.hide();
    setTimeout(() => {
      this.modalService.show(OptionselectComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    }, 300);
  }
}
