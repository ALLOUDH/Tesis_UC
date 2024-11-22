import { Component, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NotasAcademicasService } from '../../../services/nota-academica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-notas-bimestrales',
  templateUrl: './ver-notas-bimestrales.component.html',
  styleUrl: './ver-notas-bimestrales.component.css'
})
export class VerNotasBimestralesComponent {
  alumnosNota: any[] = [];
  alumnosNotasBimestreForm: FormGroup;
  unidades: any[] = [];
  gradoNombre: string = '';
  bimestreNombre: string = '';
  asignaturaNombre: string = '';
 

  gradorecibido: number | null = null;
  periodorecibido: number | null = null;
  asignaturarecibida: number | null = null;
  bimestrerecibido: number | null = null;

  cambiosGuardados: boolean = false;


  constructor(
    private fb: FormBuilder,
    private notasAcademicasService: NotasAcademicasService,
  ) { 
    this.alumnosNotasBimestreForm = this.fb.group({
      alumnosFormArray: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const formData = localStorage.getItem('formData');
    if (formData) {
      const data = JSON.parse(formData);
      this.gradorecibido = data.gradoId;
      this.periodorecibido = data.selectPeriodo;
      this.asignaturarecibida = data.selectAsignatura;
      this.bimestrerecibido = data.selectBimestre;

      this.gradoNombre = data.gradoNombre || 'Sin nombre';
      this.bimestreNombre = data.bimestreNombre || 'Sin nombre';
      this.asignaturaNombre = data.asignaturaNombre || 'Sin nombre';

      this.obtenerAlumnosYPromedios();
    } else {
      Swal.fire('Error', 'No se encontraron datos para cargar.', 'error');
     
    }
    

  }

  obtenerAlumnosYPromedios(): void {
    if (!this.gradorecibido || !this.bimestrerecibido || !this.periodorecibido || !this.asignaturarecibida) {
      Swal.fire('Error', 'Faltan datos para cargar los alumnos y promedios.', 'error');
      return;
    }
console.log('Parámetros enviados a la API:', {
  grado: this.gradorecibido,
  bimestre: this.bimestrerecibido,
  periodo: this.periodorecibido,
  asignatura: this.asignaturarecibida
});

    this.notasAcademicasService
      .obtenerPromediosPorUnidad(this.gradorecibido,this.bimestrerecibido, this.periodorecibido, this.asignaturarecibida)
      .subscribe({
        next: (response) => {
          console.log('Respuesta recibida desde la API:', response);
          this.alumnosNota = response;
          
          this.actualizarAlumnosFormArray(this.alumnosNota.length);
          this.cargarPromediosEnFormulario();
          this.unidades = [
            ...new Set(
              this.alumnosNota.flatMap((a: { promediosPorUnidad: { idunidad: number }[] }) =>
                a.promediosPorUnidad.map((u: { idunidad: number }) => u.idunidad)
              )
            ),
          ];
          
        },
        error: (error) => {
          console.error('Error en la API:', error);
          Swal.fire('Error', 'No se pudieron cargar los promedios.', 'error');
        },
      });
  }
  
  obtenerPromedio(alumno: any, idUnidad: number): string {
    if (!alumno.promediosPorUnidad || alumno.promediosPorUnidad.length === 0) {
      return 'N/A'; 
    }
  
    const unidad = alumno.promediosPorUnidad.find((u: any) => u.idunidad === idUnidad);
    return unidad ? unidad.promedio.toString() : 'N/A';
  }
  
  
  
  actualizarAlumnosFormArray(cantidadAlumnos: number): void {
    const alumnosFormArray = this.alumnosNotasBimestreForm.get('alumnosFormArray') as FormArray;
    alumnosFormArray.clear();
  
    for (let alumno of this.alumnosNota) {
      alumnosFormArray.push(
        this.fb.group({
          idAlumno: new FormControl(alumno.idAlumno),
          promediosPorUnidad: this.fb.array(
            alumno.promediosPorUnidad.map((unidad: any) =>
              this.fb.group({
                idunidad: new FormControl(unidad.idunidad),
                promedio: new FormControl(unidad.promedio),
              })
            )
          ),
        })
      );
    }
  }
  
  cargarPromediosEnFormulario(): void {
    const alumnosFormArray = this.alumnosNotasBimestreForm.get('alumnosFormArray') as FormArray;

    this.alumnosNota.forEach((alumno, index) => {
      const alumnoFormGroup = alumnosFormArray.at(index) as FormGroup;

      alumnoFormGroup.patchValue({ idAlumno: alumno.idAlumno });

      const promediosArray = alumno.promediosPorUnidad.map((unidad: any) => {
        return this.fb.group({
          idUnidad: new FormControl({ value: unidad.Idunidad, disabled: true }), 
        promedio: new FormControl({ value: unidad.Promedio, disabled: true }) 
        });
      });

      alumnoFormGroup.setControl('promediosPorUnidad', this.fb.array(promediosArray));
    });
  }

  //Cada unidad debe tener un promedio para realizar el promedio general
  calcularPromedio(alumno: any): number | null {
    if (alumno.promediosPorUnidad && alumno.promediosPorUnidad.length > 0) {
      const sumaPromedios = alumno.promediosPorUnidad.reduce((acc: number, unidad: any) => {
        return acc + (unidad.promedio || 0);
      }, 0);
  
      const cantidadUnidades = alumno.promediosPorUnidad.length;
      return Number((sumaPromedios / cantidadUnidades).toFixed(2)); // Limitar a dos decimales
    }
    return null;
  }
  
  RegistrarPromedioGeneral(): void {
    if (!this.alumnosNota || this.alumnosNota.length === 0) {
      Swal.fire('Advertencia', 'No hay datos de alumnos para registrar los promedios.', 'warning');
      return;
    }
  
    const promedios: any[] = this.alumnosNota.map((alumno: any) => {
      const promedioGeneral = this.calcularPromedio(alumno); // Calcula el promedio general
      return {
        IdAlumno: alumno.idAlumno,
        IdAsignatura: this.asignaturarecibida,
        IdUnidad: null, // No hay unidad específica para el promedio general
        IdBimestre: this.bimestrerecibido,
        IdPeriodo: this.periodorecibido,
        IdSemana: null, // El promedio general no está asociado a semanas específicas
        ValorPromedio: promedioGeneral
      };
    });
  
    // Llamar al servicio para registrar o actualizar los promedios
    this.notasAcademicasService.guardarOActualizarPromedios(promedios).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire('Éxito', response.message, 'success');
          this.cambiosGuardados = true; 
        } else {
          Swal.fire('Advertencia', response.message || 'Hubo un problema al registrar los promedios.', 'warning');
        }
      },
      error: (error) => {
        console.error('Error al registrar los promedios generales:', error);
        Swal.fire('Error', 'Ocurrió un error al registrar los promedios generales.', 'error');
      }
    });
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
  
  obtenerColorNota(nota: number | string): string {
    const notaNumerica = typeof nota === 'string' ? parseFloat(nota) : nota;
    if (isNaN(notaNumerica)) {
      return ''; // Clase vacía si la nota no es válida
    }
    return notaNumerica < 10.5 ? 'text-danger' : 'text-primary';
  }

  
  volver(): void {
    if (!this.cambiosGuardados) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Por seguridad debe confirmar las notas. ¿Estás seguro de que deseas volver sin guardarlos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, volver',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          window.history.back();
        }
      });
    } else {
      window.history.back(); // Si los cambios ya fueron guardados, simplemente regresa
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (!this.cambiosGuardados) {
      $event.returnValue = false;  // Esto mostrará una advertencia de confirmación en algunos navegadores.
    }
  }
  
}
