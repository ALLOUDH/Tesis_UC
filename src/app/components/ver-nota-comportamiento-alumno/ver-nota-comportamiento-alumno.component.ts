import { Component, OnInit } from '@angular/core';
import { NotasComportamientoService } from '../../services/nota-comportamiento.service';
import { AccesoService } from '../../services/acceso.service';
import { UnidadAcademicaDTO } from '../../dtos/unidadacademica.dto';
import { UnidadAcademicoService } from '../../services/unidad-academico.service';
import { TipoNotasDTO } from '../../dtos/tiponotas.dto';
import { TiponotasService } from '../../services/tiponotas.service';
import { AlumnoNotaComportamientoDTO, NotasPorUnidadDTO } from '../../dtos/ver-nota-comportamiento.dto';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';
import { FormControl, FormGroup } from '@angular/forms';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';

@Component({
  selector: 'app-ver-nota-comportamiento-alumno',
  templateUrl: './ver-nota-comportamiento-alumno.component.html',
  styleUrls: ['./ver-nota-comportamiento-alumno.component.css']
})
export class VerNotaComportamientoAlumnoComponent implements OnInit {
  idAlumno!: number;
  notasPorUnidad: NotasPorUnidadDTO[] = [];
  unidadAcademica: UnidadAcademicaDTO[] = [];
  tiponota: TipoNotasDTO[] = [];
  errorMessage: string | null = null;
  periodoAcademico: PeriodoAcademicoDTO[] = [];
  notasForm: FormGroup;

  constructor(
    private notasComportamientoService: NotasComportamientoService,
    private accesoService: AccesoService,
    private unidadAcademicoService: UnidadAcademicoService,
    private tipoNotaService: TiponotasService,
    private periodoAcademicoService: PeriodoAcademicoService
  ) {
    this.notasForm = new FormGroup({
      selectPeriodo: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.cargarUnidades();
    this.cargarPeriodos();
    this.obtenerIdAlumno();
  }

  cargarUnidades(): void {
    this.unidadAcademicoService.getUnidad().subscribe(
      (unidadData: UnidadAcademicaDTO[]) => {
        this.unidadAcademica = unidadData;
        this.cargarTiposNotas();
      },
      (error) => console.error("Error al obtener las unidades académicas:", error)
    );
  }

  cargarPeriodos(): void {
    this.periodoAcademicoService.getPeriodo().subscribe(
      (data: PeriodoAcademicoDTO[]) => {
        this.periodoAcademico = data;
        this.setDefaultPeriodo();
      },
      (error) => console.error("Error al obtener los periodos:", error)
    );
  }

  setDefaultPeriodo(): void {
    const currentYear = new Date().getFullYear().toString();
    const periodoActual = this.periodoAcademico.find(periodo => periodo.peNombre.includes(currentYear));
    if (periodoActual) {
      this.notasForm.get('selectPeriodo')?.setValue(periodoActual.idperiodo);
      this.cargarNotasPorAlumno();
    } else {
      this.errorMessage = "Periodo actual no encontrado. Seleccione un periodo.";
    }
  }
  
  

  cargarTiposNotas(): void {
    this.tipoNotaService.getTiposNota().subscribe(
      (tipoNotaData: TipoNotasDTO[]) => {
        this.tiponota = tipoNotaData.filter(tipo => tipo.idcategoriaNotas === 4);
      },
      (error) => console.error("Error al obtener los tipos de notas:", error)
    );
  }

  obtenerIdAlumno(): void {
    const idUsuario = this.accesoService.getUserID();
    if (idUsuario) {
      this.notasComportamientoService.obtenerIdAlumnoPorUsuario(idUsuario).subscribe({
        next: (idAlumno) => {
          this.idAlumno = idAlumno;
          this.cargarNotasPorAlumno();
        },
        error: (error) => {
          this.errorMessage = "Error al obtener el ID del alumno: " + error.message;
        }
      });
    } else {
      this.errorMessage = "Usuario no autenticado.";
    }
  }

  cargarNotasPorAlumno(): void {
    const selectedPeriodo = this.notasForm.get('selectPeriodo')?.value;
  
    // Limpia las notas y errores actuales antes de cargar el nuevo periodo
    this.notasPorUnidad = [];
    this.errorMessage = null;  // Limpia el mensaje de error previo
    
    this.notasComportamientoService.obtenerNotasPorAlumno(this.idAlumno, selectedPeriodo).subscribe({
      next: (notaAlumno) => {
        this.notasPorUnidad = notaAlumno.notasPorUnidad && notaAlumno.notasPorUnidad.length > 0 
          ? notaAlumno.notasPorUnidad 
          : [];
        if (!this.notasPorUnidad.length) {
          this.errorMessage = "No hay registros de notas para el periodo seleccionado.";
        }
      },
      error: (error) => {
        console.error("Error al cargar las notas del alumno:", error);
        this.errorMessage = "Error al cargar las notas. Por favor, intente nuevamente.";
        this.notasPorUnidad = []; // Asegúrate de que esté vacío en caso de error
      }
    });
  }
  
  
  
  

  obtenerNota(idUnidad: number, idTipoNota: number): string {
    const unidad = this.notasPorUnidad.find(unidad => unidad.idunidad === idUnidad);
    const nota = unidad?.notasPorTipo[idTipoNota];
    if (nota !== undefined && nota !== null) {
      return nota < 10 ? `0${nota}` : nota.toString();
    }
    return '--';
  }

  calcularPromedio(idTipoNota: number): string {
    let sumaNotas = 0;
    const cantidad = this.unidadAcademica.length;

    this.notasPorUnidad.forEach(unidad => {
      const nota = unidad.notasPorTipo[idTipoNota];
      if (nota !== undefined && nota !== null) {
        sumaNotas += nota;
      }
    });

    return cantidad > 0 ? (sumaNotas / cantidad).toFixed(2) : 'N/A';
  }

  obtenerColorNota(nota: number | string): string {
    const notaNumerica = typeof nota === 'string' ? parseFloat(nota) : nota;
    return notaNumerica < 10.5 ? 'text-danger' : 'text-primary';
  }
}
