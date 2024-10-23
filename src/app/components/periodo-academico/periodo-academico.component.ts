import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AgregarPeriodoAcademicoComponent } from './agregar-periodo-academico/agregar-periodo-academico.component';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';

@Component({
  selector: 'app-periodo-academico',
  templateUrl: './periodo-academico.component.html',
  styleUrl: './periodo-academico.component.css'
})
export class PeriodoAcademicoComponent implements OnInit {
  periodos: PeriodoAcademicoDTO[] = [];
  error: string | null = null;
  modalRef?: BsModalRef;

  constructor(
    private bsModalAgregarPeriodo: BsModalRef,
    private periodoService: PeriodoAcademicoService,
    private modalService: BsModalService,

  ) {
  }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void{
    this.periodoService.getPeriodo().subscribe(
      (data: PeriodoAcademicoDTO[]) => {
        this.periodos = data;
        console.log('Periodos cargados:', this.periodos);
      },
      (error) => {
        this.error = 'Error al cargar las áreas: ' + error.message;
        console.error('Error al cargar las áreas:', error);
      }
    );
  }

  abrirModalAgregarPeriodo(periodo?: PeriodoAcademicoDTO): void {
    const initialState = {
      periodo // Pasar el área al modal si está definida (para edición)
    };
  
    const modalRef: BsModalRef = this.modalService.show(AgregarPeriodoAcademicoComponent, { initialState,backdrop: 'static',keyboard: false  });
  
    // Suscribirse al evento 'periodoGuardada' para recargar la lista de áreas cuando se guarde o actualice
    modalRef.content.periodoGuardada.subscribe(() => {
      this.cargarPeriodos(); // Recargar la lista de periodos
    });
  }

  ModalAgregarPeriodo() {
    this.bsModalAgregarPeriodo = this.modalService.show(AgregarPeriodoAcademicoComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    console.log('Agregar nuevo periodo');
  }

  EditarPeriodo(index: number) {
    // Aquí puedes abrir un modal para editar el periodo seleccionado
    console.log('Editar periodo', this.periodos[index]);
  }

  // Método para eliminar un periodo
  EliminarPeriodo(id: number): void {
    // Mostrar alerta de confirmación antes de proceder a eliminar
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
       this.periodoService.deletePeriodo(id).subscribe(
         () => {
           this.cargarPeriodos(); // Recargar periodos después de eliminar
           Swal.fire('Eliminado', 'Periodo eliminado correctamente', 'success'); // Mensaje de éxito
         },
         (error) => {
           console.error('Error al eliminar el periodo:', error);
           Swal.fire('Error', 'No se pudo eliminar el periodo', 'error'); // Mensaje de error
         }
       );
     }else {
       Swal.fire('Cancelado', 'La eliminación ha sido cancelada', 'info'); 
     }// Mensaje de cancelación
   });
 }
}
