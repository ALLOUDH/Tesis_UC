import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgregarAsignaturaComponent } from './agregar-asignatura/agregar-asignatura.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-asignaturas',
  templateUrl: './lista-asignaturas.component.html',
  styleUrl: './lista-asignaturas.component.css'
})
export class ListaAsignaturasComponent {

  constructor(
    private router: Router,
    private bsModalAgregarAsignatura: BsModalRef,
    private modalService: BsModalService,

  ) {
  }

  asignaturas = [
    { nombre: 'Aritmética', nombrearea: 'Matemática' },
    { nombre: 'Algebra', nombrearea: 'Matemática' },
    { nombre: 'Geometría', nombrearea: 'Matemática' },
    { nombre: 'Trigonometría', nombrearea: 'Matemática' },
    { nombre: 'Razonamiento Matemático', nombrearea: 'Matemática' }
  ];

  ModalAgregarAsignatura() {
    this.bsModalAgregarAsignatura = this.modalService.show(AgregarAsignaturaComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    console.log('Agregar nueva asignatura');
  }

  EditarAsignatura(index: number) {
    // Aquí puedes abrir un modal para editar el asignatura seleccionado
    console.log('Editar asignatura', this.asignaturas[index]);
  }

  EliminarAsignatura(index: number) {
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
        this.asignaturas.splice(index, 1); //Eliminación a nivel interfaz
        Swal.fire(
          '¡Eliminado!',
          'La asignatura ha sido eliminada.',
          'success'
        );
      }
    });

  }
}
