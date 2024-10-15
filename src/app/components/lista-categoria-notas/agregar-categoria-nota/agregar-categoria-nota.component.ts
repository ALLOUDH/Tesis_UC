import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-agregar-categoria-nota',
  templateUrl: './agregar-categoria-nota.component.html',
  styleUrl: './agregar-categoria-nota.component.css'
})
export class AgregarCategoriaNotaComponent {

  formGroup: FormGroup
  fechaActual: Date = new Date();

  constructor(
    private modalService: BsModalService,
    private bsAgregarCategoriaNotas: BsModalRef,

  ) { this.formGroup = new FormGroup({
      NombreCategoriaNotas: new FormControl('', [Validators.required]),
  });
  }

  AgregarCategoriaNotas() {
    this.bsAgregarCategoriaNotas.hide();
  }
  
  CerrarModal() {
    this.bsAgregarCategoriaNotas.hide();
  }

}
