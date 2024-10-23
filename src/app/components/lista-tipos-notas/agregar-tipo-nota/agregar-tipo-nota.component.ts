import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TipoNotasDTO } from '../../../dtos/tiponotas.dto';
import { CategoriaNotasDTO } from '../../../dtos/categorianotas.dto';
import { TiponotasService } from '../../../services/tiponotas.service';
import { CategorianotasService } from '../../../services/categorianotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-tipo-nota',
  templateUrl: './agregar-tipo-nota.component.html',
  styleUrl: './agregar-tipo-nota.component.css'
})
export class AgregarTipoNotaComponent implements OnInit {

  formGroup: FormGroup
  @Input() tiponota?: TipoNotasDTO;
  @Output() tiponotaGuardada = new EventEmitter<TipoNotasDTO>();
  isEditMode: boolean = false;
  fechaActual: Date = new Date();
  categorias: CategoriaNotasDTO[] = [];

  constructor(
    private bsAgregarTipoNotas: BsModalRef,
    private tipoNotasService: TiponotasService,
    private categoriaService: CategorianotasService

  ) { this.formGroup = new FormGroup({
      NombreTipoNotas: new FormControl('', [Validators.required]),
      categoriaId: new FormControl('', [Validators.required]),
  });
  }

  get Controls() {
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.cargarCategoria();
    if (this.tiponota) {
      this.formGroup.patchValue({
        NombreTipoNotas: this.tiponota.tipNoNombre,
        categoriaId: this.tiponota.idcategoriaNotas,
      });
      this.isEditMode = true;
    }
  }

  cargarCategoria() {
    this.categoriaService.getCategorias().subscribe(
      (categorias: CategoriaNotasDTO[]) => {
        this.categorias = categorias;
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las categorias. Intenta nuevamente.',
          showConfirmButton: true,
        });
      }
    );
  }

  AgregarTipoNotas() {
    if (this.formGroup.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Campos vacíos. Por favor, complete todos los campos.',
        showConfirmButton: true,
      });
      return;
    }

    const nuevoTipoNota: TipoNotasDTO = {
      idtipoNotas: this.isEditMode && this.tiponota ? this.tiponota.idtipoNotas : 0,
      tipNoNombre: this.formGroup.value.NombreTipoNotas,
      idcategoriaNotas: this.formGroup.value.categoriaId,
    };

    const observador = this.isEditMode
      ? this.tipoNotasService.updateTipoNota(nuevoTipoNota)
      : this.tipoNotasService.createTipoNota(nuevoTipoNota);

    observador.subscribe(
      (data) => {
        this.tiponotaGuardada.emit(data);
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Tipo de nota actualizada' : 'Tipo de nota guardada',
          text: this.isEditMode ? 'El tipo de nota ha sido actualizada correctamente.' : 'El tipo de nota ha sido guardada correctamente.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.CerrarModal();
      },
      (error) => {
        let errorMessage = 'Hubo un problema al guardar el tipo de nota.';
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
        console.error('Error al guardar el tipo de nota:', error);
      }
    );
  }
  
  CerrarModal() {
    this.bsAgregarTipoNotas.hide();
  }

}
