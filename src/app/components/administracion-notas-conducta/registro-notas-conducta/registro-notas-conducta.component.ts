import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OthersIntDTO } from '../../../dtos/other.dto';
import { Router } from '@angular/router';
import { UnidadAcademicoService } from '../../../services/unidad-academico.service';
import { UnidadAcademicaDTO } from '../../../dtos/unidadacademica.dto';
import { NotasComportamientoService } from '../../../services/nota-comportamiento.service';
import { NotaDTO, NotaComportamientoDTO } from '../../../dtos/notacomportamiento.dto';
import { NotasPorAlumnoDTO } from '../../../dtos/listanotacomportamiento.dto';
import { TiponotasService } from '../../../services/tiponotas.service';
import { TipoNotasDTO } from '../../../dtos/tiponotas.dto';
import { CategorianotasService } from '../../../services/categorianotas.service';
import { ListaAlumnosDTO } from '../../../dtos/lista-alumnos.dto';
import { forkJoin } from 'rxjs';
import { AuditoriaService } from '../../../services/auditoria.service';


@Component({
  selector: 'app-registro-notas-conducta',
  templateUrl: './registro-notas-conducta.component.html',
  styleUrl: './registro-notas-conducta.component.css'
})
export class RegistroNotasComportamientoComponent implements OnInit {
  notasComportamientoForm: FormGroup;
  alumnos: NotasPorAlumnoDTO[] = [];
  unidadAcademica: UnidadAcademicaDTO[] = [];
  gradorecibido: number | null = null;
  periodorecibido: any;
  unidadrecibida: number | null = null;
  tiponota: TipoNotasDTO[] = [];  // Tipos de nota para generar campos dinámicamente
  buscarAlumno: ListaAlumnosDTO[] = [];

