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
  selector: 'app-registro-notas-academicas',
  templateUrl: './registro-notas-academicas.component.html',
  styleUrl: './registro-notas-academicas.component.css'
})
export class RegistroNotasAcademicasComponent {
  notasacademicasform: FormGroup;
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

  gradorecibido: number | null = null;
  periodorecibido: number | null = null;
  asignaturarecibida: number | null = null;
  bimestrerecibido: number | null = null;
  stateData: any = {}; 
  tiponota: TipoNotasDTO[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];

  filtrarTipoNotas: TipoNotasDTO[] = [];
  configuracionNotasPorSemana: { [semana: number]: string[] } = {
    1: ['Tarea', 'Fast Test', 'Aptitudinal', 'Nota Adicional'],
    2: ['Tarea', 'Fast Test', 'Aptitudinal', 'Nota Adicional'],
    3: ['Tarea', 'Fast Test', 'Aptitudinal', 'Nota Adicional'],
    4: ['Rev. de Cuaderno', 'Aptitudinal', 'Rev. de Libro', 'Nota Adicional'],
  };

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
    this.notasacademicasform = this.fb.group({
      inputEstudiante: new FormControl(''),
      selectUnidad: new FormControl('', Validators.required), 
      selectSemana: new FormControl('', Validators.required), 
      inputUnidad:  new FormControl('', Validators.required), 
      inputSemana: new FormControl('', Validators.required), 
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
    
  }else {
    Swal.fire('Error', 'No se recibieron los datos necesarios para continuar.', 'error');
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
      this.tipoNotaService.getTiposNota()
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
  }
  obtenerNombreUnidad(idUnidad: number): void {
    const unidad = this.unidadAcademica.find(b => b.idunidad === idUnidad);
    if (unidad) {
      this.notasacademicasform.patchValue({ inputUnidad: unidad.uniNombre });
    } else {
      console.error('Bimestre no encontrado:', idUnidad);
    }
  }
  obtenerNombreSemana(idSemana: number): void {
    const semana = this.Semanas.find(b => b.id === idSemana);
    if (semana) {
      this.notasacademicasform.patchValue({ inputSemana: semana.nombre });
    } else {
      console.error('Bimestre no encontrado:', idSemana);
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
    const unidadSeleccionada = this.notasacademicasform.get('selectUnidad')?.value;
    const semanaSeleccionada = this.notasacademicasform.get('selectSemana')?.value;

    if (!unidadSeleccionada || !semanaSeleccionada) {
      Swal.fire('Advertencia', 'Para ver y realizar el registro, debe seleccionar una unidad y una semana.', 'warning');
      return;
    }
    this.obtenerNombreUnidad(unidadSeleccionada);
    this.obtenerNombreSemana(semanaSeleccionada);

    // Filtrar tipos de notas según la semana seleccionada
    this.filtrarTipoNotas = this.obtenerfiltroTipoNotas(semanaSeleccionada);


    if (this.gradorecibido && this.periodorecibido && this.bimestrerecibido && this.asignaturarecibida) {
      this.notasAcademicasService
        .obtenerNotasAuxiliares(
          this.gradorecibido,
          semanaSeleccionada,
          unidadSeleccionada,
          this.bimestrerecibido,
          this.periodorecibido
        )
        .subscribe(
          (data: AlumnoNotaDTO[]) => {
            this.alumnosNota = data;
            console.log('Alumnos y notas cargados:', this.alumnosNota);
            this.actualizarAlumnosFormArray(this.alumnosNota.length);
            this.cargarNotasEnFormulario();
          },
          (error) => Swal.fire('Error', 'No se pudieron obtener las notas iniciales.', 'error')
        );
    }
  }
  
obtenerfiltroTipoNotas(semana: number): TipoNotasDTO[] {
    const nombresNotasSemana = this.configuracionNotasPorSemana[semana] || [];
    return this.tiponota.filter((tipoNota) => nombresNotasSemana.includes(tipoNota.tipNoNombre));
  }

  cargarNotasEnFormulario(): void {
    const alumnosFormArray = this.notasacademicasform.get('alumnosFormArray') as FormArray;
  
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
    const alumnosFormArray = this.notasacademicasform.get('alumnosFormArray') as FormArray;
    alumnosFormArray.clear();

    for (let i = 0; i < cantidadAlumnos; i++) {
      const formGroup = this.fb.group({});
      this.filtrarTipoNotas.forEach((tipoNota) => {
        formGroup.addControl(
          `inputNota${tipoNota.idtipoNotas}`,
          new FormControl('', [Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')])
        );
      });
      formGroup.addControl('inputPromedioNota', new FormControl({ value: '', disabled: true }));
      alumnosFormArray.push(formGroup);
    }
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
    const alumnoFormGroup = (this.notasacademicasform.get('alumnosFormArray') as FormArray).at(index) as FormGroup;
    let sumaNotas = 0;
    let cantidadNotas = 0;

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
  }

  RegistrarNotas(): void {
    const unidadSeleccionada = this.notasacademicasform.get('selectUnidad')?.value;
    const semanaSeleccionada = this.notasacademicasform.get('selectSemana')?.value;
  
    if (!unidadSeleccionada || !semanaSeleccionada) {
      Swal.fire('Advertencia', 'Seleccione tanto la Unidad Académica como la Semana Académica antes de continuar.', 'warning');
      return;
    }
  
    const usuarioId = this.accesoService.getUserID();
    if (!usuarioId) {
      Swal.fire('Error', 'No se pudo obtener el ID del usuario loggeado.', 'error');
      return;
    }
  
    const notasAgrupadas: any[] = [];
  
    this.tiponota.forEach((tipoNota) => {
      const notasPorTipo: any[] = [];
  
      this.alumnosNota.forEach((alumno, index) => {
        const alumnoFormGroup = (this.notasacademicasform.get('alumnosFormArray') as FormArray).at(index) as FormGroup;
        const notaControlName = `inputNota${tipoNota.idtipoNotas}`;
        const notaValor = alumnoFormGroup.get(notaControlName)?.value;
  
        // Solo agregar las notas que tienen valor numérico y no están vacías
        if (notaValor !== null && notaValor !== '' && !isNaN(notaValor)) {
          notasPorTipo.push({
            IdAlumno: alumno.idAlumno,
            notFechaRegistro: this.formatFecha(new Date()),
            NotNotaNumerica: Number(notaValor),
          });
        }
      });
  
      if (notasPorTipo.length > 0) {
        notasAgrupadas.push({
          IdTipoNotas: tipoNota.idtipoNotas,
          IdGrado: this.gradorecibido,
          IdAsignatura: this.asignaturarecibida,
          IdBimestre: this.bimestrerecibido,
          IdPeriodo: this.periodorecibido,
          IdUnidad: unidadSeleccionada,
          IdSemana: semanaSeleccionada,
          Notas: notasPorTipo,
        });
      }
    });
  
    if (notasAgrupadas.length === 0) {
      Swal.fire('Advertencia', 'No hay notas para registrar o actualizar.', 'warning');
      return;
    }
  
    // Aquí solo enviamos las notas válidas (que contienen valor numérico)
    const requests = notasAgrupadas.map((notaPorTipo) => {
      const isUpdate = notaPorTipo.Notas.some((nota: any) => nota.NotNotaNumerica !== null);
  
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
  const unidadSeleccionada = this.notasacademicasform.get('selectUnidad')?.value;
  const semanaSeleccionada = this.notasacademicasform.get('selectSemana')?.value;

  if (!unidadSeleccionada || !semanaSeleccionada) {
    Swal.fire('Advertencia', 'Seleccione tanto la Unidad Académica como la Semana Académica antes de continuar.', 'warning');
    return;
  }

  if (!this.asignaturarecibida || !this.bimestrerecibido || !this.periodorecibido) {
    Swal.fire('Error', 'Faltan datos clave como asignatura, bimestre o periodo.', 'error');
    return;
  }

  const promedios: any[] = [];
  const alumnosFormArray = this.notasacademicasform.get('alumnosFormArray') as FormArray;

  this.alumnosNota.forEach((alumno, index) => {
    const alumnoFormGroup = alumnosFormArray.at(index) as FormGroup;
    let sumaNotas = 0;
    let cantidadNotas = 0;

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
  const unidadSeleccionada = this.notasacademicasform.get('selectUnidad')?.value;
  const semanaSeleccionada = this.notasacademicasform.get('selectSemana')?.value;

  if (!unidadSeleccionada || !semanaSeleccionada) {
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
      Swal.fire('Éxito', 'Notas y promedios guardados correctamente.', 'success');
    })
    .catch((error) => {
      Swal.fire('Error', 'Ocurrió un error al registrar notas o promedios.', 'error');
    });
}

volver(): void {
  // Verificar si algún campo relacionado con las notas ha sido modificado
  const alumnosFormArray = this.notasacademicasform.get('alumnosFormArray') as FormArray;
  let cambiosDetectados = false;

  // Verificar si algún campo de notas ha sido modificado
  for (let i = 0; i < alumnosFormArray.length; i++) {
    const alumnoFormGroup = alumnosFormArray.at(i) as FormGroup;
    
    // Aquí estamos verificando si alguno de los campos de notas en ese grupo ha sido modificado
    const isNotaModified = Object.keys(alumnoFormGroup.controls)
      .some(controlName => controlName.startsWith('inputNota') && alumnoFormGroup.get(controlName)?.dirty);

    if (isNotaModified) {
      cambiosDetectados = true;
      break;
    }
  }

  if (cambiosDetectados) {
    // Mostrar un mensaje de confirmación si hay cambios en las notas
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Tienes cambios no guardados en las notas. Si regresas, se perderán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, volver',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, volver a la página anterior
        this.location.back();
      }
      // Si el usuario cancela, no hacer nada (mantenerse en la página actual)
    });
  } else {
    // Si no hay cambios, volver directamente
    this.location.back();
  }
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
