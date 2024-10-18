import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AsignaturaService } from '../../../services/asignatura.service';
import { AsignaturaDTO } from '../../../dtos/asignatura.dto';
import { AreaService } from '../../../services/area.service';
import { AreaDTO } from '../../../dtos/area.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-asignatura',
  templateUrl: './agregar-asignatura.component.html',
  styleUrls: ['./agregar-asignatura.component.css'],
})
export class AgregarAsignaturaComponent implements OnInit {
  formGroup: FormGroup;
  @Input() asignatura?: AsignaturaDTO;
  @Output() asignaturaGuardada = new EventEmitter<AsignaturaDTO>();
  isEditMode: boolean = false;
  areas: AreaDTO[] = [];

  constructor(
    private bsAgregarAsignatura: BsModalRef,
    private asignaturaService: AsignaturaService,
    private areaService: AreaService
  ) {
    this.formGroup = new FormGroup({
      NombreAsignatura: new FormControl('', [Validators.required]),
      areaId: new FormControl('', [Validators.required]),
    });
  }

  get Controls() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.cargarAreas();
    if (this.asignatura) {
      this.formGroup.patchValue({
        NombreAsignatura: this.asignatura.asigNombre,
        areaId: this.asignatura.idarea,
      });
      this.isEditMode = true;
    }
  }

  cargarAreas() {
    this.areaService.getAreas().subscribe(
      (areas: AreaDTO[]) => {
        this.areas = areas;
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

  AgregarAsignatura() {
    if (this.formGroup.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Campos vacíos. Por favor, complete todos los campos.',
        showConfirmButton: true,
      });
      return;
    }

    const nuevaAsignatura: AsignaturaDTO = {
      idasignatura: this.isEditMode && this.asignatura ? this.asignatura.idasignatura : 0,
      asigNombre: this.formGroup.value.NombreAsignatura,
      idarea: this.formGroup.value.areaId,
    };

    const observador = this.isEditMode
      ? this.asignaturaService.updateAsignatura(nuevaAsignatura)
      : this.asignaturaService.createAsignatura(nuevaAsignatura);

    observador.subscribe(
      (data) => {
        this.asignaturaGuardada.emit(data);
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Asignatura actualizada' : 'Asignatura guardada',
          text: this.isEditMode ? 'La asignatura ha sido actualizada correctamente.' : 'La asignatura ha sido guardada correctamente.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.CerrarModal();
      },
      (error) => {
        let errorMessage = 'Hubo un problema al guardar la asignatura.';
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
        console.error('Error al guardar asignatura:', error);
      }
    );
  }

  CerrarModal() {
    this.bsAgregarAsignatura.hide();
  }
}