  unidadNombre: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notasComportamientoService: NotasComportamientoService,
    private unidadAcademicaService: UnidadAcademicoService,
    private tipoNotaService: TiponotasService,
    private categorianotaservice: CategorianotasService,
    private auditoriaService: AuditoriaService,
  ) {
    this.notasComportamientoForm = this.fb.group({
      inputEstudiante: new FormControl(''),
      selectGradoAcademico: new FormControl(''),
      selectUnidad: new FormControl(''),
      alumnosFormArray: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const formData = localStorage.getItem('formData');
    if (formData) {
      const datos = JSON.parse(formData);
      this.periodorecibido = datos.selectPeriodo;
      this.gradorecibido = datos.gradoId;
      this.unidadrecibida = datos.selectUnidad;
    }


    // Método modificado para cargar los datos y filtrar por nombre de categoría
    forkJoin([
      this.unidadAcademicaService.getUnidad(),
      this.categorianotaservice.getCategorias(), // Primero obtenemos las categorías para encontrar el ID correspondiente
      this.tipoNotaService.getTiposNota()
    ]).subscribe(
      ([unidadData, categoriasData, tipoNotaData]) => {
        this.unidadAcademica = unidadData;

        // Encuentra la categoría "Comportamiento" y su idcategoriaNotas
        const categoriaComportamiento = categoriasData.find(categoria => categoria.catNombre === 'Comportamiento');
        if (categoriaComportamiento) {
          const idCategoriaComportamiento = categoriaComportamiento.idcategoriaNotas;

          // Filtra los tipos de notas que pertenecen a la categoría "Comportamiento" usando el ID encontrado
          this.tiponota = tipoNotaData.filter(tipo => tipo.idcategoriaNotas === idCategoriaComportamiento);

          // Encuentra el nombre de la unidad seleccionada
          const unidadSeleccionada = this.unidadAcademica.find(unidad => unidad.idunidad === this.unidadrecibida);
          this.unidadNombre = unidadSeleccionada ? unidadSeleccionada.uniNombre : 'Sin nombre';

          this.obtenerNotasComportamiento();
        } else {
          console.error("La categoría 'Comportamiento' no fue encontrada.");
        }
      },
      (error) => console.error("Error al cargar datos iniciales:", error)
    );

  }

  obtenerNotasComportamiento(): void {
    if (this.gradorecibido && this.unidadrecibida && this.periodorecibido) {
      this.notasComportamientoService.obtenerNotas(this.gradorecibido, this.unidadrecibida, this.periodorecibido).subscribe(
        (data: NotasPorAlumnoDTO[]) => {
          this.alumnos = data;
          this.actualizarAlumnosFormArray(this.alumnos.length);

          this.alumnos.forEach((alumno, index) => {
            const alumnoFormGroup = (this.notasComportamientoForm.get('alumnosFormArray') as FormArray).at(index) as FormGroup;

            this.tiponota.forEach(tipoNota => {
              const controlName = `inputNotaComportamiento${tipoNota.idtipoNotas}`;
              const notaValor = alumno.notas[tipoNota.idtipoNotas] !== undefined
                ? alumno.notas[tipoNota.idtipoNotas]
                : '';
              alumnoFormGroup.get(controlName)?.setValue(notaValor);
            });
            this.calcularPromedio(index);
          });
        },
        (error) => Swal.fire('Error', 'No se pudieron obtener las notas de comportamiento.', 'error')
      );
    } else {
      Swal.fire('Error', 'Seleccione un grado, unidad y periodo.', 'warning');
    }
  }

  actualizarAlumnosFormArray(cantidadAlumnos: number) {
    const alumnosFormArray = this.notasComportamientoForm.get('alumnosFormArray') as FormArray;
    alumnosFormArray.clear();

    for (let i = 0; i < cantidadAlumnos; i++) {
      alumnosFormArray.push(this.crearFormGroupAlumno());
    }
  }

  crearFormGroupAlumno(): FormGroup {
    const formGroup = this.fb.group({});
    this.tiponota.forEach((tipoNota, index) => {
      const controlName = `inputNotaComportamiento${tipoNota.idtipoNotas}`;
      formGroup.addControl(controlName, new FormControl('', [Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')]));
    });
    formGroup.addControl('inputPromedioNotasComportamiento', new FormControl({ value: '', disabled: true }, Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')));
    return formGroup;
  }

  calcularPromedio(alumnoIndex: number): void {
    const alumnoFormGroup = (this.notasComportamientoForm.get('alumnosFormArray') as FormArray).at(alumnoIndex) as FormGroup;
    const totalFields = this.tiponota.length;

    const notas = this.tiponota.map((tipoNota) => {
      const controlName = `inputNotaComportamiento${tipoNota.idtipoNotas}`;
      const notaValue = parseFloat(alumnoFormGroup.get(controlName)?.value || '0');
      return !isNaN(notaValue) ? notaValue : 0;
    });

    const promedio = (notas.reduce((a, b) => a + b) / totalFields).toFixed(2);
    alumnoFormGroup.get('inputPromedioNotasComportamiento')?.setValue(promedio);
  }

  RegistrarNotasComportamiento(): void {
    const alumnos = this.buscarAlumno.length > 0 ? this.buscarAlumno : this.alumnos;
    const notasPorTipo: NotaComportamientoDTO[] = [];
    const idUnidad = this.unidadrecibida;
    const idGrado = this.gradorecibido;

    // Iterar sobre cada tipo de nota y cada alumno
    this.tiponota.forEach(tipoNota => {
      const notasPorTipoIndividual: NotaDTO[] = [];

      alumnos.forEach((alumno, index) => {
        const alumnoFormGroup = (this.notasComportamientoForm.get('alumnosFormArray') as FormArray).at(index) as FormGroup;
        const notaControlName = `inputNotaComportamiento${tipoNota.idtipoNotas}`;
        const notaValor = alumnoFormGroup.get(notaControlName)?.value;

        if (notaValor !== null && notaValor !== '') {  // Si hay una nota válida, agregarla
          notasPorTipoIndividual.push({
            idalumno: alumno.idalumno,
            NotNotaNumerica: Number(notaValor),
          });
        }
      });

      if (notasPorTipoIndividual.length > 0) {
        notasPorTipo.push({
          IdasignarDocente: null,
          IdtipoNotas: tipoNota.idtipoNotas,
          Idunidad: idUnidad!,
          Idgrado: idGrado!,
          Notas: notasPorTipoIndividual
        });
      }
    });

    console.log('Notas agrupadas por tipo de nota:', notasPorTipo);

    if (notasPorTipo.length > 0) {
      // Procesar cada agrupación de notas individualmente para determinar si se debe hacer POST o PUT
      const requests = notasPorTipo.map(notaPorTipo => {
        const isUpdate = notaPorTipo.Notas.some(nota => nota.NotNotaNumerica !== null);

        const requestObservable = isUpdate
          ? this.notasComportamientoService.actualizarNotas(notaPorTipo)
          : this.notasComportamientoService.registrarNotasComportamiento(notaPorTipo);

        return requestObservable.toPromise()
          .then(response => {
            console.log(isUpdate ? `Notas actualizadas para IdtipoNotas ${notaPorTipo.IdtipoNotas}:` : `Notas registradas para IdtipoNotas ${notaPorTipo.IdtipoNotas}:`, response);

            // Llamada al servicio de auditoría en caso de éxito
            this.auditoriaService.auditoriaregistrarNotaComportamiento(true).subscribe(
              (auditoriaResponse) => {
                console.log('Auditoría de notas de comportamiento realizada:', auditoriaResponse);
              },
              (auditoriaError) => {
                console.error('Error al registrar auditoría de notas de comportamiento:', auditoriaError);
              }
            );
          })
          .catch(error => {
            console.error(isUpdate ? `Error al actualizar notas para IdtipoNotas ${notaPorTipo.IdtipoNotas}:` : `Error al registrar notas para IdtipoNotas ${notaPorTipo.IdtipoNotas}:`, error);
            Swal.fire('Error', `No se pudieron procesar las notas para el tipo ${notaPorTipo.IdtipoNotas}.`, 'error');

            // Llamada al servicio de auditoría en caso de error
            this.auditoriaService.auditoriaregistrarNotaComportamiento(false).subscribe(
              (auditoriaResponse) => {
                console.log('Auditoría de notas de comportamiento realizada:', auditoriaResponse);
              },
              (auditoriaError) => {
                console.error('Error al registrar auditoría de notas de comportamiento:', auditoriaError);
              }
            );
          });
      });

      // Esperar a que todos los requests finalicen
      Promise.all(requests).then(() => {
        this.alumnos.forEach((_, index) => this.calcularPromedio(index));
        this.MostrarMensajeExito('Notas guardadas', 'Todas las notas se guardaron o actualizaron con éxito.');

        // Llamada de auditoría después de que todas las notas hayan sido procesadas
        this.auditoriaService.auditoriaregistrarNotaComportamiento(true).subscribe(
          (auditoriaResponse) => {
            console.log('Auditoría finalizada después de guardar/actualizar todas las notas de comportamiento:', auditoriaResponse);
          },
          (auditoriaError) => {
            console.error('Error finalizando auditoría después de guardar/actualizar notas de comportamiento:', auditoriaError);
          }
        );
      });
    } else {
      console.warn('No hay alumnos y/o notas registradas');
      this.MostrarMensajeError('No hay alumnos y/o notas registradas.', 'Error');

      // Llamar al servicio de auditoría si no hay notas para procesar
      this.auditoriaService.auditoriaregistrarNotaComportamiento(false).subscribe(
        (auditoriaResponse) => {
          console.log('Auditoría de intento de registro de notas de comportamiento (sin notas) realizada:', auditoriaResponse);
        },
        (auditoriaError) => {
          console.error('Error al registrar auditoría de intento de registro de notas sin notas de comportamiento:', auditoriaError);
        }
      );
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
