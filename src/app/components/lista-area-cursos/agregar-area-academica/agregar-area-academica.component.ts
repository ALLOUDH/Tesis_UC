import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AreaDTO } from '../../../dtos/area.dto';
import { AreaService } from '../../../services/area.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-area-academica',
  templateUrl: './agregar-area-academica.component.html',
  styleUrl: './agregar-area-academica.component.css'
})
export class AgregarAreaAcademicaComponent implements OnInit {

  formGroup: FormGroup;
  @Input() area?: AreaDTO; // El área que se edita (si existe)
  @Output() areaGuardada = new EventEmitter<AreaDTO>(); // Emitir el área guardada o actualizada
  isEditMode: boolean = false;

  constructor(
    private bsModalRef: BsModalRef,
    private areaService: AreaService
  ) {
    this.formGroup = new FormGroup({
      NombreAreaAsignatura: new FormControl('', [Validators.required]),
    });
  }
  get Controls() {
    return this.formGroup?.controls;
  }

  ngOnInit(): void {
    // Si el área ya existe (edición), rellenar el formulario
    if (this.area) {
      this.formGroup.patchValue({ NombreAreaAsignatura: this.area.areaNombre });
      this.isEditMode = true;
    }
  }

  // Método para agregar o actualizar el área
  guardarAreaAsignatura(): void {
    if (this.formGroup.valid) {
      const nuevaArea: AreaDTO = {
        idArea: this.area ? this.area.idArea : 0, // Usar el ID si es una edición, 0 si es nuevo
        areaNombre: this.formGroup.value.NombreAreaAsignatura,
      };

      // Si estamos editando un área existente
      if (this.area) {
        this.areaService.updateArea(nuevaArea).subscribe(
          () => {
            this.areaGuardada.emit(nuevaArea); // Emitir el área actualizada
            Swal.fire('Éxito', 'Área actualizada correctamente', 'success');
            this.bsModalRef.hide(); // Cerrar el modal
          },
          (error) => {
            console.error('Error al actualizar el área:', error);
          }
        );
      } else {
        // Si estamos creando una nueva área
        this.areaService.createArea(nuevaArea).subscribe(
          (areaCreada: AreaDTO) => {
            this.areaGuardada.emit(areaCreada); // Emitir el área creada
            Swal.fire('Éxito', 'Área guardada correctamente', 'success');
            this.bsModalRef.hide(); // Cerrar el modal
          },
          (error) => {
            console.error('Error al crear el área:', error);
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

  // Método para cerrar el modal sin guardar cambios
  cerrarModal(): void {
    this.bsModalRef.hide();
  }
}
