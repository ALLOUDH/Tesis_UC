import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-agregar-bimestre-academico',
  templateUrl: './agregar-bimestre-academico.component.html',
  styleUrl: './agregar-bimestre-academico.component.css'
})
export class AgregarBimestreAcademicoComponent {

  formGroup: FormGroup
  fechaActual: Date = new Date();

  constructor(
    private modalService: BsModalService,
    private bsAgregarBimestreAcademico: BsModalRef,

  ) { this.formGroup = new FormGroup({
      NombreBimestreAcademico: new FormControl('', [Validators.required]),
      inputFechaInicioBimestreAcademico: new FormControl('', [Validators.required]),
      inputFechaFinBimestreAcademico: new FormControl('', [Validators.required])
  });
  }

  AgregarBimestreAcademico() {
    this.bsAgregarBimestreAcademico.hide();
  }
  
  CerrarModal() {
    this.bsAgregarBimestreAcademico.hide();
  }

}
