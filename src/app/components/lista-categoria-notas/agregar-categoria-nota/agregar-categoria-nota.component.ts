import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CategoriaNotasDTO } from '../../../dtos/categorianotas.dto';
import { CategorianotasService } from '../../../services/categorianotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-categoria-nota',
  templateUrl: './agregar-categoria-nota.component.html',
  styleUrl: './agregar-categoria-nota.component.css'
})
export class AgregarCategoriaNotaComponent implements OnInit {

  formGroup: FormGroup;
  fechaActual: Date = new Date();
  @Input() categoria?: CategoriaNotasDTO; 
  @Output() categoriaGuardada = new EventEmitter<CategoriaNotasDTO>(); 
  isEditMode: boolean = false;

  constructor(
    private bsModalRef: BsModalRef,
    private categoriaService: CategorianotasService

  ) { this.formGroup = new FormGroup({
      NombreCategoriaNotas: new FormControl('', [Validators.required]),
  });
  }

  get Controls() {
    return this.formGroup?.controls;
  }

  ngOnInit(): void {
    // Si el área ya existe (edición), rellenar el formulario
    if (this.categoria) {
      this.formGroup.patchValue({ NombreCategoriaNotas: this.categoria.catNombre});
      this.isEditMode = true;
    }
  }

  // Método para agregar o actualizar la categoría
  guardarCategoriaNotas():void {
    if (this.formGroup.valid) {
      const nuevaCategoria: CategoriaNotasDTO = {
        idcategoriaNotas: this.categoria ? this.categoria.idcategoriaNotas : 0, // Usar el ID si es una edición, 0 si es nuevo
        catNombre: this.formGroup.value.NombreCategoriaNotas,
      };

      // Si estamos editando una categoria existente
      if (this.categoria) {
        this.categoriaService.updateCategoria(nuevaCategoria).subscribe(
          () => {
            this.categoriaGuardada.emit(nuevaCategoria); // Emitir la categoria actualizada
            Swal.fire('Éxito', 'Categoría actualizada correctamente', 'success');
            this.bsModalRef.hide(); // Cerrar el modal
          },
          (error) => {
            console.error('Error al actualizar la categoría:', error);
          }
        );
      } else {
        // Si estamos creando una nueva área
        this.categoriaService.createCategoria(nuevaCategoria).subscribe(
          (areaCreada: CategoriaNotasDTO) => {
            this.categoriaGuardada.emit(areaCreada); // Emitir la categoría creada
            Swal.fire('Éxito', 'Categoría guardada correctamente', 'success');
            this.bsModalRef.hide(); // Cerrar el modal
          },
          (error) => {
            console.error('Error al crear el categoría:', error);
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
