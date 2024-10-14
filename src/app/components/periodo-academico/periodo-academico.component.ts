import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AgregarPeriodoAcademicoComponent } from '../agregar-periodo-academico/agregar-periodo-academico.component';

@Component({
  selector: 'app-periodo-academico',
  templateUrl: './periodo-academico.component.html',
  styleUrl: './periodo-academico.component.css'
})
export class PeriodoAcademicoComponent {

  constructor(
    private router: Router,
    private bsModalAgregarPeriodo: BsModalRef,
    private modalService: BsModalService,

  ) {
  }

  periodos = [
    { nombre: '2024', fechainicio: '18/03/2024', fechafin: '18/12/2024' },
    { nombre: '2025', fechainicio: '17/03/2025', fechafin: '19/12/2025'},
    { nombre: '2026', fechainicio: '16/03/2026', fechafin: '20/12/2026' }
  ];

  ModalAgregarPeriodo() {
    this.bsModalAgregarPeriodo = this.modalService.show(AgregarPeriodoAcademicoComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    console.log('Agregar nuevo periodo');
  }

  EditarPeriodo(index: number) {
    // Aquí puedes abrir un modal para editar el periodo seleccionado
    console.log('Editar periodo', this.periodos[index]);
  }

  EliminarPeriodo(index: number) {
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
        this.periodos.splice(index, 1); //Eliminación a nivel interfaz
        Swal.fire(
          '¡Eliminado!',
          'El periodo ha sido eliminado.',
          'success'
        );
      }
    });

  }
}
