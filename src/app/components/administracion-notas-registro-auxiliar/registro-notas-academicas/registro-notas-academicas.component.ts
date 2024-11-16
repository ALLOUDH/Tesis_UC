import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlumnoNotaDTO } from '../../../dtos/nota-academica.dto';
import { UnidadAcademicaDTO } from '../../../dtos/unidadacademica.dto';
import { TipoNotasDTO } from '../../../dtos/tiponotas.dto';
import { ListaAlumnosDTO } from '../../../dtos/lista-alumnos.dto';
import { Router } from '@angular/router';
import { NotasComportamientoService } from '../../../services/nota-comportamiento.service';
import { UnidadAcademicoService } from '../../../services/unidad-academico.service';
import { TiponotasService } from '../../../services/tiponotas.service';
import { CategorianotasService } from '../../../services/categorianotas.service';
import { AsignaturaDTO } from '../../../dtos/asignatura.dto';
import { AsignaturaService } from '../../../services/asignatura.service';
import { forkJoin } from 'rxjs';
import { OthersIntDTO } from '../../../dtos/other.dto';
import { SemanaAcademicoService } from '../../../services/semana.service';
import Swal from 'sweetalert2';
import { NotasAcademicasService } from '../../../services/nota-academica.service';


@Component({
  selector: 'app-registro-notas-academicas',
  templateUrl: './registro-notas-academicas.component.html',
  styleUrl: './registro-notas-academicas.component.css'
})
export class RegistroNotasAcademicasComponent {
  notasacademicasform: FormGroup;
  alumnos: AlumnoNotaDTO[] = [];

  unidadAcademica: UnidadAcademicaDTO[]=[];
  unidadesFiltradas: UnidadAcademicaDTO[] = [];
  Semanas: OthersIntDTO[] = [];
  bimestreRecibido: number | null = null;

  
  gradoNombre: string = '';
  bimestreNombre: string = '';
  asignaturaNombre: string = '';

  gradorecibido: number | null = null;
  periodorecibido: any;
  asignaturarecibida: any;
  bimestrerecibido: any;
  stateData: any = {}; 
  tiponota: TipoNotasDTO[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private unidadAcademicaService: UnidadAcademicoService,
    private tipoNotaService: TiponotasService,
    private categorianotaservice: CategorianotasService,
    private semanaService: SemanaAcademicoService,
    private notasAcademicas: NotasAcademicasService,

  ) {
    this.Semanas = semanaService.ObtenerSemanaAcademico();
    this.notasacademicasform = this.fb.group({
      inputEstudiante: new FormControl(''),
      selectUnidad: new FormControl('', Validators.required), 
      selectSemana: new FormControl('', Validators.required), 
      alumnosFormArray: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Recibe datos del componente padre
    const stateData = history.state?.data;
     if (stateData) {
    this.bimestreRecibido = stateData.selectBimestre;
    this.gradoNombre = stateData.gradoNombre || '';
    this.bimestreNombre = stateData.bimestreNombre || '';
    this.asignaturaNombre = stateData.asignaturaNombre || '';

    // Puedes usar directamente los nombres en el hijo
    console.log('Grado:', stateData.gradoNombre);
    console.log('Bimestre:', stateData.bimestreNombre);
    console.log('Asignatura:', stateData.asignaturaNombre);
  }


    // Cargar unidades académicas
    this.unidadAcademicaService.getUnidad().subscribe(
      (data: UnidadAcademicaDTO[]) => {
        this.unidadAcademica = data;
        this.filtrarUnidadesPorBimestre();
      },
      (error) => {
        console.error('Error al obtener las unidades académicas:', error);
      }
    );

    // Cargar semanas académicas
    this.Semanas = this.semanaService.ObtenerSemanaAcademico();
    console.log('Semanas cargadas:', this.Semanas);

    this.cargarTiposNotas();
  }

  cargarTiposNotas(): void {
    this.tipoNotaService.getTiposNota().subscribe(
      (tipos: TipoNotasDTO[]) => {
        this.tiponota	 = tipos.filter(tipo => tipo.idcategoriaNotas === 1);
      },
      error => Swal.fire('Error', 'No se pudieron cargar los tipos de notas.', 'error')
    );
  }
  

  
  // Filtrar unidades basadas en el bimestre
  filtrarUnidadesPorBimestre(): void {
    if (this.bimestreRecibido) {
      this.unidadesFiltradas = this.unidadAcademica.filter(unidad => unidad.idbimestre === this.bimestreRecibido);
      console.log('Unidades filtradas por bimestre:', this.unidadesFiltradas);
    }
  }
  
  EnviarDatos(): void {
    const unidadSeleccionada = this.notasacademicasform.get('selectUnidad')?.value;
    const semanaSeleccionada = this.notasacademicasform.get('selectSemana')?.value;
  
    console.log('Unidad seleccionada:', unidadSeleccionada);
    console.log('Semana seleccionada:', semanaSeleccionada);
  
    if (!unidadSeleccionada || !semanaSeleccionada) {
      this.MostrarMensajeError(
        'Seleccione tanto la Unidad Académica como la Semana Académica antes de continuar.',
        'Validación Requerida'
      );
      return;
    }
  
    // Si todo está correcto, proceder con la lógica
    const formData = {
      unidad: unidadSeleccionada,
      semana: semanaSeleccionada,
    };
  
    console.log('Datos enviados:', formData);
    this.MostrarMensajeExito('Éxito', 'Datos enviados correctamente.');
  }
  

  MostrarMensajeExito(titulo: string, mensaje: string) {
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      showConfirmButton: false,
      timer: 2300,
      timerProgressBar: true
    });
  }

  MostrarMensajeError(mensaje: string, titulo: string) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: "error"
    });
  }
}
