import { Component, OnInit } from '@angular/core';
import { VerComentarioDTO } from '../../dtos/ver-comentario.dto';
import { AuditoriaService } from '../../services/auditoria.service';
import { AccesoService } from '../../services/acceso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-comentarios',
  templateUrl: './ver-comentarios.component.html',
  styleUrl: './ver-comentarios.component.css'
})
export class VerComentariosComponent implements OnInit {
  comentarios: VerComentarioDTO[] = [];
  username: string | null = null;
  pageNumber: number = 1;  // Página inicial
  pageSize: number = 5; // Número de comentarios por página

  constructor(
    private auditoriaService: AuditoriaService
  ) { }

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.auditoriaService.obtenerComentarios(this.pageNumber, this.pageSize).subscribe(
      (response: any) => {
        console.log('Comentarios obtenidos', response);
        if (response.isSuccess && Array.isArray(response.data)) {
          if (this.pageNumber === 1) {
            this.comentarios = response.data;  // Asignar los comentarios de la primera página
          } else {
            this.comentarios = [...this.comentarios, ...response.data];  // Agregar más comentarios a la lista
          }
        } else {
          console.error('No se encontraron comentarios o la respuesta no es válida.');
        }
      },
      (error) => {
        console.error('Error al obtener los comentarios', error);
      }
    );
  }

  cargarMas(): void {
    this.pageNumber++;  // Incrementar la página
    this.cargarComentarios();  // Volver a cargar los comentarios de la siguiente página
  }

  cargarMenos(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;  // Disminuye la página
      this.cargarComentarios();  // Cargar los comentarios de la página anterior
    }
  }
}
