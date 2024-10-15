import { Injectable } from '@angular/core';
import { OthersDTO} from '../dtos/other.dto';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaTipoEventoService {
  othersAuditoriaTipoEvento: OthersDTO[] = [
    {
      id: 'Comentario',
      nombre: 'Comentario'
    },
    {
      id: 'Inicio de Sesión',
      nombre: 'Inicio de Sesión'
    },
    {
      id: 'Incidencia',
      nombre: 'Incidencia'
    },
  ]

  constructor() { }
  ObtenerAuditoriaTipoEvento() {
    return this.othersAuditoriaTipoEvento;
  }
}
