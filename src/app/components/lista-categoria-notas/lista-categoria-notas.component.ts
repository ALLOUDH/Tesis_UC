import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgregarCategoriaNotaComponent } from './agregar-categoria-nota/agregar-categoria-nota.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-categoria-notas',
  templateUrl: './lista-categoria-notas.component.html',
  styleUrl: './lista-categoria-notas.component.css'
})
export class ListaCategoriaNotasComponent {

  constructor(
    private router: Router,
    private bsModalAgregarCategoriaNota: BsModalRef,
    private modalService: BsModalService,

  ) {
  }

  categorias = [
    { nombre: 'Registro Auxiliar'},
    { nombre: 'Conducta'},
    { nombre: 'Notas del Padre'},
  ];

  ModalAgregarCategoriaNotas() {
    this.bsModalAgregarCategoriaNota = this.modalService.show(AgregarCategoriaNotaComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    console.log('Agregar nueva categoria de nota');
  }

  EditarCategoriaNotas(index: number) {
    // Aquí puedes abrir un modal para editar el categoria de nota seleccionado
    console.log('Editar categoria de nota', this.categorias[index]);
  }

  EliminarCategoriaNotas(index: number) {
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
        //Logica de programación
        this.categorias.splice(index, 1); //Eliminación a nivel interfaz
        Swal.fire(
          '¡Eliminado!',
          'La categoria de nota ha sido eliminada.',
          'success'
        );
      }
    });

  }
}
