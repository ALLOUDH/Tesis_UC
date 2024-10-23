import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AgregarUnidadAcademicaComponent } from './agregar-unidad-academica/agregar-unidad-academica.component';
import { UnidadAcademicaDTO } from '../../dtos/unidadacademica.dto';
import { BimestreAcademicoDTO } from '../../dtos/bimestreacademico.dto';
import { UnidadAcademicoService } from '../../services/unidad-academico.service';
import { BimestreAcademicoService } from '../../services/bimestre-academico.service';

@Component({
  selector: 'app-lista-unidades-academicas',
  templateUrl: './lista-unidades-academicas.component.html',
  styleUrl: './lista-unidades-academicas.component.css'
})
export class ListaUnidadesAcademicasComponent {
  unidades: (UnidadAcademicaDTO & { bimestreNombre: string })[] = [];
  bimestres: BimestreAcademicoDTO[] = [];
  error: string | null = null;
  modalRef?: BsModalRef;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private unidadService: UnidadAcademicoService,
    private bimestreService: BimestreAcademicoService

  ) {
  }
  ngOnInit(): void {
    this.cargarBimestres();
  }

  cargarBimestres(): void {
    this.bimestreService.getBimestre().subscribe(
      (data: BimestreAcademicoDTO[]) => {
        this.bimestres = data;
        this.cargarUnidades(); // Cargar unidades después de que las áreas estén disponibles
      },
      (error) => {
        this.error = 'Error al cargar las unidades: ' + error.message;
        console.error('Error al cargar las unidades:', error);
      }
    );
  }

  cargarUnidades(): void {
    this.unidadService.getUnidad().subscribe(
      (data: UnidadAcademicaDTO[]) => {
        this.unidades = data.map((unidad) => {
          const bimestre = this.bimestres.find((bimestre) => bimestre.idbimestre === unidad.idbimestre);
          return {
            ...unidad,
            bimestreNombre: bimestre ? bimestre.biNombre : 'Sin bimestre', // Asignar el nombre del área
          };
        });
        console.log('Unidades cargadas:', this.unidades);
      },
      (error) => {
        this.error = 'Error al cargar las unidades: ' + error.message;
        console.error('Error al cargar las unidades:', error);
      }
    );
  }

  abrirModalAgregarUnidad(unidad?: UnidadAcademicaDTO): void {
    const initialState = {
      unidad, // Pasar la unidad al modal si está definida (para edición)
    };

    const modalRef: BsModalRef = this.modalService.show(AgregarUnidadAcademicaComponent, {
      initialState,
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.content.unidadGuardada.subscribe(() => {
      this.cargarUnidades(); // Recargar la lista de unidades
    });
  }

  EliminarUnidad(id: number): void {
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
        this.unidadService.deleteUnidad(id).subscribe(
          () => {
            this.cargarUnidades(); // Recargar unidades después de eliminar
            Swal.fire('Eliminado', 'Unidad eliminada correctamente', 'success');
          },
          (error) => {
            console.error('Error al eliminar la unidad:', error);
            Swal.fire('Error', 'No se pudo eliminar la unidad', 'error');
          }
        );
      } else {
        Swal.fire('Cancelado', 'La eliminación ha sido cancelada', 'info');
      }
    });

  }

}
