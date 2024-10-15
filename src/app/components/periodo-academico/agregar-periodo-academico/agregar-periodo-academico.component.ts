import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-periodo-academico',
  templateUrl: './agregar-periodo-academico.component.html',
  styleUrl: './agregar-periodo-academico.component.css'
})
export class AgregarPeriodoAcademicoComponent {

  formGroup: FormGroup
  fechaActual: Date = new Date();

  constructor(
    private modalService: BsModalService,
    private bsAgregarPeriodoAcademico: BsModalRef,

  ) { this.formGroup = new FormGroup({
      NombrePeriodoAcademico: new FormControl('', [Validators.required]),
      inputFechaInicioPeriodoAcademico: new FormControl('', [Validators.required]),
      inputFechaFinPeriodoAcademico: new FormControl('', [Validators.required])
  });
  }

  AgregarPeriodoAcademico() {
    this.bsAgregarPeriodoAcademico.hide();
  }
  
  CerrarModal() {
    this.bsAgregarPeriodoAcademico.hide();
  }

}
