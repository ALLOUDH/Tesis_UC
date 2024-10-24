import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
    private bsModalRef: BsModalRef,
    private bsAgregarBimestreAcademico: BsModalRef,
    private bimestreService: BimestreAcademicoService,
    private periodoService: PeriodoAcademicoService,
    private fb: FormBuilder


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
/*
  ngOnInit(): void {
    this.cargarPeriodos();
    if (this.bimestre) {
      this.formGroup.patchValue({
        NombreBimestreAcademico: this.bimestre.biNombre,
        inputFechaInicioBimestreAcademico: this.bimestre.biFechaIni, // Asegúrate de que este valor sea el tipo correcto (string o Date)
        inputFechaFinBimestreAcademico: this.bimestre.biFechaFin, // Asegúrate de que este valor sea el tipo correcto (string o Date)
        periodoId: this.bimestre.idperiodo,
      });
      this.isEditMode = true;
    }
  }
*/

  ngOnInit(): void {
    this.cargarPeriodos();
    // Inicializa el formulario
    this.formGroup = this.fb.group({
      NombreBimestreAcademico: ['', Validators.required],
      inputFechaInicioBimestreAcademico: [null, Validators.required], // Inicializa como null
      inputFechaFinBimestreAcademico: [null, Validators.required], // Inicializa como null
      periodoId: [null, Validators.required]
    });

    // Si el periodo ya existe (edición), rellenar el formulario
    if (this.bimestre) {
      this.formGroup.patchValue({
        NombreBimestreAcademico: this.bimestre.biNombre,
        inputFechaInicioBimestreAcademico: this.bimestre.biFechaIni, // Asegúrate de que este valor sea el tipo correcto (string o Date)
        inputFechaFinBimestreAcademico: this.bimestre.biFechaFin, // Asegúrate de que este valor sea el tipo correcto (string o Date)
        periodoId: this.bimestre.idperiodo
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

/*
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
  
    const nuevoBimestre: BimestreAcademicoDTO = {
      idbimestre: this.isEditMode && this.bimestre ? this.bimestre.idbimestre : 0,
      biNombre: this.formGroup.value.NombreBimestreAcademico,
      biFechaIni: this.formatearFecha(new Date(this.formGroup.value.inputFechaInicioBimestreAcademico)), // Usar la función de formateo
      biFechaFin: this.formatearFecha(new Date(this.formGroup.value.inputFechaFinBimestreAcademico)), // Usar la función de formateo
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
          console.log(nuevoBimestre)
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
*/

  AgregarBimestreAcademico(): void {
    if (this.formGroup.valid) {
      // Las fechas se mantienen como string en el formato esperado
      const nuevoBimestre: BimestreAcademicoDTO = {
      idbimestre: this.isEditMode && this.bimestre ? this.bimestre.idbimestre : 0,
      biNombre: this.formGroup.value.NombreBimestreAcademico,
      biFechaIni: this.formatearFecha(new Date(this.formGroup.value.inputFechaInicioBimestreAcademico)), // Usar la función de formateo
      biFechaFin: this.formatearFecha(new Date(this.formGroup.value.inputFechaFinBimestreAcademico)), // Usar la función de formateo
      idperiodo: this.formGroup.value.periodoId,
      };

      // Resto del código se mantiene igual
      if (this.bimestre) {
        this.bimestreService.updateBimestre(nuevoBimestre).subscribe(
          () => {
            this.bimestreGuardada.emit(nuevoBimestre);
            Swal.fire('Éxito', 'Bimestre actualizado correctamente', 'success');
            this.bsModalRef.hide();
          },
          (error) => {
            console.error('Error al actualizar el bimestre:', error);
            console.log(nuevoBimestre)
          }
        );
      } else {
        this.bimestreService.createBimestre(nuevoBimestre).subscribe(
          (bimestreCreada: BimestreAcademicoDTO) => {
            this.bimestreGuardada.emit(bimestreCreada);
            Swal.fire('Éxito', 'Bimestre guardada correctamente', 'success');
            this.bsModalRef.hide();
          },
          (error) => {
            console.error('Error al crear el bimestre:', error);
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
    this.bsAgregarBimestreAcademico.hide();
  }

}
