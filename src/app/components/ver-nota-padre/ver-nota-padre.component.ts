import { Component, OnInit } from '@angular/core';
import { NotasPorBimestreDTO } from '../../dtos/ver-nota-padre.dto';
import { BimestreAcademicoDTO } from '../../dtos/bimestreacademico.dto';
import { TipoNotasDTO } from '../../dtos/tiponotas.dto';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';
import { FormControl, FormGroup } from '@angular/forms';
import { NotasPadreService } from '../../services/notas-padre.service';
import { AccesoService } from '../../services/acceso.service';
import { BimestreAcademicoService } from '../../services/bimestre-academico.service';
import { TiponotasService } from '../../services/tiponotas.service';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';
import { CategorianotasService } from '../../services/categorianotas.service';

@Component({
  selector: 'app-ver-nota-padre',
  templateUrl: './ver-nota-padre.component.html',
  styleUrl: './ver-nota-padre.component.css'
})
export class VerNotaPadreComponent implements OnInit {
  idAlumno!: number;
  notasPorBimestre: NotasPorBimestreDTO[] = [];
  bimestreAcademico: BimestreAcademicoDTO[] = [];
  tiponota: TipoNotasDTO[] = [];
  errorMessage: string | null = null;
  periodoAcademico: PeriodoAcademicoDTO[] = [];
  notasForm: FormGroup;

  constructor(
    private notasPadreService: NotasPadreService,
    private accesoService: AccesoService,
    private bimestreAcademicoService: BimestreAcademicoService,
    private tipoNotaService: TiponotasService,
    private periodoAcademicoService: PeriodoAcademicoService,
    private CategorianotasService: CategorianotasService
  ) {
    this.notasForm = new FormGroup({
      selectPeriodo: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.cargarBimestres();
    this.cargarPeriodos();
    this.obtenerIdAlumno();
  }

  cargarBimestres(): void {
    this.bimestreAcademicoService.getBimestre().subscribe(
      (unidadData: BimestreAcademicoDTO[]) => {
        this.bimestreAcademico = unidadData;
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
    const nombreCategoria = 'Notas de padres'; // El nombre de la categoría que deseas buscar

    // Primero, obtén el ID de la categoría con el nombre especificado
    this.CategorianotasService.getCategorias().subscribe(
      (categorias) => {
        const categoriaComportamiento = categorias.find(categoria => categoria.catNombre === nombreCategoria);
        if (categoriaComportamiento) {
          const idCategoriaComportamiento = categoriaComportamiento.idcategoriaNotas;

          // Ahora, carga los tipos de notas y filtra por el ID de la categoría encontrada
          this.tipoNotaService.getTiposNota().subscribe(
            (tipoNotaData: TipoNotasDTO[]) => {
              this.tiponota = tipoNotaData.filter(tipo => tipo.idcategoriaNotas === idCategoriaComportamiento);
            },
            (error) => console.error("Error al obtener los tipos de notas:", error)
          );
        } else {
          console.error(`No se encontró la categoría con el nombre: ${nombreCategoria}`);
        }
      },
      (error) => console.error("Error al obtener las categorías de notas:", error)
    );
  }

  obtenerIdAlumno(): void {
    const idUsuario = this.accesoService.getUserID();
    if (idUsuario) {
      this.notasPadreService.obtenerIdAlumnoPorUsuario(idUsuario).subscribe({
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
    this.notasPorBimestre = [];
    this.errorMessage = null;  // Limpia el mensaje de error previo
    
    this.notasPadreService.obtenerNotasPorAlumno(this.idAlumno, selectedPeriodo).subscribe({
      next: (notaAlumno) => {
        this.notasPorBimestre = notaAlumno.notasPorBimestre && notaAlumno.notasPorBimestre.length > 0 
          ? notaAlumno.notasPorBimestre 
          : [];
        if (!this.notasPorBimestre.length) {
          this.errorMessage = "No hay registros de notas para el periodo seleccionado.";
        }
      },
      error: (error) => {
        console.error("Error al cargar las notas del alumno:", error);
        this.errorMessage = "Error al cargar las notas. Por favor, intente nuevamente.";
        this.notasPorBimestre = []; // Asegúrate de que esté vacío en caso de error
      }
    });
  }

  obtenerNota(idBimestre: number, idTipoNota: number): string {
    const bimestre = this.notasPorBimestre.find(bimestre => bimestre?.idbimestre === idBimestre);
    const nota = bimestre?.notasPorTipo[idTipoNota];
    if (nota !== undefined && nota !== null) {
      return nota < 10 ? `0${nota}` : nota.toString();
    }
    return '--';
  }

  calcularPromedio(idTipoNota: number): string {
    let sumaNotas = 0;
    const cantidad = this.bimestreAcademico.length;

    this.notasPorBimestre.forEach(unidad => {
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
