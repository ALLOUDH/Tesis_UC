import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgregarBimestreAcademicoComponent } from './agregar-bimestre-academico/agregar-bimestre-academico.component';
import { BimestreAcademicoDTO } from '../../dtos/bimestreacademico.dto';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';
import { BimestreAcademicoService } from '../../services/bimestre-academico.service';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';

@Component({
  selector: 'app-lista-bimestres-academicos',
  templateUrl: './lista-bimestres-academicos.component.html',
  styleUrl: './lista-bimestres-academicos.component.css'
})
export class ListaBimestresAcademicosComponent implements OnInit {
  bimestres: (BimestreAcademicoDTO & { peNombre: string })[] = [];
  periodos: PeriodoAcademicoDTO[] = [];
  error: string | null = null;
  modalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private bimestreService: BimestreAcademicoService,
    private periodoService: PeriodoAcademicoService

  ) {
  }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.periodoService.getPeriodo().subscribe(
      (data: PeriodoAcademicoDTO[]) => {
        this.periodos = data;
        this.cargarBimestres(); // Cargar bimestres después de que los periodos estén disponibles
      },
      (error) => {
        this.error = 'Error al cargar las bimestres: ' + error.message;
        console.error('Error al cargar las bimestres:', error);
      }
    );
  }

  cargarBimestres(): void {
    this.bimestreService.getBimestre().subscribe(
      (data: BimestreAcademicoDTO[]) => {
        this.bimestres = data.map((bimestre) => {
          const periodo = this.periodos.find((periodo) => periodo.idperiodo === bimestre.idperiodo);
          return {
            ...bimestre,
            peNombre: periodo ? periodo.peNombre : 'Sin periodo', // Asignar el nombre del periodo
          };
        });
        console.log('Bimestres cargadas:', this.bimestres);
      },
      (error) => {
        this.error = 'Error al cargar los bimestres: ' + error.message;
        console.error('Error al cargar las bimestres:', error);
      }
    );
  }

  abrirModalAgregarBimestre(bimestre?: BimestreAcademicoDTO): void {
    const initialState = {
      bimestre, // Pasar el bimestre al modal si está definida (para edición)
    };

    const modalRef: BsModalRef = this.modalService.show(AgregarBimestreAcademicoComponent, {
      initialState,
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.content.bimestreGuardada.subscribe(() => {
      this.cargarBimestres(); // Recargar la lista de bimestres
    });
  }

  EliminarBimestre(id: number): void {
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
        this.bimestreService.deleteBimestre(id).subscribe(
          () => {
            this.cargarBimestres(); // Recargar bimestres después de eliminar
            Swal.fire('Eliminado', 'Bimestre eliminado correctamente', 'success');
          },
          (error) => {
            console.error('Error al eliminar el bimestre:', error);
            Swal.fire('Error', 'No se pudo eliminar el bimestre', 'error');
          }
        );
      }else {
        Swal.fire('Cancelado', 'La eliminación ha sido cancelada', 'info');
      }
    });

  }
}
