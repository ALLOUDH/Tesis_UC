import { Injectable } from '@angular/core';
import { OthersIntDTO } from '../dtos/other.dto';

@Injectable({
  providedIn: 'root'
})
export class TipoAsistenciaService {
  otherTipoAsistencia: OthersIntDTO[] = [
    {
        id: 1,
        nombre: 'Asistio' 
    },
    { 
        id: 2, 
        nombre: 'Tarde' 
    },
    {
        id: 3,
        nombre: 'Falto' 
    }
]

  constructor() { }
  ObtenerTipoAsistencia(){
    return this.otherTipoAsistencia;
}
}
