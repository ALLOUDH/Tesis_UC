import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-docente',
  templateUrl: './editar-docente.component.html',
  styleUrl: './editar-docente.component.css'
})
export class EditarDocenteComponent {
  formGroup: FormGroup
  

  constructor(
    private modalService: BsModalService,
    private bsAgregarDocente: BsModalRef,

  ) { this.formGroup = new FormGroup({
      NombrePeriodoAcademico: new FormControl('', [Validators.required]),
      inputFechaInicioPeriodoAcademico: new FormControl('', [Validators.required]),
      inputFechaFinPeriodoAcademico: new FormControl('', [Validators.required])
  });
  }

  AgregarPeriodoAcademico() {
    this.bsAgregarDocente.hide();
  }
  
  CerrarModal() {
    this.bsAgregarDocente.hide();
  }
}

