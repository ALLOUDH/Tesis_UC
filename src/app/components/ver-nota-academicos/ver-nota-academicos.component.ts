import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';
import { BimestreAcademicoDTO } from '../../dtos/bimestreacademico.dto';
import { TipoNotasDTO } from '../../dtos/tiponotas.dto';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';
import { AccesoService } from '../../services/acceso.service';
import { NotasAcademicasService } from '../../services/nota-academica.service';
import { AreasDTO, RespuestaNotasDTO } from '../../dtos/ver-nota-academica.dto';

@Component({
  selector: 'app-ver-nota-academicos',
  templateUrl: './ver-nota-academicos.component.html',
  styleUrl: './ver-nota-academicos.component.css'
})
export class VerNotaAcademicosComponent {
  idAlumno!: number;
  errorMessage: string | null = null;
  notasAcademicasForm: FormGroup;
  periodoAcademico: PeriodoAcademicoDTO[] = [];
  bimestreAcademico: BimestreAcademicoDTO[] = [];
  tiponota: TipoNotasDTO[] = [];
  notasPorAsignatura: any[] = [];
  respuestaNotas: RespuestaNotasDTO[] = [];
  notasPorArea: AreasDTO[] = []

  constructor(
    private periodoAcademicoService: PeriodoAcademicoService,
    private notasAcademicaService: NotasAcademicasService,
    private accesoService: AccesoService,
  ) { 
    this.notasAcademicasForm = new FormGroup({
      selectPeriodo: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.cargarPeriodos();
    this.obtenerIdAlumno();
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

  obtenerIdAlumno(): void {
    const idUsuario = this.accesoService.getUserID();
    console.log('ID Usuario obtenido:', idUsuario);
  
    if (idUsuario) {
      this.notasAcademicaService.obtenerIdAlumnoPorUsuario(idUsuario).subscribe({
        next: (idAlumno) => {
          console.log('ID Alumno obtenido:', idAlumno);
          if (idAlumno) {
            this.idAlumno = idAlumno;
            this.errorMessage = null; // Limpia el mensaje de error
            this.cargarNotasPorAlumno();
          } else {
            console.error('No se obtuvo un ID de alumno válido.');
            this.errorMessage = 'No se pudo obtener el ID del alumno.';
          }
        },
        error: (error) => {
          console.error('Error al obtener el ID del alumno:', error);
          this.errorMessage = 'Error al obtener el ID del alumno: ' + error.message;
        }
      });
    } else {
      console.error('Usuario no autenticado.');
      this.errorMessage = 'Usuario no autenticado.';
    }
  }
  
  

  setDefaultPeriodo(): void {
    const currentYear = new Date().getFullYear().toString();
    const periodoActual = this.periodoAcademico.find(periodo => periodo.peNombre.includes(currentYear));
    if (periodoActual) {
      this.notasAcademicasForm.get('selectPeriodo')?.setValue(periodoActual.idperiodo);
      this.cargarNotasPorAlumno();
    } else {
      this.errorMessage = "Periodo actual no encontrado. Seleccione un periodo.";
    }
  }

  cargarNotasPorAlumno(): void {
    const selectedPeriodo = this.notasAcademicasForm.get('selectPeriodo')?.value;

    if (!selectedPeriodo) {
      this.errorMessage = 'Seleccione un periodo para cargar las notas.';
      return;
    }

    this.notasAcademicaService
      .obtenerPromediosPorAsignaturaYBimestre(this.idAlumno, selectedPeriodo)
      .subscribe({
        next: (response: RespuestaNotasDTO) => {
          console.log('Datos obtenidos del backend:', response);

          if (response.promedios && Array.isArray(response.promedios)) {
            this.notasPorArea = response.promedios;
            this.errorMessage = null;
          } else {
            console.error('Estructura inesperada en la respuesta:', response);
            this.errorMessage = 'No se encontraron datos para el periodo seleccionado.';
            this.notasPorArea = [];
          }

          
        },
        error: (error) => {
          console.error('Error al cargar las notas del alumno:', error);
          this.errorMessage = 'Error al cargar las notas.';
        },
      });
  }
  
  calcularPromedioPorArea(area: any): number | null {
    if (!area || !area.asignaturas || area.asignaturas.length === 0) {
      return null;
    }
  
    // Suma total de promedios válidos
    const totalPromedios = area.asignaturas.reduce((sumaTotal: number, asignatura: any) => {
      const totalAsignatura = asignatura.promediosPorBimestre.reduce((suma: number, bimestre: any) => {
        return bimestre.promedio !== null && bimestre.promedio !== 0 && !isNaN(bimestre.promedio)
          ? suma + bimestre.promedio
          : suma;
      }, 0);
  
      // Contar solo los bimestres con valores válidos (excluyendo ya que dependiendo de los grados se tendra las asignaturas)
      const cantidadBimestres = asignatura.promediosPorBimestre.filter(
        (bimestre: any) => bimestre.promedio !== null && bimestre.promedio !== 0 && !isNaN(bimestre.promedio)
      ).length;
  
      return cantidadBimestres > 0 ? sumaTotal + totalAsignatura / cantidadBimestres : sumaTotal;
    }, 0);
  
    // Contar las asignaturas con al menos un promedio válido (excluyendo 0)
    const asignaturasValidas = area.asignaturas.filter((asignatura: any) =>
      asignatura.promediosPorBimestre.some(
        (bimestre: any) => bimestre.promedio !== null && bimestre.promedio !== 0 && !isNaN(bimestre.promedio)
      )
    ).length;
  
    return asignaturasValidas > 0 ? totalPromedios / asignaturasValidas : null;
  }
  
  
  asignarCalificacion(promedio: number | null): string {
    if (promedio === null || promedio === undefined) {
      return 'N/A';
    }
  
    if (promedio >= 0 && promedio < 11) {
      return 'C';
    } else if (promedio >= 11 && promedio < 14) {
      return 'B';
    } else if (promedio >= 14 && promedio < 18) {
      return 'A';
    } else if (promedio >= 18 && promedio < 21) {
      return 'AD';
    } else {
      return 'N/A';
    }
  }
  
  obtenerColorNota(nota: number | null): string {
    if (nota === null || nota === undefined) {
      return 'text-muted';
    }
    return nota < 10.5 ? 'text-danger' : 'text-primary';
  }
  
}
