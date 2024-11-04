import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ListaAlumnosDTO } from '../../../dtos/lista-alumnos.dto';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GradoAcademicoService } from '../../../services/grados.service';
import { EstadoUsuarioService } from '../../../services/estado-usuario.service';
import { VistasService } from '../../../services/vistas.service';
import { OthersIntDTO } from '../../../dtos/other.dto';
import { Router } from '@angular/router';
import { BimestreAcademicoService } from '../../../services/bimestre-academico.service';
import { BimestreAcademicoDTO } from '../../../dtos/bimestreacademico.dto';
import { NotasPadreService } from '../../../services/notas-padre.service';
import { NotasPorPadreDTO } from '../../../dtos/notas-padres.dto';

@Component({
  selector: 'app-registro-notas-padre',
  templateUrl: './registro-notas-padre.component.html',
  styleUrl: './registro-notas-padre.component.css'
})
export class RegistroNotasPadreComponent implements OnInit {
  notaspadreform: FormGroup;
  alumnos: NotasPorPadreDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];
  listadoalumnos: string[] = [];
  buscarAlumno: ListaAlumnosDTO[] = [];
  bimestreAcademico: BimestreAcademicoDTO[] = [];
  datosrecibidos: any;
  gradorecibido: any;
  periodorecibido: any;
  bimestrerecibido: any;
  notas: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private vistasService: VistasService,
    private notasPadreService: NotasPadreService,
    private bimestreAcademicoService: BimestreAcademicoService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
  ) {
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.notaspadreform = this.fb.group({
      inputEstudiante: new FormControl(''),
      inputNroDocumento: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      selectGradoAcademico: new FormControl(''),
      selectEstadoUsuario: new FormControl(''),
      selectBimestre: new FormControl(''),
      alumnosFormArray: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const formData = localStorage.getItem('formData');
    console.log('Datos recibidos:', formData); // Verifica que estos datos sean correctos
    if (formData) {
      this.datosrecibidos = JSON.parse(formData);

      this.periodorecibido = this.datosrecibidos.selectPeriodo;
      this.gradorecibido = this.datosrecibidos.gradoId;
      this.bimestrerecibido = this.datosrecibidos.selectBimestre;

      console.log('Periodo recibido:', this.periodorecibido);
      console.log('Grado recibido:', this.gradorecibido);
      console.log('Bimestre recibido:', this.bimestrerecibido);

    } else {
      console.log('No se recibieron datos.');
    }
    this.obtenerNotasPadre();
    this.bimestreAcademicoService.getBimestre().subscribe(
      (data: BimestreAcademicoDTO[]) => {
        this.bimestreAcademico = data;
      },
      (error) => {
        console.error("Error al obtener los bimestres:", error);
      }
    );
  }

  obtenerNotasPadre(): void {
    if (this.gradorecibido && this.bimestrerecibido && this.periodorecibido) {
      this.notasPadreService.obtenerNotasPadre(this.gradorecibido, this.bimestrerecibido, this.periodorecibido).subscribe(
        (data: NotasPorPadreDTO[]) => {
          if (data.length === 0) {
            console.warn('No se encontraron notas para los alumnos.');
            this.alumnos = [];  // Asignar lista vacía
            this.actualizarAlumnosFormArray(0); // Asegúrate de actualizar el FormArray
          } else {
            // Asigna los datos recibidos y calcula el promedio de cada alumno
            this.alumnos = data.map(alumno => {
              const notas = Object.values(alumno.notas).filter(nota => nota !== null) as number[];
              const promedio = notas.length > 0 
                ? Number((notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2)) // Calcula el promedio con 2 decimales
                : 0; // Asegúrate de que sea un número

              return {
                idalumno: alumno.idalumno,  // Asegúrate de incluir el ID
                nombre: alumno.nombre,
                apellidoPaterno: alumno.apellidoPaterno,
                apellidoMaterno: alumno.apellidoMaterno,
                notas: alumno.notas,
                promedio: promedio
              };  // Incluye el promedio y otros datos del alumno
            });

            this.actualizarAlumnosFormArray(this.alumnos.length); // Actualiza el FormArray

            // Llena los inputs de notas en el formulario
            this.alumnos.forEach((alumno, index) => {
              const alumnoFormGroup = (this.notaspadreform.get('alumnosFormArray') as FormArray).at(index) as FormGroup;

              // Asigna cada tipo de nota a su campo correspondiente en el formulario
              for (let tipoNota in alumno.notas) {
                const controlName = `inputNotaPadre${tipoNota}`;
                if (alumnoFormGroup.get(controlName)) {
                  alumnoFormGroup.get(controlName)?.setValue(alumno.notas[tipoNota]);
                }
              }

              // Establece el promedio en el campo correspondiente
              alumnoFormGroup.get('inputPromedioNotasPadre')?.setValue(alumno.promedio);
            });
          }
        },
        (error) => Swal.fire('Error', 'No se pudieron obtener las notas.', 'error')
      );
    } else {
      Swal.fire('Error', 'Seleccione un grado, bimestre y periodo.', 'warning');
    }
  }

  // obtenerAlumnos() {
  //   this.notasPadreService.obtenerAlumnosGradoPeriodo(this.gradorecibido, this.periodorecibido).subscribe(
  //     (data: ListaAlumnosDTO[]) => {
  //       if (data.length === 0) {
  //         console.warn('No se encontraron alumnos registrados.');
  //         this.alumnos = []; // Asignar lista vacía para actualizar la tabla
  //       } else {
  //         this.alumnos = data; // Asigna los datos obtenidos
  //         this.actualizarAlumnosFormArray(data.length);
  //         this.listadoalumnos = data.map(alumno =>
  //           `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`
  //         ); // Llena el arreglo de nombres
  //       }
  //     },
  //     (error) => {
  //       console.error('Error al obtener los alumnos', error);
  //     }
  //   );
  // this.vistasService.obtenerAlumnos().subscribe(
  //   (data: ListaAlumnosDTO[]) => {
  //     if (data.length === 0) {
  //       console.warn('No se encontraron alumnos registrados.');
  //       this.alumnos = []; // Asignar lista vacía para actualizar la tabla
  //     } else {
  //       this.alumnos = data; // Asigna los datos obtenidos
  //       this.actualizarAlumnosFormArray(data.length);
  //       this.listadoalumnos = data.map(alumno =>
  //         `${alumno.usNombre} ${alumno.usApellidoPaterno} ${alumno.usApellidoMaterno}`
  //       ); // Llena el arreglo de nombres
  //     }
  //   },
  //   (error) => {
  //     console.error('Error al obtener los alumnos', error);
  //   }
  // );
  // }

  actualizarAlumnosFormArray(cantidadAlumnos: number) {
    const alumnosFormArray = this.notaspadreform.get('alumnosFormArray') as FormArray;
    alumnosFormArray.clear();

    for (let i = 0; i < cantidadAlumnos; i++) {
      alumnosFormArray.push(this.crearFormGroupAlumno(i));
    }
    console.log('FormArray actualizado con', cantidadAlumnos, 'alumnos:', alumnosFormArray.value);
  }

  crearFormGroupAlumno(index: number): FormGroup {
    return this.fb.group({
      inputNotaPadre1: ['', Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')],
      inputNotaPadre2: ['', Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')],
      inputNotaPadre3: ['', Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')],
      inputPromedioNotasPadre: ['', Validators.pattern('^\\d{1,2}(\\.\\d{1,2})?$')]
    });
  }

  RegistrarNotasPadre(): void {
    const alumnos = this.buscarAlumno.length > 0 ? this.buscarAlumno : this.alumnos;
    const notasPorTipo = [];

    console.log('Alumnos a procesar:', alumnos); // Log para verificar alumnos

    const idbimestre = this.bimestrerecibido;
    const idgrado = this.gradorecibido;

    for (let index = 0; index < alumnos.length; index++) {
      const idalumno = alumnos[index].idalumno;
      const alumnosFormArray = this.notaspadreform.get('alumnosFormArray') as FormArray;
      const alumnoFormGroup = alumnosFormArray.at(index) as FormGroup;

      for (let tipoNota = 1; tipoNota <= 3; tipoNota++) {
        const notaControlName = `inputNotaPadre${tipoNota}`;
        const nota = alumnoFormGroup.get(notaControlName)?.value;

        console.log(`Nota para ${tipoNota} de alumno ${idalumno}:`, nota); // Log para verificar el valor

        if (nota !== null && nota !== '') { // Solo procesa si hay una nota válida
          const indexExistente = notasPorTipo.findIndex(notaTipo =>
            notaTipo.idbimestre === idbimestre &&
            notaTipo.idgrado === idgrado &&
            notaTipo.idtipoNotas === tipoNota
          );

          if (indexExistente !== -1) {
            // Si ya existe, agrega la nota
            notasPorTipo[indexExistente].notas.push({
              idalumno: idalumno,
              notNotaNumerica: Number(nota),
            });
          } else {
            // Si no existe, crea una nueva entrada
            notasPorTipo.push({
              idbimestre: idbimestre,
              idgrado: idgrado,
              idtipoNotas: tipoNota,
              notas: [{
                idalumno: idalumno,
                notNotaNumerica: Number(nota),
              }]
            });
          }
        } else {
          console.warn(`Nota no válida para el alumno ${idalumno} en el tipo ${tipoNota}.`);
        }
      }
    }

    console.log('Notas agrupadas:', notasPorTipo);

    if (notasPorTipo.length > 0) {
      const tieneNotasNulas = notasPorTipo.some(notaTipo =>
        notaTipo.notas.some(nota => nota.notNotaNumerica === null)
      );

      if (tieneNotasNulas) {
        // Ejecutar POST
        this.notasPadreService.registrarNotasPadre(notasPorTipo).subscribe(
          (response) => {
            console.log('Notas registradas con éxito:', response);
            this.MostrarMensajeExito('Notas guardadas', 'Las notas se guardaron con éxito.');
          },
          (error) => {
            console.error('Error al registrar notas:', error);
            this.MostrarMensajeError('No se pudieron registrar las notas.', 'Error');
          }
        );
      } else {
        // Ejecutar PUT
        this.notasPadreService.actualizarNotasPadre(notasPorTipo).subscribe(
          (response) => {
            console.log('Notas actualizadas con éxito:', response);
            this.MostrarMensajeExito('Notas guardadas', 'Las notas se guardaron con éxito.');
          },
          (error) => {
            console.error('Error al actualizar notas:', error);
            this.MostrarMensajeError('No se pudieron actualizar las notas.', 'Error');
          }
        );
      }
    } else {
      console.warn('No hay alumnos y/o notas registradas'); // Mensaje si no hay notas
      this.MostrarMensajeError('No hay alumnos y/o notas registradas.', 'Error');
    }
  }

  LimpiarFormulario() {
    this.notaspadreform.reset();
  }

  validarCamposBusqueda(): boolean {
    const terminobusqueda = this.notaspadreform.get('inputEstudiante')?.value;
    const nroDocumento = this.notaspadreform.get('inputNroDocumento')?.value;
    const gradoAcademico = this.notaspadreform.get('selectGradoAcademico')?.value;
    const estadoUsuario = this.notaspadreform.get('selectEstadoUsuario')?.value;

    return !!(terminobusqueda || nroDocumento || gradoAcademico || estadoUsuario === true || estadoUsuario === false);
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
