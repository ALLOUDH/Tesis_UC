import { Component, OnInit } from '@angular/core';
import { VerIncidenciaDTO } from '../../dtos/ver-incidencia.dto';
import { AuditoriaService } from '../../services/auditoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-incidencias',
  templateUrl: './ver-incidencias.component.html',
  styleUrl: './ver-incidencias.component.css'
})
export class VerIncidenciasComponent implements OnInit {
  incidencias: VerIncidenciaDTO[] = [];
  username: string | null = null;
  pageNumber: number = 1;  // Página inicial
  pageSize: number = 5; // Número de incidencias por página

  constructor(
    private auditoriaService: AuditoriaService
  ) { }

  ngOnInit(): void {
    this.cargarIncidencias();
  }

  cargarIncidencias(): void {
    this.auditoriaService.obtenerIncidencias(this.pageNumber, this.pageSize).subscribe(
      (response: any) => {
        console.log('Incidencias Obtenidas', response);
        if (response.isSuccess && Array.isArray(response.data)) {
          if (this.pageNumber === 1) {
            this.incidencias = response.data;  // Asignar las incidencias de la primera página
          } else {
            this.incidencias = [...this.incidencias, ...response.data];  // Agregar más incidencias a la lista
          }
        } else {
          console.error('No se encontrarón incidencias o la respuesta no es válida.');
        }
      },
      (error) => {
        console.error('Error al obtener las incidencias', error);
      }
    );
  }

  cambiarEstadoIncidencia(incidencia: VerIncidenciaDTO): void {
    const nuevoEstado = !incidencia.audincEstadoIncidencia; // Cambia el estado actual (si es true pasa a false, y viceversa)
  
    // Llamada al servicio para actualizar el estado de la incidencia
    this.auditoriaService.actualizarEstadoIncidencia(incidencia.idauditoriaIncidencia, nuevoEstado).subscribe(
      () => {
        // Si la actualización es exitosa
        incidencia.audincEstadoIncidencia = nuevoEstado; // Actualiza el estado de la incidencia localmente
        this.cargarIncidencias(); // Vuelve a cargar las incidencias
        this.MostrarMensajeExito('Estado actualizado', 'El estado de la incidencia se ha actualizado correctamente.');
      },
      (error) => {
        // Si ocurre un error
        console.error('Error al actualizar el estado', error);
        this.MostrarMensajeError('Error al actualizar el estado', 'Hubo un error al actualizar el estado');
      }
    );
  
    // Para depuración, se puede mantener la salida de los logs si es necesario
    console.log('Incidencia a cambiar de estado', incidencia.idauditoriaIncidencia);
    console.log('Nuevo estado', nuevoEstado);
  }

  cargarMas(): void {
    this.pageNumber++;  // Incrementar la página
    this.cargarIncidencias();  // Volver a cargar los comentarios de la siguiente página
  }

  cargarMenos(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;  // Disminuye la página
      this.cargarIncidencias();  // Cargar los comentarios de la página anterior
    }
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
