import { Component } from '@angular/core';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  userRole: string | null = null;

  constructor(
    private accesoService: AccesoService,
    private router: Router
  )  
  {
    this.userRole = this.accesoService.getUserRole();
  }

  ngOnInit(): void {}

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  isDocente(): boolean {
    return this.userRole === 'Docente';
  }

  isAlumnoOrPadre(): boolean {
    const role = this.userRole;
    return role === 'Estudiante' || role === 'Padre';
  }

  RegistrarAlumno() {
    this.router.navigate(['/registroalumno']);
  }
  
  RegistrarDocente() {
    this.router.navigate(['/registrodocente']);
    }
  
  RegistrarPadre() {
    this.router.navigate(['/registropadre']);
    }
}
