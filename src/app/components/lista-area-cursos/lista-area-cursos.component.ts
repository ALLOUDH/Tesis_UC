// src/app/components/area.component.ts
import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../services/area.service';
import { AreaDTO } from '../../dtos/area.dto';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AgregarAreaAcademicaComponent } from './agregar-area-academica/agregar-area-academica.component'; // Asegúrate de que la ruta sea correcta

import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-area-cursos',
  templateUrl: './lista-area-cursos.component.html',
  styleUrl: './lista-area-cursos.component.css'
})
export class ListaAreaCursosComponent implements OnInit {
  areas: AreaDTO[] = [];
  error: string | null = null;
  modalRef?: BsModalRef;

  constructor(
    private areaService: AreaService,
    private modalService: BsModalService,
  
  ) {}

  ngOnInit(): void {
    this.cargarAreas();
  }

 
  cargarAreas(): void {
  this.areaService.getAreas().subscribe(
    (data: AreaDTO[]) => {
      this.areas = data;
      console.log('Áreas cargadas:', this.areas);
    },
    (error) => {
      this.error = 'Error al cargar las áreas: ' + error.message;
      console.error('Error al cargar las áreas:', error);
    }
  );
}

abrirModalAgregarArea(area?: AreaDTO): void {
  const initialState = {
    area // Pasar el área al modal si está definida (para edición)
  };

  const modalRef: BsModalRef = this.modalService.show(AgregarAreaAcademicaComponent, { initialState,backdrop: 'static',keyboard: false  });

  // Suscribirse al evento 'areaGuardada' para recargar la lista de áreas cuando se guarde o actualice
  modalRef.content.areaGuardada.subscribe(() => {
    this.cargarAreas(); // Recargar la lista de áreas
  });
}

// Método para eliminar un área
eliminarArea(id: number): void {
  // Mostrar alerta de confirmación antes de proceder a eliminar
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'No, cancelar'
  }).then((result) => {
    if (result.isConfirmed) { // Solo proceder si el usuario confirmó
      this.areaService.deleteArea(id).subscribe(
        () => {
          this.cargarAreas(); // Recargar áreas después de eliminar
          Swal.fire('Eliminado', 'Área eliminada correctamente', 'success'); // Mensaje de éxito
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
