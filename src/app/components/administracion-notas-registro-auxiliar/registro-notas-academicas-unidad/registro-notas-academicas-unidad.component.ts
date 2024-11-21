import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { BimestreAcademicoDTO } from '../../../dtos/bimestreacademico.dto';
import { AccesoService } from '../../../services/acceso.service';


@Component({
  selector: 'app-registro-notas-academicas-unidad',
  templateUrl: './registro-notas-academicas-unidad.component.html',
  styleUrl: './registro-notas-academicas-unidad.component.css'
})
export class RegistroNotasAcademicasUnidadComponent  {
  notasacademicasUnidadform: FormGroup;
  alumnosNota: AlumnoNotaDTO[] = [];

  unidadAcademica: UnidadAcademicaDTO[]=[];
  bimestreAcademico: BimestreAcademicoDTO[] = [];
  asignaturaAcademica: AsignaturaDTO[] = [];
  Semanas: OthersIntDTO[] = [];
  unidadesFiltradas: UnidadAcademicaDTO[] = [];

  unidadrecibido: number | null = null;;
  semanarecibido: any;

  //variables para mostrar los datos recibidos para mejor visualizacion del usuario
  gradoNombre: string = '';
  bimestreNombre: string = '';
  asignaturaNombre: string = '';
  unidadNombre: string = '';

  gradorecibido: number | null = null;
  periodorecibido: number | null = null;
  asignaturarecibida: number | null = null;
  bimestrerecibido: number | null = null;
  stateData: any = {}; 
  tiponota: TipoNotasDTO[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];

  filtrarTipoNotas: TipoNotasDTO[] = [];
  notasPorUnidad: string[] = ['E.T.A', 'Examen Formativo Mensual'];
  

