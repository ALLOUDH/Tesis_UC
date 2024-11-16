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
  esUsuarioAutorizado: boolean = false;

  constructor(
    private accesoService: AccesoService,
    private router: Router
  ) {
    this.userRole = this.accesoService.getUserRole();
  }

  ngOnInit(): void {
    // Primero, verifica si el usuario es admin
    if (this.accesoService.isAdmin()) {
      this.esUsuarioAutorizado = true;
    } else {
      // Si no es admin, verifica si es auxiliar
      this.accesoService.isAuxiliar().subscribe((esAuxiliar) => {
        this.esUsuarioAutorizado = esAuxiliar;
      });
    }
  }

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
    this.router.navigate(['/registro-alumno']).then(() => {
      window.location.reload();
    });
  }

  RegistrarDocente() {
    this.router.navigate(['/registro-docente']).then(() => {
      window.location.reload();
    });
  }

  AsignarDocente() {
    this.router.navigate(['/asignar-docentes']).then(() => {
      window.location.reload();
    });
  }

  RegistrarPadre() {
    this.router.navigate(['/registro-padre']).then(() => {
      window.location.reload();
    });
  }

  EnviarComentarios() {
    this.router.navigate(['/registro-comentario']).then(() => {
      window.location.reload();
    });
  }

  EnviarReportes() {
    this.router.navigate(['/registro-incidencia']).then(() => {
      window.location.reload();
    });
  }
  ListaAlumnos() {
    this.router.navigate(['/lista-alumnos']).then(() => {
      window.location.reload();
    });;
  };
  ListaDocentes() {
    this.router.navigate(['/lista-docentes']).then(() => {
      window.location.reload();
    });;
  };
  AdministrarNotasRegistroAuxiliar() {
    this.router.navigate(['/administracion-notas-registro-auxiliar']).then(() => {
      window.location.reload();
    });;
  };
  AdministrarNotasConducta() {
    this.router.navigate(['/administracion-notas-conducta']).then(() => {
      window.location.reload();
    });;
  };
  VerNotasConducta() {
    this.router.navigate(['/lista-notas-conportamiento']).then(() => {
      window.location.reload();
    });;
  };
  AdministrarNotasPadre() {
    this.router.navigate(['/administracion-notas-padre']).then(() => {
      window.location.reload();
    });;
  };
  EditarAsistencia() {
    this.router.navigate(['/registrarasistencia']);
    };
  VerFaltasTardanzas() {
    this.router.navigate(['/ver-faltas-tardanzas']).then(() => {
      window.location.reload();
    });;
  };
  ListaPeriodoAcademico() {
    this.router.navigate(['/periodo-academico']).then(() => {
      window.location.reload();
    });;
  };
  ListaUnidadesAcademicas() {
    this.router.navigate(['/unidades-academicas']).then(() => {
      window.location.reload();
    });;
  }
  ListaBimestresAcademicos() {
    this.router.navigate(['/bimestres-academicos']).then(() => {
      window.location.reload();
    });;
  };
  ListaAreaAsignaturas() {
    this.router.navigate(['/area-asignaturas']).then(() => {
      window.location.reload();
    });;
  };
  ListaAsignaturas() {
    this.router.navigate(['/asignaturas']).then(() => {
      window.location.reload();
    });;
  };
  ListaCategoriaNotas() {
    this.router.navigate(['/categoria-notas']).then(() => {
      window.location.reload();
    });;
  };
  ListaTiposNotas() {
    this.router.navigate(['/tipos-notas']).then(() => {
      window.location.reload();
    });;
  };

  RegistrarAsistencia() {
    this.router.navigate(['/registrarasistencia']).then(() => {
      window.location.reload();
    });;
  };

  VerNotasConductaAlumno(){
    this.router.navigate(['/ver-notas-conducta']).then(() => {
      window.location.reload();
    });;
  };
  
  VerAsistenciaAlumno() {
    this.router.navigate(['/verasistenciaalumno']);
    };
  
}
