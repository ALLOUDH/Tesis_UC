import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgregarBimestreAcademicoComponent } from './agregar-bimestre-academico/agregar-bimestre-academico.component';

@Component({
  selector: 'app-lista-bimestres-academicos',
  templateUrl: './lista-bimestres-academicos.component.html',
  styleUrl: './lista-bimestres-academicos.component.css'
})
export class ListaBimestresAcademicosComponent {

  constructor(
    private router: Router,
    private bsModalAgregarBimestre: BsModalRef,
    private modalService: BsModalService,

  ) {
  }

  bimestres = [
    { nombre: 'I BIMESTRE', fechainicio: '18/03/2024', fechafin: '18/12/2024' },
    { nombre: 'II BIMESTRE', fechainicio: '17/03/2025', fechafin: '19/12/2025'},
    { nombre: 'III BIMESTRE', fechainicio: '16/03/2026', fechafin: '20/12/2026'},
    { nombre: 'IV BIMESTRE', fechainicio: '15/03/2026', fechafin: '21/12/2026' }
  ];

  ModalAgregarBimestre() {
    this.bsModalAgregarBimestre = this.modalService.show(AgregarBimestreAcademicoComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    console.log('Agregar nuevo bimestre');
  }

  EditarBimestre(index: number) {
    // Aquí puedes abrir un modal para editar el bimestre seleccionado
    console.log('Editar bimestre', this.bimestres[index]);
  }

  EliminarBimestre(index: number) {
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
        this.bimestres.splice(index, 1); //Eliminación a nivel interfaz
        Swal.fire(
          '¡Eliminado!',
          'El bimestre ha sido eliminado.',
          'success'
        );
      }
    });

  }
}
