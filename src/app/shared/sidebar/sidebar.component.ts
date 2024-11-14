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
    this.router.navigate(['/registroalumno']).then(() => {
      window.location.reload();
    });
  }

  RegistrarDocente() {
    this.router.navigate(['/registrodocente']).then(() => {
      window.location.reload();
    });
  }

  AsignarDocente() {
    this.router.navigate(['/asignardocentes']).then(() => {
      window.location.reload();
    });
  }

  RegistrarPadre() {
    this.router.navigate(['/registropadre']).then(() => {
      window.location.reload();
    });
  }

  EnviarComentarios() {
    this.router.navigate(['/registrocomentario']).then(() => {
      window.location.reload();
    });
  }

  EnviarReportes() {
    this.router.navigate(['/registroincidencia']).then(() => {
      window.location.reload();
    });
  }
  ListaAlumnos() {
    this.router.navigate(['/listaalumnos']);
    };
  ListaDocentes() {
    this.router.navigate(['/listadocentes']);
    };
  AdministrarNotasRegistroAuxiliar() {
    this.router.navigate(['/administracionnotasregistroauxiliar']);
    };
  AdministrarNotasConducta() {
    this.router.navigate(['/administracionnotasconducta']);
    };
    VerNotasConducta() {
      this.router.navigate(['/vernotasconducta']);
      };
  AdministrarNotasPadre() {
    this.router.navigate(['/administracionnotaspadre']);
    };
  EditarAsistencia() {
    this.router.navigate(['/registrarasistencia']);
    };
  VerFaltasTardanzas() {
    this.router.navigate(['/verfaltastardanzas']);
    };
  ListaPeriodoAcademico() {
    this.router.navigate(['/periodoacademico']);
    };
  ListaUnidadesAcademicas() {
    this.router.navigate(['/unidadesacademicas']);
    }
  ListaBimestresAcademicos() {
    this.router.navigate(['/bimestresacademicos']);
    };
  ListaAreaAsignaturas() {
    this.router.navigate(['/areaasignaturas']);
    };
  ListaAsignaturas() {
    this.router.navigate(['/asignaturas']);
    };
  ListaCategoriaNotas() {
    this.router.navigate(['/categorianotas']);
    };
  ListaTiposNotas() {
    this.router.navigate(['/tiposnotas']);
    };

  RegistrarAsistencia() {
    this.router.navigate(['/registrarasistencia']);
    };
  
  VerAsistenciaAlumno() {
    this.router.navigate(['/verasistenciaalumno']);
    };
  
}
