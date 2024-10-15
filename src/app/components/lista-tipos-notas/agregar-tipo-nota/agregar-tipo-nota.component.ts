import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-agregar-tipo-nota',
  templateUrl: './agregar-tipo-nota.component.html',
  styleUrl: './agregar-tipo-nota.component.css'
})
export class AgregarTipoNotaComponent {

  formGroup: FormGroup
  fechaActual: Date = new Date();

  constructor(
    private modalService: BsModalService,
    private bsAgregarTipoNotas: BsModalRef,

  ) { this.formGroup = new FormGroup({
      NombreTipoNotas: new FormControl('', [Validators.required]),
  });
  }

  AgregarTipoNotas() {
    this.bsAgregarTipoNotas.hide();
  }
  
  CerrarModal() {
    this.bsAgregarTipoNotas.hide();
  }

}
