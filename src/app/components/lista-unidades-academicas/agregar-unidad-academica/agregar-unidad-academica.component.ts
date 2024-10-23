import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UnidadAcademicaDTO } from '../../../dtos/unidadacademica.dto';
import { BimestreAcademicoDTO } from '../../../dtos/bimestreacademico.dto';
import { UnidadAcademicoService } from '../../../services/unidad-academico.service';
import { BimestreAcademicoService } from '../../../services/bimestre-academico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-unidad-academica',
  templateUrl: './agregar-unidad-academica.component.html',
  styleUrl: './agregar-unidad-academica.component.css'
})
export class AgregarUnidadAcademicaComponent implements OnInit{

  formGroup: FormGroup;
  @Input() unidad?: UnidadAcademicaDTO;
  @Output() undidadGuardada = new EventEmitter<UnidadAcademicaDTO>();
  isEditMode: boolean = false;
  bimestres: BimestreAcademicoDTO[] = [];

  constructor(
    private bsAgregarUnidadAcademico: BsModalRef,
    private unidadService: UnidadAcademicoService,
    private bimestreService: BimestreAcademicoService

  ) { this.formGroup = new FormGroup({
      NombreUnidadAcademico: new FormControl('', [Validators.required]),
      bimestreId: new FormControl('', [Validators.required]),
  });
  }

  get Controls() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.cargarBimestres();
    if (this.unidad) {
      this.formGroup.patchValue({
        NombreUnidadAcademico: this.unidad.uniNombre,
        bimestreId: this.unidad.idbimestre,
      });
      this.isEditMode = true;
    }
  }

  cargarBimestres() {
    this.bimestreService.getBimestre().subscribe(
      (bimestres: BimestreAcademicoDTO[]) => {
        this.bimestres = bimestres;
      },
      (error) => {
        console.error('Error al cargar unidades:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las unidades. Intenta nuevamente.',
          showConfirmButton: true,
        });
      }
    );
  }

  AgregarUnidadAcademico() {
    if (this.formGroup.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Campos vacíos. Por favor, complete todos los campos.',
        showConfirmButton: true,
      });
      return;
    }

    const nuevaUnidad: UnidadAcademicaDTO = {
      idunidad: this.isEditMode && this.unidad ? this.unidad.idunidad : 0,
      uniNombre: this.formGroup.value.NombreUnidadAcademico,
      idbimestre: this.formGroup.value.bimestreId,
    };

    const observador = this.isEditMode
      ? this.unidadService.updateUnidad(nuevaUnidad)
      : this.unidadService.createUnidad(nuevaUnidad);

    observador.subscribe(
      (data) => {
        this.undidadGuardada.emit(data);
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Unidad actualizada' : 'Unidad guardada',
          text: this.isEditMode ? 'La unidad ha sido actualizada correctamente.' : 'La unidad ha sido guardada correctamente.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.CerrarModal();
      },
      (error) => {
        let errorMessage = 'Hubo un problema al guardar la unidad.';
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
        console.error('Error al guardar unidad:', error);
      }
    );
  }
  
  CerrarModal() {
    this.bsAgregarUnidadAcademico.hide();
  }

}
