import { inject, Injectable } from '@angular/core';
import { appsetings } from './auth.connection.services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAppDTO } from '../auth/auth-dtos/responseapp.dto';
import { LoginDTO } from '../auth/auth-dtos/login.dto';
import { jwtDecode } from 'jwt-decode';
import { AlumnosDTO } from '../dtos/alumnos.dto';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private baseUrl:String = appsetings.apiUrl;

  constructor(private http: HttpClient) { }

  login(objeto:LoginDTO): Observable<ResponseAppDTO>{
    return this.http.post<ResponseAppDTO>(`${this.baseUrl}Acceso/Login`, objeto);
  }

  isAuthenticated(): boolean {
    // Revisa si el token está presente y es válido
    return !!localStorage.getItem('usertoken');
  }

  private getToken(): string | null {
    return localStorage.getItem('usertoken');
  }

  getUserID(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const UserIDString = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']; // Cambia aquí
      if (UserIDString) {
        const userID = parseInt(UserIDString, 10); // Convierte el string a número entero
        if (!isNaN(userID)) {
          return userID; // Si la conversión fue exitosa, retornamos el ID como número
        }
      }
    }
    return null;
  }

  getUserRole():string | null{
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; // Cambia aquí
    }
    return null;
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']; // Cambia aquí
    }
    return null;
  }
  
  getUserSurname(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']; // Cambia aquí
    }
    return null;
  }

  registrarAlumno(objeto: any): Observable<ResponseAppDTO> {
    return this.http.post<ResponseAppDTO>(`${this.baseUrl}Acceso/RegistroAlumnos`, objeto);
  }
  
  actualizarAlumno(id: number, objeto: any): Observable<ResponseAppDTO> {
    return this.http.put<ResponseAppDTO>(`${this.baseUrl}Acceso/ActualizarAlumno/${id}`, objeto);
  }
  actualizarDocente(id: number, objeto: any): Observable<ResponseAppDTO> {
    return this.http.put<ResponseAppDTO>(`${this.baseUrl}Acceso/ActualizarDocente/${id}`, objeto);
  }
  
  registrarDocente(objeto: any): Observable<ResponseAppDTO> {
    return this.http.post<ResponseAppDTO>(`${this.baseUrl}Acceso/RegistroDocentes`, objeto);
  }

  obtenerAccesos(): Observable<{ totalAccesos: number; totalAccesosExitosos: number }> {
    return this.http.get<{ totalAccesos: number; totalAccesosExitosos: number }>(`${this.baseUrl}Acceso/ContadorAccesos`);
  }

  // asignacion a grado y cursos

  asignarDocente(objeto: any): Observable<ResponseAppDTO> {
    return this.http.post<ResponseAppDTO>(`${this.baseUrl}Acceso/AsignarDocente`, objeto);
  }

  listarAsignaciones(idDocente: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Acceso/ListarAsignaciones/${idDocente}`);
  }

  editarAsignacionPorGrado(idDocente: number, idGrado: number, objeto: any): Observable<ResponseAppDTO> {
    return this.http.put<ResponseAppDTO>(`${this.baseUrl}EditarAsignacionPorGrado/${idDocente}/${idGrado}`, objeto);
  }

  eliminarAsignacion(idDocente: number, idGrado: number): Observable<ResponseAppDTO> {
    return this.http.delete<ResponseAppDTO>(`${this.baseUrl}Acceso/EliminarAsignacion/${idDocente}/${idGrado}`);
  }

  actualizarDatosPrimerAcceso(objeto: any) {
    return this.http.post<ResponseAppDTO>(`${this.baseUrl}Acceso/ActualizarPrimerAcceso`, objeto);
  }
}
