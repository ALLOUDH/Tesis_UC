import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AgregarAreaAcademicaComponent } from './agregar-area-academica/agregar-area-academica.component';

@Component({
  selector: 'app-lista-area-cursos',
  templateUrl: './lista-area-cursos.component.html',
  styleUrl: './lista-area-cursos.component.css'
})
export class ListaAreaCursosComponent {

  constructor(
    private router: Router,
    private bsModalAgregarArea: BsModalRef,
    private modalService: BsModalService,

  ) {
  }

  areas = [
    { nombre: 'MATEMÁTICA'},
    { nombre: 'COMUNICACIÓN'}
  ];

  ModalAgregarArea() {
    this.bsModalAgregarArea = this.modalService.show(AgregarAreaAcademicaComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    console.log('Agregar nueva area');
  }

  EditarArea(index: number) {
    // Aquí puedes abrir un modal para editar el area seleccionado
    console.log('Editar area', this.areas[index]);
  }

  EliminarArea(index: number) {
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
        this.areas.splice(index, 1); //Eliminación a nivel interfaz
        Swal.fire(
          '¡Eliminado!',
          'El área ha sido eliminada.',
          'success'
        );
      }
    });

  }


}
