import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-agregar-unidad-academica',
  templateUrl: './agregar-unidad-academica.component.html',
  styleUrl: './agregar-unidad-academica.component.css'
})
export class AgregarUnidadAcademicaComponent {

  formGroup: FormGroup
  fechaActual: Date = new Date();

  constructor(
    private modalService: BsModalService,
    private bsAgregarUnidadAcademico: BsModalRef,

  ) { this.formGroup = new FormGroup({
      NombreUnidadAcademico: new FormControl('', [Validators.required]),
  });
  }

  AgregarUnidadAcademico() {
    this.bsAgregarUnidadAcademico.hide();
  }
  
  CerrarModal() {
    this.bsAgregarUnidadAcademico.hide();
  }

}
