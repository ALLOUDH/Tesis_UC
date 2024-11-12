// notas-comportamiento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaComportamientoDTO } from '../dtos/notacomportamiento.dto';
import { NotasPorAlumnoDTO } from '../dtos/listanotacomportamiento.dto';
import { AlumnoNotaComportamientoDTO } from '../dtos/ver-nota-comportamiento.dto';

@Injectable({
    providedIn: 'root'
})
export class NotasComportamientoService {
    private apiUrl = 'http://localhost:5010/api/NotasComportamiento/'; 

    constructor(private http: HttpClient) { }



    registrarNotasComportamiento(dto: NotaComportamientoDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}RegistrarNotasComportamiento`, dto);
    }
    

    obtenerNotas(idGrado: number, idUnidad: number): Observable<NotasPorAlumnoDTO[]> {
        return this.http.get<NotasPorAlumnoDTO[]>(`${this.apiUrl}ObtenerNotasPorGradoYUnidad?idGrado=${idGrado}&idUnidad=${idUnidad}`);
    }

    actualizarNotas(notasActualizadas: NotaComportamientoDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}ActualizarNotasComportamiento`, notasActualizadas);
    }

    obtenerNotasPorAlumno(idAlumno: number, idPeriodo: number) {
        return this.http.get<AlumnoNotaComportamientoDTO>(`${this.apiUrl}ObtenerNotasPorAlumno?idAlumno=${idAlumno}&idPeriodo=${idPeriodo}`);
      }
      
    
    obtenerIdAlumnoPorUsuario(idUsuario: number): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}ObtenerIdAlumnoPorUsuario/${idUsuario}`);
      }
      
}
