import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AgregarUnidadAcademicaComponent } from './agregar-unidad-academica/agregar-unidad-academica.component';

@Component({
  selector: 'app-lista-unidades-academicas',
  templateUrl: './lista-unidades-academicas.component.html',
  styleUrl: './lista-unidades-academicas.component.css'
})
export class ListaUnidadesAcademicasComponent {

  constructor(
    private router: Router,
    private bsModalAgregarUnidad: BsModalRef,
    private modalService: BsModalService,

  ) {
  }

  unidades = [
    { nombre: 'Unidad 1'},
    { nombre: 'Unidad 2'},
    { nombre: 'Unidad 3'},
    { nombre: 'Unidad 4'},
    { nombre: 'Unidad 5'},
    { nombre: 'Unidad 6'},
    { nombre: 'Unidad 7'},
    { nombre: 'Unidad 8'}
  ];

  ModalAgregarUnidad() {
    this.bsModalAgregarUnidad = this.modalService.show(AgregarUnidadAcademicaComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    console.log('Agregar nueva unidad');
  }

  EditarUnidad(index: number) {
    // Aquí puedes abrir un modal para editar el unidad seleccionado
    console.log('Editar unidad', this.unidades[index]);
  }

  EliminarUnidad(index: number) {
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
        this.unidades.splice(index, 1); //Eliminación a nivel interfaz
        Swal.fire(
          '¡Eliminado!',
          'La unidad ha sido eliminada.',
          'success'
        );
      }
    });

  }

}
