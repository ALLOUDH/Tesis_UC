import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BimestreAcademicoDTO } from '../../../dtos/bimestreacademico.dto';
import { BimestreAcademicoService } from '../../../services/bimestre-academico.service';
import { PeriodoAcademicoService } from '../../../services/periodo-academico.service';
import { PeriodoAcademicoDTO } from '../../../dtos/periodoacademico.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-bimestre-academico',
  templateUrl: './agregar-bimestre-academico.component.html',
  styleUrl: './agregar-bimestre-academico.component.css'
})
export class AgregarBimestreAcademicoComponent implements OnInit{

  formGroup: FormGroup
  @Input() bimestre?: BimestreAcademicoDTO;
  @Output() bimestreGuardada = new EventEmitter<BimestreAcademicoDTO>();
  isEditMode: boolean = false;
  periodos: PeriodoAcademicoDTO[] = [];

  constructor(
    private bsAgregarBimestreAcademico: BsModalRef,
    private bimestreService: BimestreAcademicoService,
    private periodoService: PeriodoAcademicoService


  ) { this.formGroup = new FormGroup({
      NombreBimestreAcademico: new FormControl('', [Validators.required]),
      inputFechaInicioBimestreAcademico: new FormControl('', [Validators.required]),
      inputFechaFinBimestreAcademico: new FormControl('', [Validators.required]),
      periodoId: new FormControl('', [Validators.required])
  });
  }

  get Controls() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.cargarPeriodos();
    if (this.bimestre) {
      this.formGroup.patchValue({
        NombreBimestreAcademico: this.bimestre.biNombre,
        inputFechaInicioBimestreAcademico: this.bimestre.biFechaIni,
        inputFechaFinBimestreAcademico: this.bimestre.biFechaFin,
        periodoId: this.bimestre.idperiodo,
      });
      this.isEditMode = true;
    }
  }

  cargarPeriodos() {
    this.periodoService.getPeriodo().subscribe(
      (periodos: PeriodoAcademicoDTO[]) => {
        this.periodos = periodos;
      },
      (error) => {
        console.error('Error al cargar áreas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las áreas. Intenta nuevamente.',
          showConfirmButton: true,
        });
      }
    );
  }

  AgregarBimestreAcademico() {
    if (this.formGroup.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Campos vacíos. Por favor, complete todos los campos.',
        showConfirmButton: true,
      });
      return;
    }
  
    // Validación de las fechas (opcional)
    const fechaInicio = this.formGroup.value.inputFechaInicioBimestreAcademico;
    const fechaFin = this.formGroup.value.inputFechaFinBimestreAcademico;
  
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La fecha de inicio no puede ser mayor que la fecha de fin.',
        showConfirmButton: true,
      });
      return;
    }
  
    const nuevoBimestre: BimestreAcademicoDTO = {
      idbimestre: this.isEditMode && this.bimestre ? this.bimestre.idbimestre : 0,
      biNombre: this.formGroup.value.NombreBimestreAcademico,
      biFechaIni: fechaInicio,
      biFechaFin: fechaFin,
      idperiodo: this.formGroup.value.periodoId,
    };
  
    const observador = this.isEditMode
      ? this.bimestreService.updateBimestre(nuevoBimestre)
      : this.bimestreService.createBimestre(nuevoBimestre);
  
    observador.subscribe(
      (data) => {
        this.bimestreGuardada.emit(data);
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Bimestre actualizado' : 'Bimestre guardado',
          text: this.isEditMode
            ? 'El bimestre ha sido actualizado correctamente.'
            : 'El bimestre ha sido guardado correctamente.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.CerrarModal();
      },
      (error) => {
        let errorMessage = 'Hubo un problema al guardar el bimestre.';
        if (error.status === 400) {
          errorMessage = 'Error en los datos proporcionados.';
        } else if (error.status === 500) {
          errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
        }
  
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          showConfirmButton: true,
        });
        console.error('Error al guardar bimestre:', error);
      }
    );
  }
  
  CerrarModal() {
    this.bsAgregarBimestreAcademico.hide();
  }

}
