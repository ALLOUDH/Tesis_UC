import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-agregar-area-academica',
  templateUrl: './agregar-area-academica.component.html',
  styleUrl: './agregar-area-academica.component.css'
})
export class AgregarAreaAcademicaComponent {

  formGroup: FormGroup
  fechaActual: Date = new Date();

  constructor(
    private modalService: BsModalService,
    private bsAgregarAreaAsignatura: BsModalRef,

  ) { this.formGroup = new FormGroup({
      NombreAreaAsignatura: new FormControl('', [Validators.required]),
  });
  }

  AgregarAreaAsignatura() {
    this.bsAgregarAreaAsignatura.hide();
  }
  
  CerrarModal() {
    this.bsAgregarAreaAsignatura.hide();
  }

}