  guardarCambios: boolean = false; 
  promediosPorSemana: { [semana: number]: any[] } = {}; 


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private unidadAcademicaService: UnidadAcademicoService,
    private tipoNotaService: TiponotasService,
    private categorianotaservice: CategorianotasService,
    private semanaService: SemanaAcademicoService,
    private notasAcademicasService: NotasAcademicasService,
    private accesoService: AccesoService

  ) {
    this.Semanas = semanaService.ObtenerSemanaAcademico();
    this.notasacademicasUnidadform = this.fb.group({
      inputEstudiante: new FormControl(''),
      selectUnidad: new FormControl('', Validators.required), 
      selectSemana: new FormControl('', Validators.required), 
      inputUnidad:  new FormControl('', Validators.required), 
      alumnosFormArray: this.fb.array([])
    });
  }
 
  ngOnInit(): void {

    // Recibe datos del componente padre
    const formData = localStorage.getItem('formData');
    if (formData) {
      const datos = JSON.parse(formData);
      this.periodorecibido = datos.selectPeriodo;
      this.gradorecibido = datos.gradoId;
      this.asignaturarecibida = datos.selectAsignatura;
      this.bimestrerecibido = datos.selectBimestre;

      this.gradoNombre = datos.gradoNombre || 'Sin nombre';
      this.bimestreNombre = datos.bimestreNombre || 'Sin nombre';
      this.asignaturaNombre = datos.asignaturaNombre || 'Sin nombre';
    }

    const stateData = history.state?.data;
     if (stateData) {
      this.periodorecibido = stateData.selectPeriodo || this.periodorecibido;
      this.gradorecibido = stateData.gradoId || this.gradorecibido;
      this.bimestrerecibido = stateData.selectBimestre || this.bimestrerecibido;
      this.asignaturarecibida = stateData.selectAsignatura || this.asignaturarecibida;
    // Asignar nombres directamente si están disponibles
    this.gradoNombre = stateData.gradoNombre || this.gradoNombre;
    this.bimestreNombre = stateData.bimestreNombre || this.bimestreNombre;
    this.asignaturaNombre = stateData.asignaturaNombre || this.asignaturaNombre;

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

    this.obtenerAlumnosYNotas();

    console.log('Grado Nombre:', this.gradoNombre);
    console.log('Bimestre Nombre:', this.bimestreNombre);
    console.log('Asignatura Nombre:', this.asignaturaNombre);

    forkJoin([
      this.unidadAcademicaService.getUnidad(),
      this.categorianotaservice.getCategorias(), // Primero obtenemos las categorías para encontrar el ID correspondiente
      this.tipoNotaService.getTiposNota(),
      this.semanaService.ObtenerSemanaAcademico()
  ]).subscribe(
    ([unidadData, categoriasData, tipoNotaData]) => {
      this.unidadAcademica = unidadData;
      this.tiponota = tipoNotaData;
      // Encuentra la categoría "Comportamiento" y su idcategoriaNotas
      const categoriaAcademico = categoriasData.find(categoria => categoria.catNombre === 'Registro Auxiliar');
      if (categoriaAcademico) {
        const idCategoriaAcademico = categoriaAcademico.idcategoriaNotas;
  
        // Filtra los tipos de notas que pertenecen a la categoría "Comportamiento" usando el ID encontrado
        this.tiponota = tipoNotaData.filter(tipo => tipo.idcategoriaNotas === idCategoriaAcademico);
  
      
        
      } else {
        console.error("La categoría 'Registro Auxiliar' no fue encontrada.");
      }
    },
    (error) => console.error("Error al cargar datos iniciales:", error)
  );

  if (!this.periodorecibido || !this.gradorecibido || !this.bimestrerecibido || !this.asignaturarecibida) {
    console.error('Datos clave faltantes en ngOnInit:', {
      periodorecibido: this.periodorecibido,
      gradorecibido: this.gradorecibido,
      bimestrerecibido: this.bimestrerecibido,
      asignaturarecibida: this.asignaturarecibida,
    });
    Swal.fire('Error', 'Faltan datos clave para inicializar el formulario.', 'error');
    return;
  }
  if (!this.alumnosNota || this.alumnosNota.length === 0) {
    return;
  }




  }
  obtenerNombreUnidad(idUnidad: number): void {
    const unidad = this.unidadAcademica.find(b => b.idunidad === idUnidad);
    if (unidad) {
      this.notasacademicasUnidadform.patchValue({ inputUnidad: unidad.uniNombre });
    } else {
      console.error('Bimestre no encontrado:', idUnidad);
    }
  }
  obtenerNombreSemana(idSemana: number): void {
    const semana = this.Semanas.find(b => b.id === idSemana);
    if (semana) {
      this.notasacademicasUnidadform.patchValue({ inputSemana: semana.nombre });
    } else {
      console.error('Semana no encontrado:', idSemana);
    }
  }

  
  

  // Filtrar unidades basadas en el bimestre
  filtrarUnidadesPorBimestre(): void {
    if (this.bimestrerecibido) {
      this.unidadesFiltradas = this.unidadAcademica.filter(unidad => unidad.idbimestre === this.bimestrerecibido);
      console.log('Unidades filtradas por bimestre:', this.unidadesFiltradas);
    }
  }
  
  obtenerAlumnosYNotas(): void {
    const unidadSeleccionada = this.notasacademicasUnidadform.get('selectUnidad')?.value;
  
    if (!unidadSeleccionada || !this.gradorecibido || !this.bimestrerecibido || !this.periodorecibido || !this.asignaturarecibida) {
      return;
    }
  
    this.obtenerNombreUnidad(unidadSeleccionada);
  
    // Filtrar tipos de notas según la semana seleccionada
    this.filtrarTipoNotas = this.obtenerfiltroTipoNotas();
  
    this.notasAcademicasService.obtenerNotasAuxiliares(
      this.gradorecibido,
      unidadSeleccionada,
      this.bimestrerecibido,
      this.periodorecibido
    ).subscribe({
      next: (data) => {
        this.alumnosNota = data;
        console.log('Alumnos y notas cargados:', this.alumnosNota);
        this.actualizarAlumnosFormArray(this.alumnosNota.length);
        this.cargarNotasEnFormulario();
  
        // Cargar promedios después de cargar notas
        this.cargarPromedios(unidadSeleccionada);
      },
      error: (error) => {
        console.error('Error al obtener las notas iniciales:', error);
        Swal.fire('Error', 'No se pudieron obtener las notas iniciales.', 'error');
      }
    });
  }
  

  validarcambios(): void {
    const alumnosFormArray = this.notasacademicasUnidadform.get('alumnosFormArray') as FormArray;
    let cambiosDetectados = false;
  
    // Verificar si algún campo de notas ha sido modificado
    for (let i = 0; i < alumnosFormArray.length; i++) {
      const alumnoFormGroup = alumnosFormArray.at(i) as FormGroup;
  
      const isNotaModified = Object.keys(alumnoFormGroup.controls)
        .some(controlName => controlName.startsWith('inputNota') && alumnoFormGroup.get(controlName)?.dirty);
  
      if (isNotaModified) {
        cambiosDetectados = true;
        break;
      }
    }
  
    if (cambiosDetectados && !this.guardarCambios) {
      Swal.fire({
        title: 'Cambios detectados',
        text: 'Tiene cambios sin guardar. ¿Desea continuar y perder los cambios?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.obtenerAlumnosYNotas(); // Función que realiza la lógica para obtener los datos
        }
      });
    } else {
      this.obtenerAlumnosYNotas();
    }
  }
  
  
  obtenerfiltroTipoNotas(): TipoNotasDTO[] {
    return this.tiponota.filter((tipoNota) => this.notasPorUnidad.includes(tipoNota.tipNoNombre));
  }
  

  cargarNotasEnFormulario(): void {
    const alumnosFormArray = this.notasacademicasUnidadform.get('alumnosFormArray') as FormArray;
  
    this.alumnosNota.forEach((alumno, index) => {
      const alumnoFormGroup = alumnosFormArray.at(index) as FormGroup;
  
      this.tiponota.forEach((tipoNota) => {
        const controlName = `inputNota${tipoNota.idtipoNotas}`;
        const nota = alumno.notas[tipoNota.idtipoNotas]; 
  
        if (nota !== undefined && nota !== null) {
          alumnoFormGroup.get(controlName)?.setValue(nota);
        }
      });
      this.calcularPromedio(index);
    });
  }
  
  actualizarAlumnosFormArray(cantidadAlumnos: number): void {
    const alumnosFormArray = this.notasacademicasUnidadform.get('alumnosFormArray') as FormArray;
    alumnosFormArray.clear();

    this.alumnosNota.forEach((alumno, index) => {
        const formGroup = this.fb.group({});

        // Crear controles dinámicos para promedios de cada semana
        [1, 2, 3, 4].forEach((semana) => {
            const promedio = this.promediosPorSemana[alumno.idAlumno]?.find(p => p.idsemana === semana)?.promedio || '';
            console.log(`Asignando promedio para semana ${semana} del alumno ${alumno.idAlumno}:`, promedio);
            formGroup.addControl(`promedioSemana${semana}`, new FormControl({ value: promedio, disabled: true }));
        });

        // Agregar controles para tipos de notas
        this.notasPorUnidad.forEach(nota => {
            const tipoNotaId = this.obtenerIdTipoNotaPorNombre(nota);
            if (tipoNotaId) {
                formGroup.addControl(`inputNota${tipoNotaId}`, new FormControl('', [Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')]));
            }
        });

        // Control para el promedio general
        formGroup.addControl('inputPromedioNota', new FormControl({ value: '', disabled: true }));

        alumnosFormArray.push(formGroup);
    });

    console.log('Estructura del FormArray:', alumnosFormArray.value);
}

  crearFormGroupAlumno(): FormGroup {
    const formGroup = this.fb.group({});
    this.tiponota.forEach((tipoNota, index) => {
      const controlName = `inputNota${tipoNota.idtipoNotas}`;
      formGroup.addControl(controlName, new FormControl('', [Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')]));
    });
    formGroup.addControl('inputPromedioNota', new FormControl({ value: '', disabled: true }, Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')));
    return formGroup;
  }

  private formatFecha(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  calcularPromedio(index: number): void {
    const alumnoFormGroup = (this.notasacademicasUnidadform.get('alumnosFormArray') as FormArray).at(index) as FormGroup;
    let sumaNotas = 0;
    let cantidadNotas = 0;

    // Incluir los promedios de las semanas anteriores en el cálculo
    [1, 2, 3, 4].forEach((semana) => {
        const controlName = `promedioSemana${semana}`;
        const promedioSemanaValor = parseFloat(alumnoFormGroup.get(controlName)?.value);

        console.log(`Promedio semana ${semana} del alumno ${index + 1}: ${promedioSemanaValor}`); // Debug

        if (!isNaN(promedioSemanaValor)) {
            sumaNotas += promedioSemanaValor;
            cantidadNotas++;
        }
    });

    // Incluir las notas de los inputs actuales (E.T.A, Examen Mensual, etc.)
    this.filtrarTipoNotas.forEach((tipoNota) => {
        const controlName = `inputNota${tipoNota.idtipoNotas}`;
        const notaValor = parseFloat(alumnoFormGroup.get(controlName)?.value);

        console.log(`Nota ${controlName} del alumno ${index + 1}: ${notaValor}`); // Debug

        if (!isNaN(notaValor)) {
            sumaNotas += notaValor;
            cantidadNotas++;
        }
    });

    // Calcular el promedio total
    const promedio = cantidadNotas > 0 ? sumaNotas / cantidadNotas : 0;
    console.log(`Promedio total del alumno ${index + 1}: ${promedio}`); // Debug

    // Actualizar el control del promedio general
    alumnoFormGroup.get('inputPromedioNota')?.setValue(promedio.toFixed(2));
}

  
  obtenerIdTipoNotaPorNombre(nombre: string): number | '' {
    if (!this.tiponota || !Array.isArray(this.tiponota)) {
      return '';
    }
    const tipoNota = this.tiponota.find(t => t.tipNoNombre === nombre);
    return tipoNota ? tipoNota.idtipoNotas : ''; 
  }
  

  RegistrarNotas(): void {
    const unidadSeleccionada = this.notasacademicasUnidadform.get('selectUnidad')?.value;
    console.log('Unidad seleccionada:', unidadSeleccionada);
    if (!unidadSeleccionada ) {
      Swal.fire('Advertencia', 'Seleccione la Unidad Académica antes de continuar.', 'warning');
      return;
    }
  
    const usuarioId = this.accesoService.getUserID();
    if (!usuarioId) {
      Swal.fire('Error', 'No se pudo obtener el ID del usuario loggeado.', 'error');
      return;
    }
  
    const notasAgrupadas: any[] = [];
  
    this.filtrarTipoNotas.forEach((tipoNota) => {
      const notasPorTipo: any[] = [];
    
      this.alumnosNota.forEach((alumno, index) => {
        const alumnoFormGroup = (this.notasacademicasUnidadform.get('alumnosFormArray') as FormArray).at(index) as FormGroup;
        const notaControlName = `inputNota${tipoNota.idtipoNotas}`;
        const notaValor = alumnoFormGroup.get(notaControlName)?.value;
    
        // Solo registrar las notas visibles y válidas
        if (notaValor !== null && notaValor !== '' && !isNaN(notaValor)) {
          notasPorTipo.push({
            IdAlumno: alumno.idAlumno,
            notFechaRegistro: this.formatFecha(new Date()),
            NotNotaNumerica: Number(notaValor),
          });
        }
      });

  console.log('Notas por tipo:', notasPorTipo);

      if (notasPorTipo.length > 0) {
        notasAgrupadas.push({
          IdTipoNotas: tipoNota.idtipoNotas,
          IdGrado: this.gradorecibido,
          IdAsignatura: this.asignaturarecibida,
          IdBimestre: this.bimestrerecibido,
          IdPeriodo: this.periodorecibido,
          IdUnidad: unidadSeleccionada,
          IdSemana: this.semanarecibido || null,
          Notas: notasPorTipo,
        });
      }
    });

  console.log('Notas agrupadas:', notasAgrupadas);
  
    if (notasAgrupadas.length === 0) {
      Swal.fire('Advertencia', 'No hay notas para registrar o actualizar.', 'warning');
      return;
    }
  
    // Aquí solo enviamos las notas válidas (que contienen valor numérico)
    const requests = notasAgrupadas.map((notaPorTipo) => {
      const isUpdate = notaPorTipo.Notas.some((nota: any) => nota.NotNotaNumerica !== null);

      console.log(
        isUpdate
          ? `Actualizando notas para ${notaPorTipo.IdTipoNotas}`
          : `Registrando notas para ${notaPorTipo.IdTipoNotas}`
      );
  
      const requestObservable = isUpdate
        ? this.notasAcademicasService.actualizarNotas(usuarioId, notaPorTipo)
        : this.notasAcademicasService.registrarNotas(usuarioId, notaPorTipo);
  
      return requestObservable
        .toPromise()
        .then((response) => {
          console.log(
            isUpdate
              ? `Notas actualizadas para IdTipoNotas ${notaPorTipo.IdTipoNotas}:`
              : `Notas registradas para IdTipoNotas ${notaPorTipo.IdTipoNotas}:`,
            response
          );
        })
        .catch((error) => {
          console.error(
            isUpdate
              ? `Error al actualizar notas para IdTipoNotas ${notaPorTipo.IdTipoNotas}:`
              : `Error al registrar notas para IdTipoNotas ${notaPorTipo.IdTipoNotas}:`,
            error
          );
          // Mostrar un mensaje para cada tipo de nota que falló, pero continuar con los demás
          Swal.fire(
            'Error',
            `Error al procesar las notas para el tipo ${notaPorTipo.IdTipoNotas}.`,
            'error'
          );
        });
    });
  
    // Si no hay errores, mostrar mensaje de éxito
    Promise.all(requests).then(() => {
    }).catch(() => {
      Swal.fire('Error', 'Ocurrió un error al procesar algunas notas. Por favor, revise los datos.', 'error');
    });
  }
  

  RegistrarPromedios(): void {
  const unidadSeleccionada = this.notasacademicasUnidadform.get('selectUnidad')?.value;

  if (!unidadSeleccionada ) {
    Swal.fire('Advertencia', 'Seleccione tanto la Unidad Académica como la Semana Académica antes de continuar.', 'warning');
    return;
  }

  if (!this.asignaturarecibida || !this.bimestrerecibido || !this.periodorecibido) {
    Swal.fire('Error', 'Faltan datos clave como asignatura, bimestre o periodo.', 'error');
    return;
  }

  const promedios: any[] = [];
  const alumnosFormArray = this.notasacademicasUnidadform.get('alumnosFormArray') as FormArray;

  this.alumnosNota.forEach((alumno, index) => {
    const alumnoFormGroup = alumnosFormArray.at(index) as FormGroup;
    let sumaNotas = 0;
    let cantidadNotas = 0;

    // Incluir valores de los inputs readonly (promedios por semana)
    [1, 2, 3, 4].forEach((semana) => {
      const controlName = `promedioSemana${semana}`;
      const promedioSemanaValor = parseFloat(alumnoFormGroup.get(controlName)?.value);

      if (!isNaN(promedioSemanaValor)) {
        sumaNotas += promedioSemanaValor;
        cantidadNotas++;
      }
    });

    this.filtrarTipoNotas.forEach((tipoNota) => {
      const controlName = `inputNota${tipoNota.idtipoNotas}`;
      const notaValor = parseFloat(alumnoFormGroup.get(controlName)?.value);

      if (!isNaN(notaValor)) {
        sumaNotas += notaValor;
        cantidadNotas++;
      }
    });

    const promedio = cantidadNotas > 0 ? sumaNotas / cantidadNotas : 0;
    alumnoFormGroup.get('inputPromedioNota')?.setValue(promedio.toFixed(2));

    promedios.push({
      IdAlumno: alumno.idAlumno,
      IdAsignatura: this.asignaturarecibida,
      IdUnidad: unidadSeleccionada,
      IdBimestre: this.bimestrerecibido,
      IdPeriodo: this.periodorecibido,
      ValorPromedio: parseFloat(promedio.toFixed(2)),
    });
  });

  if (promedios.length === 0) {
    Swal.fire('Advertencia', 'No hay datos válidos para registrar o actualizar promedios.', 'warning');
    return;
  }

  this.notasAcademicasService.guardarOActualizarPromedios(promedios).subscribe({
    next: (response) => {
      if (response.isSuccess) {
      } else {
        Swal.fire('Advertencia', response.message || 'Hubo un problema en el registro o actualización.', 'warning');
      }
    },
    error: (error) => {
      console.error('Error al registrar o actualizar promedios:', error);
      Swal.fire('Error', 'No se pudieron guardar o actualizar los promedios.', 'error');
    }
  });
}

RegistrarTodo(): void {
  const unidadSeleccionada = this.notasacademicasUnidadform.get('selectUnidad')?.value;

  if (!unidadSeleccionada ) {
    Swal.fire('Advertencia', 'Seleccione tanto la Unidad Académica como la Semana Académica antes de continuar.', 'warning');
    return;
  }

  if (!this.asignaturarecibida || !this.bimestrerecibido || !this.periodorecibido) {
    Swal.fire('Error', 'Faltan datos clave como asignatura, bimestre o periodo.', 'error');
    return;
  }

  const registrarNotas = new Promise<void>((resolve, reject) => {
    try {
      this.RegistrarNotas();
      resolve();
    } catch (error) {
      console.error('Error al registrar notas:', error);
      reject(error);
    }
  });

  const registrarPromedios = new Promise<void>((resolve, reject) => {
    try {
      this.RegistrarPromedios();
      resolve();
    } catch (error) {
      console.error('Error al registrar promedios:', error);
      reject(error);
    }
  });
  Promise.all([registrarNotas, registrarPromedios])
    .then(() => {
      this.guardarCambios = true;
      Swal.fire('Éxito', 'Notas y promedios guardados correctamente.', 'success');
    })
    .catch((error) => {
      Swal.fire('Error', 'Ocurrió un error al registrar notas o promedios.', 'error');
    });
}

volver(): void {
  const alumnosFormArray = this.notasacademicasUnidadform.get('alumnosFormArray') as FormArray;
  let cambiosDetectados = false;

  // Verificar si algún campo de notas ha sido modificado
  for (let i = 0; i < alumnosFormArray.length; i++) {
    const alumnoFormGroup = alumnosFormArray.at(i) as FormGroup;
    
    // Detecta si alguna nota ha sido modificada
    const isNotaModified = Object.keys(alumnoFormGroup.controls)
      .some(controlName => controlName.startsWith('inputNota') && alumnoFormGroup.get(controlName)?.dirty);

    if (isNotaModified) {
      cambiosDetectados = true;
      break;
    }
  }

  // Si hay cambios y no han sido guardados, preguntar al usuario
  if (cambiosDetectados && !this.guardarCambios) {
    Swal.fire({
      title: '¿Está seguro de volver?',
      text: 'Tiene cambios sin guardar, ¿desea volver sin guardarlos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, volver',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        // Volver a la página anterior
        this.router.navigate(['/administracion-notas-registro-auxiliar']);
      }
    });
  } else {
    // Si no hay cambios o ya están guardados, simplemente volver
    this.router.navigate(['/administracion-notas-registro-auxiliar']);
  }
}


cargarPromedios(idUnidad: number): void {
  if (!idUnidad || !this.bimestrerecibido || !this.periodorecibido || !this.asignaturarecibida) {
    console.error('Datos faltantes para cargar promedios:', {
      idUnidad,
      bimestrerecibido: this.bimestrerecibido,
      periodorecibido: this.periodorecibido,
      asignaturarecibida: this.asignaturarecibida,
    });
    Swal.fire('Error', 'Faltan datos clave para cargar los promedios.', 'error');
    return;
  }

  this.notasAcademicasService.obtenerPromediosPorSemana(
    idUnidad,
    this.bimestrerecibido,
    this.periodorecibido,
    this.asignaturarecibida
  ).subscribe({
    next: (promediosData) => {
      console.log('Promedios por semana cargados:', promediosData);

      // Procesar los datos de promedios
      this.alumnosNota.forEach((alumno, index) => {
        const alumnoPromedios = promediosData.find(p => p.idAlumno === alumno.idAlumno);
        const alumnoFormGroup = (this.notasacademicasUnidadform.get('alumnosFormArray') as FormArray).at(index) as FormGroup;

        if (alumnoPromedios && alumnoPromedios.promediosPorSemana) {
          alumnoPromedios.promediosPorSemana.forEach((semana: any) => {
            if (semana.idsemana !== null) {
              const controlName = `promedioSemana${semana.idsemana}`;
              if (alumnoFormGroup.get(controlName)) {
                alumnoFormGroup.get(controlName)?.setValue(semana.promedio || '');
                console.log(`Asignando promedio para semana ${semana.idsemana} del alumno ${alumno.idAlumno}: ${semana.promedio}`);
              } else {
                console.warn(`Control ${controlName} no encontrado en el FormGroup del alumno ${alumno.idAlumno}`);
              }
            }
          });
        }
      });
    },
    error: (error) => {
      console.error('Error al cargar los promedios por semana:', error);
      Swal.fire('Error', 'No se pudieron cargar los promedios por semana.', 'error');
    }
  });
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
