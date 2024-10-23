import { Component, OnInit } from '@angular/core';
import { CategorianotasService } from '../../services/categorianotas.service';
import { CategoriaNotasDTO } from '../../dtos/categorianotas.dto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgregarCategoriaNotaComponent } from './agregar-categoria-nota/agregar-categoria-nota.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-lista-categoria-notas',
  templateUrl: './lista-categoria-notas.component.html',
  styleUrl: './lista-categoria-notas.component.css'
})
export class ListaCategoriaNotasComponent implements OnInit{
  categorias: CategoriaNotasDTO[] = [];
  error: string | null = null;
  modalRef?: BsModalRef


  constructor(
    private categoriaService: CategorianotasService,
    private modalService: BsModalService,

  ) {
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(
      (data: CategoriaNotasDTO[]) => {
        this.categorias = data;
        console.log('Categorias cargadas:', this.categorias);
      },
      (error) => {
        this.error = 'Error al cargar las categorias de notas: ' + error.message;
        console.error('Error al cargar las categorias de notas:', error);
      }
    );
  }

  abrirModalAgregarCategoriaNotas(categoria?: CategoriaNotasDTO): void {
    const initialState = {
      categoria // Pasar el área al modal si está definida (para edición)
    };

    const modalRef: BsModalRef = this.modalService.show(AgregarCategoriaNotaComponent, { initialState, backdrop: 'static', keyboard: false });

    modalRef.content.categoriaGuardada.subscribe(() => {
      this.cargarCategorias(); // Recargar la lista de áreas
    });
  }

  EliminarCategoriaNotas(id: number): void {
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
        this.categoriaService.deleteCategoria(id).subscribe(
          () => {
            this.cargarCategorias(); // Recargar categorias después de eliminar
            Swal.fire('Eliminado', 'Categoría eliminada correctamente', 'success'); // Mensaje de éxito
          },
          (error) => {
            console.error('Error al eliminar el área:', error);
            Swal.fire('Error', 'No se pudo eliminar el área', 'error'); // Mensaje de error
          }
        );
      } else {
        Swal.fire('Cancelado', 'La eliminación ha sido cancelada', 'info'); // Mensaje de cancelación
      }
    });

  }
}
