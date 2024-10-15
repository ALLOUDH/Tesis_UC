import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgregarTipoNotaComponent } from './agregar-tipo-nota/agregar-tipo-nota.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-tipos-notas',
  templateUrl: './lista-tipos-notas.component.html',
  styleUrl: './lista-tipos-notas.component.css'
})
export class ListaTiposNotasComponent {

  constructor(
    private router: Router,
    private bsModalAgregarTipoNota: BsModalRef,
    private modalService: BsModalService,

  ) {
  }

  tipos = [
    { nombre: 'Tarea 1', categoria:'Registro Auxiliar',},
    { nombre: 'Tarea 2', categoria:'Registro Auxiliar'},
    { nombre: 'Fast Test', categoria:'Registro Auxiliar'},
    { nombre: 'Aptitudinal', categoria:'Conducta'},
    { nombre: 'Examen Formativo', categoria:'Notas del Padre '},
  ];

  ModalAgregarTipoNota() {
    this.bsModalAgregarTipoNota = this.modalService.show(AgregarTipoNotaComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    console.log('Agregar nueva tipo de nota');
  }

  EditarTipoNota(index: number) {
    // Aquí puedes abrir un modal para editar el tipo de nota seleccionado
    console.log('Editar tipo de nota', this.tipos[index]);
  }

  EliminarTipoNota(index: number) {
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
        this.tipos.splice(index, 1); //Eliminación a nivel interfaz
        Swal.fire(
          '¡Eliminado!',
          'El tipo de nota ha sido eliminada.',
          'success'
        );
      }
    });

  }
}
