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

  constructor(
    private modalService: BsModalService,
    private bsModalRecoverPass: BsModalRef,

  ) { this.formGroup = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      fechaInicio: new FormControl('', [Validators.required]),
      fechaFin: new FormControl('', [Validators.required])
  });
  }

  AgregarPeriodoAcademico() {
    this.bsModalRecoverPass.hide();
  }
  
  CerrarModal() {
    this.bsModalRecoverPass.hide();
  }

}
