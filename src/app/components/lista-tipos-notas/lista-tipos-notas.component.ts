import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgregarTipoNotaComponent } from './agregar-tipo-nota/agregar-tipo-nota.component';
import Swal from 'sweetalert2';
import { TipoNotasDTO } from '../../dtos/tiponotas.dto';
import { CategoriaNotasDTO } from '../../dtos/categorianotas.dto';
import { TiponotasService } from '../../services/tiponotas.service';
import { CategorianotasService } from '../../services/categorianotas.service';

@Component({
  selector: 'app-lista-tipos-notas',
  templateUrl: './lista-tipos-notas.component.html',
  styleUrl: './lista-tipos-notas.component.css'
})
export class ListaTiposNotasComponent implements OnInit {
  tipos: (TipoNotasDTO & { categoriaNombre: string })[] = [];
  categorias: CategoriaNotasDTO[] = [];
  error: string | null = null;
  modalRef?: BsModalRef;

  constructor(
    private router: Router,
    private bsModalAgregarTipoNota: BsModalRef,
    private modalService: BsModalService,
    private tiponotasService: TiponotasService,
    private categoriaService: CategorianotasService

  ) {
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (data: CategoriaNotasDTO[]) => {
        this.categorias = data;
        this.cargarTipoNotas(); // Cargar tipos después de que las categorias estén disponibles
      },
      (error) => {
        this.error = 'Error al cargar las categorías: ' + error.message;
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  cargarTipoNotas(): void {
    this.tiponotasService.getTiposNota().subscribe(
      (data: TipoNotasDTO[]) => {
        this.tipos = data.map((tipo) => {
          const categoria = this.categorias.find((categoria) => categoria.idcategoriaNotas === tipo.idcategoriaNotas);
          return {
            ...tipo,
            categoriaNombre: categoria ? categoria.catNombre : 'Sin área', // Asignar el nombre de la categoria
          };
        });
        console.log('Tipos de notas cargadas:', this.tipos);
      },
      (error) => {
        this.error = 'Error al cargar los tipos de notas: ' + error.message;
        console.error('Error al cargar los tipos de notas:', error);
      }
    );
  }
  abrirModalAgregarTipoNota(tiponota?: TipoNotasDTO): void {
    const initialState = {
      tiponota, // Pasar el tipo al modal si está definida (para edición)
    };

    const modalRef: BsModalRef = this.modalService.show(AgregarTipoNotaComponent, { initialState, backdrop: 'static', keyboard: false,});

    modalRef.content.tiponotaGuardada.subscribe(() => {
      this.cargarTipoNotas(); // Recargar la lista de tipos de notas
    });
  }

  EliminarTipoNota(id: number): void{
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tiponotasService.deleteTipoNota(id).subscribe(
          () => {
            this.cargarTipoNotas(); // Recargar tipo de notas después de eliminar
            Swal.fire('Eliminado', 'Tipo de nota eliminada correctamente', 'success');
          },
          (error) => {
            console.error('Error al eliminar el tipo de nota:', error);
            console.error(id, error);
            Swal.fire('Error', 'No se pudo eliminar el tipo de nota', 'error');
          }
        );
      } else {
        Swal.fire('Cancelado', 'La eliminación ha sido cancelada', 'info');
      }
    });

  }
}
