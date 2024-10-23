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
    // Inicializa el formulario
    this.formGroup = this.fb.group({
      NombrePeriodoAcademico: ['', Validators.required],
      inputFechaInicioPeriodoAcademico: [null, Validators.required], // Inicializa como null
      inputFechaFinPeriodoAcademico: [null, Validators.required] // Inicializa como null
    });

    // Si el periodo ya existe (edición), rellenar el formulario
    if (this.periodo) {
      this.formGroup.patchValue({
        NombrePeriodoAcademico: this.periodo.peNombre,
        inputFechaInicioPeriodoAcademico: this.periodo.peFechaIni, // Asegúrate de que este valor sea el tipo correcto (string o Date)
        inputFechaFinPeriodoAcademico: this.periodo.peFechaFin, // Asegúrate de que este valor sea el tipo correcto (string o Date)
      });
      this.isEditMode = true;
    }
  }

  // Función para formatear la fecha en yyyy-MM-dd
  formatearFecha(fecha: Date): string {
    // Convertir la fecha a UTC para evitar problemas de zona horaria
    const utcDate = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());

    const year = utcDate.getFullYear();
    const month = ('0' + (utcDate.getMonth() + 1)).slice(-2); // Mes de 2 dígitos
    const day = ('0' + utcDate.getDate()).slice(-2); // Día de 2 dígitos
    return `${year}-${month}-${day}`; // Cambiar a '-' para el formato esperado
  }

  guardarPeriodoAcademico(): void {
    if (this.formGroup.valid) {
      // Las fechas se mantienen como string en el formato esperado
      const nuevaPeriodo: PeriodoAcademicoDTO = {
        idperiodo: this.periodo ? this.periodo.idperiodo : 0,
        peNombre: this.formGroup.value.NombrePeriodoAcademico,
        peFechaIni: this.formatearFecha(new Date(this.formGroup.value.inputFechaInicioPeriodoAcademico)), // Usar la función de formateo
        peFechaFin: this.formatearFecha(new Date(this.formGroup.value.inputFechaFinPeriodoAcademico)), // Usar la función de formateo
      };

      // Resto del código se mantiene igual
      if (this.periodo) {
        this.periodoService.updatePeriodo(nuevaPeriodo).subscribe(
          () => {
            this.periodoGuardada.emit(nuevaPeriodo);
            Swal.fire('Éxito', 'Periodo actualizado correctamente', 'success');
            this.bsModalRef.hide();
          },
          (error) => {
            console.error('Error al actualizar el periodo:', error);
          }
        );
      } else {
        this.periodoService.createPeriodo(nuevaPeriodo).subscribe(
          (periodoCreada: PeriodoAcademicoDTO) => {
            this.periodoGuardada.emit(periodoCreada);
            Swal.fire('Éxito', 'Periodo guardada correctamente', 'success');
            this.bsModalRef.hide();
          },
          (error) => {
            console.error('Error al crear el periodo:', error);
            console.log('Validation Errors:', error.error.errors);
          }
        );
      }
    } else {
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
