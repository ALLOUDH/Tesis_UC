import { Component } from '@angular/core';
import { EstadoUsuarioService } from '../../services/estado-usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { EditarDocenteComponent } from './editar-docente/editar-docente.component';
import { DocentesDTO } from '../../dtos/docentes.dto';
import { VistasService } from '../../services/vistas.service';
import { ListaDocentesDTO } from '../../dtos/lista-docentes.dto';
import { OthersIntDTO } from '../../dtos/other.dto';
import { AuxiliarService } from '../../services/esauxiliar-docente.service';


@Component({
  selector: 'app-lista-docentes',
  templateUrl: './lista-docentes.component.html',
  styleUrl: './lista-docentes.component.css'
})
export class ListaDocentesComponent  {
  listadocenteform: FormGroup;
  docentes: ListaDocentesDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];
  listadocentes: string[] = [];
  buscardocente: ListaDocentesDTO[] = [];
  otherAuxiliarDocente: OthersIntDTO[] = [];

  constructor(
    private router: Router,
    private ModalEditarDocente: BsModalRef,
    private vistasService: VistasService,
    private modalService: BsModalService,
    estadoUsuarioService: EstadoUsuarioService,
    auxiliardocenteService: AuxiliarService,

  ) {
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherAuxiliarDocente = auxiliardocenteService.ObtenerAuxiliarDocente();
    this.listadocenteform = new FormGroup({
      inputDocente: new FormControl(''),
      inputNroDocumento: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      selectEstadoUsuario: new FormControl(''),
    });
  }
 
  ngOnInit(): void {
    this.obtenerDocentes(); 

  }

  AbrirModalEditarDocentes(docentes: ListaDocentesDTO) {
    const initialState = {
      docentes: docentes
    };
    this.ModalEditarDocente = this.modalService.show(EditarDocenteComponent, { 
      initialState, 
      backdrop: 'static', 
      class: 'modal-xl' 
    });
    this.ModalEditarDocente.content.docenteActualizado.subscribe(() => {
      this.obtenerDocentes(); // Volver a obtener la lista
    });
  }

  obtenerDocentes() {
    this.vistasService.obtenerDocentes().subscribe(
      (data: ListaDocentesDTO[]) => {
        this.docentes = data; // Asigna los datos obtenidos
        this.listadocentes = data.map(docente =>
          `${docente.usNombre} ${docente.usApellidoPaterno} ${docente.usApellidoMaterno}`
        ); // Llena el arreglo de nombres
      },
      (error) => {
        console.error('Error al obtener los docentes', error);
      }
    );
  }
  RegistrarDocente() {
    this.router.navigate(['/registrodocente']).then(() => {
      window.location.reload();
    });
  }
  
  LimpiarFormulario() {
    this.listadocenteform.reset();
    this.buscardocente = [...this.docentes];
  }

  CambiarEstadoDocente(docente: any) {
    const nuevoEstado = !docente.usEstado;
    Swal.fire({
      title: '¿Está seguro?',
      text: "Cambiará el estado del docente seleccionado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vistasService.cambiarEstadoDocente(docente.idusuario, nuevoEstado).subscribe(
          () => {
            docente.usEstado = nuevoEstado;
            this.obtenerDocentes();
            this.MostrarMensajeExito('Estado del docente actualizado', 'El estado del docente se actualizó correctamente');
          },
          (error) => {
            console.error('Error al eliminar el docente', error);
            this.MostrarMensajeError('Hubo un error al cambiar el estado del docente', 'Error');
          }
        );
      }
    });
  }

  /*CambiarAuxiliarDocente(docente: any) {
    const nuevoAuxiliar = !docente.doEsAuxiliar;
    Swal.fire({
      title: '¿Está seguro?',
      text: "Cambiará el estado de auxiliar del docente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vistasService.cambiarAuxiliarDocente(docente.idusuario, nuevoAuxiliar).subscribe(
          () => {
            docente.doEsAuxiliar = nuevoAuxiliar;
            this.obtenerDocentes();
            this.MostrarMensajeExito('Ok', 'El estado del docente axiliar se actualizó correctamente');
          },
          (error) => {
            console.error('Error al eliminar el docente', error);
            this.MostrarMensajeError('Hubo un error al cambiar el estado del docente', 'Error');
          }
        );
      }
    });
  }*/

  BuscarDocente() {
    if (!this.validarCamposBusqueda()) {
      this.MostrarMensajeError('Por favor, rellene al menos un campo de búsqueda.', 'Error');
      return;
    }

    const terminobusqueda = this.listadocenteform.get('inputDocente')?.value;
    const nroDocumento = this.listadocenteform.get('inputNroDocumento')?.value || '';
    const estadoUsuario = this.listadocenteform.get('selectEstadoUsuario')?.value;
  
    this.buscardocente= this.docentes.filter(docentes => {
      const nombreCompleto = `${docentes.usNombre} ${docentes.usApellidoPaterno} ${docentes.usApellidoMaterno}`.toLowerCase();
  
      return (
        (terminobusqueda ? nombreCompleto.includes(terminobusqueda.toLowerCase()) : true) &&
        (nroDocumento ? docentes.usDni.includes(nroDocumento) : true) &&
        (estadoUsuario !== undefined && estadoUsuario !== '' ? docentes.usEstado === estadoUsuario : true)
      );
    });
  }

  validarCamposBusqueda(): boolean {
    const terminobusqueda = this.listadocenteform.get('inputDocente')?.value;
    const nroDocumento = this.listadocenteform.get('inputNroDocumento')?.value;
    const estadoUsuario = this.listadocenteform.get('selectEstadoUsuario')?.value;
  
    return !!(terminobusqueda || nroDocumento  || estadoUsuario);
  }
  
  MostrarMensajeExito(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      showConfirmButton: false,
      timer: 2300,
      timerProgressBar: true
    });
  }

  MostrarMensajeError(mensaje: string, titulo: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "error"
    });
  }

  
}
