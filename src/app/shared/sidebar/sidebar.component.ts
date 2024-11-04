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
  ) {
    this.userRole = this.accesoService.getUserRole();
  }

  ngOnInit(): void { }

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
    this.router.navigate(['/lista-alumnos']);
    };
  ListaDocentes() {
    this.router.navigate(['/lista-docentes']);
    };
  AdministrarNotasRegistroAuxiliar() {
    this.router.navigate(['/administracion-notas-registro-auxiliar']);
    };
  AdministrarNotasConducta() {
    this.router.navigate(['/administracion-notas-conducta']);
    };
    VerNotasConducta() {
      this.router.navigate(['/vernotasconducta']);
      };
  AdministrarNotasPadre() {
    this.router.navigate(['/administracion-notas-padre']);
    };
  EditarAsistencia() {
    this.router.navigate(['/editar-asistencia']);
    };
  VerFaltasTardanzas() {
    this.router.navigate(['/ver-faltas-tardanzas']);
    };
  ListaPeriodoAcademico() {
    this.router.navigate(['/periodo-academico']);
    };
  ListaUnidadesAcademicas() {
    this.router.navigate(['/unidades-academicas']);
    }
  ListaBimestresAcademicos() {
    this.router.navigate(['/bimestres-academicos']);
    };
  ListaAreaAsignaturas() {
    this.router.navigate(['/area-asignaturas']);
    };
  ListaAsignaturas() {
    this.router.navigate(['/asignaturas']);
    };
  ListaCategoriaNotas() {
    this.router.navigate(['/categoria-notas']);
    };
  ListaTiposNotas() {
    this.router.navigate(['/tipos-notas']);
    };

  RegistrarAsistencia() {
    this.router.navigate(['/registrarasistencia']);
    };
}
