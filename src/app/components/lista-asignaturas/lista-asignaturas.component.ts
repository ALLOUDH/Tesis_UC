import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgregarAsignaturaComponent } from './agregar-asignatura/agregar-asignatura.component';
import Swal from 'sweetalert2';
import { AsignaturaDTO } from '../../dtos/asignatura.dto';
import { AsignaturaService } from '../../services/asignatura.service';
import { AreaService } from '../../services/area.service';
import { AreaDTO } from '../../dtos/area.dto';

@Component({
  selector: 'app-lista-asignaturas',
  templateUrl: './lista-asignaturas.component.html',
  styleUrls: ['./lista-asignaturas.component.css'],
})
export class ListaAsignaturasComponent implements OnInit {
  asignaturas: (AsignaturaDTO & { areaNombre: string })[] = [];
  areas: AreaDTO[] = [];
  error: string | null = null;
  modalRef?: BsModalRef;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private asignaturaService: AsignaturaService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.cargarAreas();
  }

  cargarAreas(): void {
    this.areaService.getAreas().subscribe(
      (data: AreaDTO[]) => {
        this.areas = data;
        this.cargarAsignaturas(); // Cargar asignaturas después de que las áreas estén disponibles
      },
      (error) => {
        this.error = 'Error al cargar las áreas: ' + error.message;
        console.error('Error al cargar las áreas:', error);
      }
    );
  }

  cargarAsignaturas(): void {
    this.asignaturaService.getAsignaturas().subscribe(
      (data: AsignaturaDTO[]) => {
        this.asignaturas = data.map((asignatura) => {
          const area = this.areas.find((area) => area.idArea === asignatura.idarea);
          return {
            ...asignatura,
            areaNombre: area ? area.areaNombre : 'Sin área', // Asignar el nombre del área
          };
        });
        console.log('Asignaturas cargadas:', this.asignaturas);
      },
      (error) => {
        this.error = 'Error al cargar las asignaturas: ' + error.message;
        console.error('Error al cargar las asignaturas:', error);
      }
    );
  }

  abrirModalAgregarAsignatura(asignatura?: AsignaturaDTO): void {
    const initialState = {
      asignatura, // Pasar la asignatura al modal si está definida (para edición)
    };

    const modalRef: BsModalRef = this.modalService.show(AgregarAsignaturaComponent, {
      initialState,
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.content.asignaturaGuardada.subscribe(() => {
      this.cargarAsignaturas(); // Recargar la lista de asignaturas
    });
  }

  eliminarAsignatura(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.asignaturaService.deleteAsignatura(id).subscribe(
          () => {
            this.cargarAsignaturas(); // Recargar asignaturas después de eliminar
            Swal.fire('Eliminado', 'Asignatura eliminada correctamente', 'success');
          },
          (error) => {
            console.error('Error al eliminar la asignatura:', error);
            Swal.fire('Error', 'No se pudo eliminar la asignatura', 'error');
          }
        );
      } else {
        Swal.fire('Cancelado', 'La eliminación ha sido cancelada', 'info');
      }
    });
  }
}
