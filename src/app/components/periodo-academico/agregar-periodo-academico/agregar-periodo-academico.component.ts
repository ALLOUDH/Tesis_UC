import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PeriodoAcademicoDTO } from '../../../dtos/periodoacademico.dto';
import { PeriodoAcademicoService } from '../../../services/periodo-academico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-periodo-academico',
  templateUrl: './agregar-periodo-academico.component.html',
  styleUrl: './agregar-periodo-academico.component.css'
})
export class AgregarPeriodoAcademicoComponent implements OnInit {

  formGroup: FormGroup
  fechaActual: Date = new Date();
  @Input() periodo?: PeriodoAcademicoDTO; // El periodo que se edita (si existe)
  @Output() periodoGuardada = new EventEmitter<PeriodoAcademicoDTO>(); // Emitir el periodo guardada o actualizada
  isEditMode: boolean = false;

  constructor(
    private bsModalRef: BsModalRef,
    private periodoService: PeriodoAcademicoService,
    private fb: FormBuilder

  ) {
    this.formGroup = new FormGroup({
      NombrePeriodoAcademico: new FormControl('', [Validators.required]),
      inputFechaInicioPeriodoAcademico: new FormControl('', [Validators.required]),
      inputFechaFinPeriodoAcademico: new FormControl('', [Validators.required])
    });
  }

  get Controls() {
    return this.formGroup?.controls;
  }

  ngOnInit(): void {
    // Si la categoria ya existe (edición), rellenar el formulario
    if (this.periodo) {
      this.formGroup.patchValue({ NombrePeriodoAcademico: this.periodo.peNombre });
      this.formGroup.patchValue({ inputFechaInicioPeriodoAcademico: this.periodo.peFechaIni });
      this.formGroup.patchValue({ inputFechaFinPeriodoAcademico: this.periodo.peFechaFin });
      this.isEditMode = true;
    }
  }

  // Método para agregar o actualizar el periodo
  guardarPeriodoAcademico(): void {
    if (this.formGroup.valid) {
      const nuevaPeriodo: PeriodoAcademicoDTO = {
        idperiodo: this.periodo ? this.periodo.idperiodo : 0, // Usar el ID si es una edición, 0 si es nuevo
        peNombre: this.formGroup.value.NombrePeriodoAcademico,
        peFechaIni: this.formGroup.value.inputFechaInicioPeriodoAcademico,
        peFechaFin: this.formGroup.value.inputFechaFinPeriodoAcademico,
      };

      // Si estamos editando un periodo existente
      if (this.periodo) {
        this.periodoService.updatePeriodo(nuevaPeriodo).subscribe(
          () => {
            this.periodoGuardada.emit(nuevaPeriodo); // Emitir el periodo actualizado
            Swal.fire('Éxito', 'Periodo actualizado correctamente', 'success');
            this.bsModalRef.hide(); // Cerrar el modal
            console.log(nuevaPeriodo);
          },
          (error) => {
            console.error('Error al actualizar el periodo:', error);
          }
        );
      } else {
        // Si estamos creando un nuevo periodo
        this.periodoService.createPeriodo(nuevaPeriodo).subscribe(
          (periodoCreada: PeriodoAcademicoDTO) => {
            this.periodoGuardada.emit(periodoCreada); // Emitir el periodo creada
            Swal.fire('Éxito', 'Periodo guardada correctamente', 'success');
            this.bsModalRef.hide(); // Cerrar el modal

          },
          (error) => {
            console.error('Error al crear el periodo:', error);
            console.log('Validation Errors:', error.error.errors);
            console.log(nuevaPeriodo);
          }
        );
      }
    }else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Campos vacíos. Por favor, complete todos los campos.',
        showConfirmButton: true,
      });
    }
  }


  CerrarModal() {
    this.bsModalRef.hide();
  }

}
