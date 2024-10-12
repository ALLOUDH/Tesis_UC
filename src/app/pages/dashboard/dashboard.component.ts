// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/contador-usuarios.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  docentesCount: number = 0;
  alumnosCount: number = 0;
  usuariosCount: number = 0;
  administradoresCount: number = 0;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  
  

  ngOnInit(): void {
    console.log('Cargando conteos...');
    this.loadCounts();
  }

  loadCounts(): void {
    this.userService.getUsuariosCountByRole('Docente').subscribe((count) => {
      this.docentesCount = count;
      console.log('Docentes:', this.docentesCount);
    });

    this.userService.getUsuariosCountByRole('Estudiante').subscribe((count) => {
      this.alumnosCount = count;
      console.log('Alumnos:', this.alumnosCount);
    });

    this.userService.getUsuariosCountByRole('Admin').subscribe((count) => {
      this.administradoresCount = count; 
      console.log('Administradores:', this.administradoresCount);
    });

    // Para el total de usuarios
    this.userService.getUsuarios().subscribe((usuarios) => {
      this.usuariosCount = usuarios.length; // Total de usuarios
      console.log('Total de usuarios:', this.usuariosCount);
    });
    this.cdr.detectChanges();
  }

}
