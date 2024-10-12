import { inject, Injectable } from '@angular/core';
import { appsetings } from './auth.connection.services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAppDTO } from '../auth/auth-dtos/responseapp.dto';
import { LoginDTO } from '../auth/auth-dtos/login.dto';
import { jwtDecode } from 'jwt-decode';

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

  registrarDocente(objeto: any): Observable<ResponseAppDTO> {
    return this.http.post<ResponseAppDTO>(`${this.baseUrl}Acceso/RegistroDocentes`, objeto);
  }


  
}
