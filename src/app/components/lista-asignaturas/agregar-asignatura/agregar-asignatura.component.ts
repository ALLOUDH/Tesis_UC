import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-agregar-asignatura',
  templateUrl: './agregar-asignatura.component.html',
  styleUrl: './agregar-asignatura.component.css'
})
export class AgregarAsignaturaComponent {

  formGroup: FormGroup
  fechaActual: Date = new Date();

  constructor(
    private modalService: BsModalService,
    private bsAgregarAsignatura: BsModalRef,

  ) { this.formGroup = new FormGroup({
      NombreAsignatura: new FormControl('', [Validators.required]),
  });
  }

  AgregarAsignatura() {
    this.bsAgregarAsignatura.hide();
  }
  
  CerrarModal() {
    this.bsAgregarAsignatura.hide();
  }

}
