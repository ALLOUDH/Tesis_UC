import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { EditarDocenteComponent } from './editar-docente/editar-docente.component';
import { DocenteService } from '../../services/docente.service';
import { DocentesDTO } from '../../dtos/docentes.dto';


@Component({
  selector: 'app-lista-docentes',
  templateUrl: './lista-docentes.component.html',
  styleUrl: './lista-docentes.component.css'
})
export class ListaDocentesComponent implements OnInit {

  docentes: any[] = [];

  constructor(
    private router: Router,
    private bsModalAgregarDocente: BsModalRef,
    private modalService: BsModalService,
    private docenteService: DocenteService

  ) {
  }
 
  ngOnInit(): void {
    this.obtenerDocentes(); 

  }

  obtenerDocentes() {
    this.docenteService.obtenerDocentes().subscribe(
      (response: DocentesDTO[]) => {
        console.log('Docentes obtenidos:', response); // Verificar la respuesta
        this.docentes = response;
        response.forEach(docente => {
          console.log('ID del docente:', docente.Iddocente); // Verificar los IDs
        });
      },
      (error) => {
        console.error('Error fetching docentes:', error);
      }
    );
}

  
  
  
  
  ModalAgregarDocente() {
    this.bsModalAgregarDocente = this.modalService.show(EditarDocenteComponent, { backdrop: 'static', class: 'modal-dialog-centered' });
    console.log('Agregar nuevo periodo');
  }

  EditarDocente(index: number) {
    // Aquí puedes abrir un modal para editar el periodo seleccionado
    console.log('Editar docente', this.docentes[index]);
  }

  eliminarDocente(id: number): void {
    console.log('ID del docente a eliminar:', id); 

    // Validar el ID
    if (id === undefined || id <= 0) {
      console.error('El id del docente es inválido:', id);
      Swal.fire('Error', 'El ID del docente es inválido.', 'error');
      return;
    }

    // Confirmación para eliminar
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
        this.docenteService.eliminarDocente(id).subscribe(
          () => {
            this.obtenerDocentes(); // Recargar la lista de docentes después de la eliminación
            Swal.fire('Eliminado', 'El docente ha sido eliminado correctamente', 'success');
          },
          (error) => {
            console.error('Error al eliminar docente:', error);
            const errorMsg = error.error?.message || 'Error desconocido';
            Swal.fire('Error', `No se pudo eliminar al docente. Error: ${errorMsg}`, 'error');
          }
        );
      }
    });
}


  
  
  
}
