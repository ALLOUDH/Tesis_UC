import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BimestreAcademicoDTO } from '../dtos/bimestreacademico.dto';
import { Observable } from 'rxjs';
import { appsetings } from './auth.connection.services';

@Injectable({
  providedIn: 'root'
})
export class BimestreAcademicoService {
  //private baseUrl = 'http://localhost:5010/api/CicloAcademico/bimestre';
  private baseUrl: string = appsetings.apiUrl + 'CicloAcademico/bimestre';


  constructor(private http: HttpClient) { }

  // Crear una nueva bimestre
  createBimestre(bimestre: BimestreAcademicoDTO): Observable<BimestreAcademicoDTO> {
    return this.http.post<BimestreAcademicoDTO>(this.baseUrl, bimestre);
  }

  // Obtener todas las bimestre
  getBimestre(): Observable<BimestreAcademicoDTO[]> {
    return this.http.get<BimestreAcademicoDTO[]>(this.baseUrl);
  }

  // Actualizar una bimestre existente
  updateBimestre(bimestre: BimestreAcademicoDTO): Observable<BimestreAcademicoDTO> {
    return this.http.put<BimestreAcademicoDTO>(`${this.baseUrl}/${bimestre.idbimestre}`, bimestre);
  }

  // Eliminar una bimestre
  deleteBimestre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
