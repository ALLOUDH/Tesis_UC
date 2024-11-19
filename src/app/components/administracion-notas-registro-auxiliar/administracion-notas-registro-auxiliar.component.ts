import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OthersIntDTO } from '../../dtos/other.dto';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';
import { Router } from '@angular/router';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';
import { GradoAcademicoService } from '../../services/grados.service';
import Swal from 'sweetalert2';
import { BimestreAcademicoDTO } from '../../dtos/bimestreacademico.dto';
import { BimestreAcademicoService } from '../../services/bimestre-academico.service';
import { AsignaturaDTO } from '../../dtos/asignatura.dto';
import { AsignaturaService } from '../../services/asignatura.service';
import { AccesoService } from '../../services/acceso.service';
import { NotasAcademicasService } from '../../services/nota-academica.service';

@Component({
  selector: 'app-administracion-notas-registro-auxiliar',
  templateUrl: './administracion-notas-registro-auxiliar.component.html',
  styleUrl: './administracion-notas-registro-auxiliar.component.css'
})
export class AdministracionNotasRegistroAuxiliarComponent {
  notasacademicasform: FormGroup;
  otherGradoAcademico: OthersIntDTO[] = [];
  periodoAcademico: PeriodoAcademicoDTO[] = [];
  bimestreAcademico: BimestreAcademicoDTO[] = [];
  asignaturas: AsignaturaDTO[] = [];
  filtrarBimestreAcademico: BimestreAcademicoDTO[] = [];

  asignaturasPorGrado: { [gradoId: number]: AsignaturaDTO[] } = {};
  usuarioId: number | null = null;
  asignaturasFiltradas: AsignaturaDTO[] = [];

  asignaturasFiltradasPorSeccion: AsignaturaDTO[][] = [];

  

  constructor(
    private route: Router,
    private periodoAcademicoService: PeriodoAcademicoService,
    private gradoAcademicoService: GradoAcademicoService,
    private bimestreAcademicoService: BimestreAcademicoService,
    private asignaturaService: AsignaturaService,
    private acccesoService: AccesoService,
    private notasacademicasService: NotasAcademicasService
  ) {
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.notasacademicasform = new FormGroup({
      selectPeriodo: new FormControl(''),
      selectBimestre: new FormControl('', Validators.required),
      selectAsignatura: new FormControl('', Validators.required),
      selectGrado: new FormControl('', Validators.required), 
    });
    for (let i = 0; i < this.otherGradoAcademico.length; i++) {
      this.notasacademicasform.addControl(`inputGrado${i + 1}`, new FormControl(this.otherGradoAcademico[i].nombre));
    }
   
  }

  ngOnInit(): void {
    this.usuarioId = this.acccesoService.getUserID();
    if (this.usuarioId) {
      this.cargarGradosYAsignaturas(this.usuarioId);
      console.log("ID del usuario logueado:", this.usuarioId);
    } else {
      this.MostrarMensajeError('Error al obtener el ID del usuario logueado.', 'Error');
    }

    this.bimestreAcademicoService.getBimestre().subscribe(
      (data: BimestreAcademicoDTO[]) => {
        this.bimestreAcademico = data;
        const selectedPeriodoId = this.notasacademicasform.get('selectPeriodo')?.value;
        if (selectedPeriodoId) {
          this.actualizarfiltrobimestre(selectedPeriodoId);
        }
      },
      (error) => {
        console.error("Error al obtener los bimestres:", error);
      }
    );

    this.notasacademicasform.get('selectPeriodo')?.valueChanges.subscribe(selectedPeriodoId => {
      if (selectedPeriodoId) { // Verifica que el periodo seleccionado no esté vacío
        this.actualizarfiltrobimestre(selectedPeriodoId);
      } else {
        this.filtrarBimestreAcademico = []; 
      }
    });

    this.periodoAcademicoService.getPeriodo().subscribe(
      (data: PeriodoAcademicoDTO[]) => {
        this.periodoAcademico = data;
        this.setDefaultPeriodo();
      },
      (error) => {
        console.error("Error al obtener los periodos:", error);
      }
    );
    

  }

  private cargarGradosYAsignaturas(usuarioId: number): void {
    this.notasacademicasService.obtenerGradosYAsignaturas(usuarioId).subscribe(
      (data: { idGrado: number, graNombre: string, graCodigoSalon: string, asignaturas: AsignaturaDTO[] }[]) => {
        console.log("Datos recibidos de la API:", data);
  
        // Mapear grados
        this.otherGradoAcademico = data.map(grado => ({
          id: typeof grado.idGrado === 'number' ? grado.idGrado : 0,
          nombre: grado.graNombre,
          codigoSalon: grado.graCodigoSalon
        }));
  
        // Construir el mapa de asignaturas por grado
        this.asignaturasPorGrado = {};
        this.asignaturasFiltradasPorSeccion = []; // Inicializa las asignaturas filtradas por sección
  
        data.forEach((grado, index) => {
          if (typeof grado.idGrado === 'number') {
            this.asignaturasPorGrado[grado.idGrado] = grado.asignaturas || [];
            // Inicializa las asignaturas filtradas por índice
            this.asignaturasFiltradasPorSeccion[index] = this.asignaturasPorGrado[grado.idGrado] || [];
          }
        });
  
        console.log("Mapa de asignaturas por grado:", this.asignaturasPorGrado);
      },
      (error) => {
        console.error('Error al obtener grados y asignaturas:', error);
        this.MostrarMensajeError('Error al cargar los grados y asignaturas.', 'Error');
      }
    );
  }
  

  
  
  filtrarAsignaturasPorGrado(gradoId: number, index: number): void {
    // Filtra asignaturas específicas para el grado actual y almacénalas por índice de sección
    if (this.asignaturasPorGrado[gradoId]) {
      this.asignaturasFiltradasPorSeccion[index] = this.asignaturasPorGrado[gradoId];
    } else {
      this.asignaturasFiltradasPorSeccion[index] = [];
      console.error("No se encontraron asignaturas para el grado con ID:", gradoId);
    }
    console.log(`Asignaturas filtradas para la sección ${index} (grado ${gradoId}):`, this.asignaturasFiltradasPorSeccion[index]);
  }
  
  
//selecciona el periodo de acuerdo al año actual
  private setDefaultPeriodo(): void {
    const añoActual = new Date().getFullYear().toString();
    const periodoEncontrado = this.periodoAcademico.find(periodo => periodo.peNombre.includes(añoActual));

    if (periodoEncontrado) {
      this.notasacademicasform.patchValue({
        selectPeriodo: periodoEncontrado.idperiodo, 
      });
      this.actualizarfiltrobimestre(periodoEncontrado.idperiodo);
    }
  }

  private actualizarfiltrobimestre(idPeriodo: number): void {
    this.filtrarBimestreAcademico = this.bimestreAcademico.filter(bimestre => bimestre.idperiodo === idPeriodo);
  }



  EnviarDatos(grado: number) {
    const selectedPeriodo = this.notasacademicasform.get('selectPeriodo')?.value;
    const selectedBimestre = this.notasacademicasform.get('selectBimestre')?.value;
    const selectedAsignatura = this.notasacademicasform.get('selectAsignatura')?.value;
  
    const selectedGrado = this.otherGradoAcademico[grado - 1];
    const gradoId = selectedGrado ? selectedGrado.id : null;
  

    if (!selectedPeriodo || !gradoId || !selectedBimestre || !selectedAsignatura) {
      Swal.fire('Error', 'Debe seleccionar todas las opciones antes de continuar.', 'error');
      return;
    }

    if (gradoId === null || gradoId === undefined) {
      console.error("El ID del grado seleccionado es inválido:", gradoId);
      return;
    }
  
    const asignaturasParaGrado = this.asignaturasFiltradasPorSeccion[grado - 1] || []; 
    if (asignaturasParaGrado.length === 0) {
      console.error("No hay asignaturas disponibles para el grado:", gradoId);
      return;
    }
  
    const bimestre = this.filtrarBimestreAcademico.find(
      (bimestre) => bimestre.idbimestre === selectedBimestre
    );

    const asignatura = asignaturasParaGrado.find(
      (asignatura) => asignatura.idasignatura === selectedAsignatura
    );
    
    if (!bimestre || !asignatura) {
      Swal.fire('Error', 'Datos incompletos o inválidos. Verifique las selecciones.', 'error');
      return;
    }
  
    console.log("Asignatura seleccionada:", asignatura);
    console.log("Datos seleccionados:");
    console.log("ID Periodo:", selectedPeriodo);
    console.log("ID Bimestre:", selectedBimestre);
    console.log("ID Grado:", gradoId);
    console.log("ID asignatura:", selectedAsignatura);
    console.log("Asignatura seleccionada:", asignatura);
  
    if (!selectedBimestre && !selectedAsignatura) {
      this.MostrarMensajeError('Seleccione un bimestre y una asignatura', 'Error');
    } else if (!selectedBimestre) {
      this.MostrarMensajeError('Seleccione un bimestre', 'Error');
    } else if (!selectedAsignatura) {
      this.MostrarMensajeError('Seleccione una asignatura', 'Error');
    } else {
    
  
    const formData = {
      selectPeriodo: selectedPeriodo,
      selectBimestre: selectedBimestre,
      bimestreNombre: bimestre?.biNombre || '',
      selectAsignatura: selectedAsignatura,
      asignaturaNombre: asignatura?.asigNombre || '',
      gradoId: gradoId,
      gradoNombre: selectedGrado?.nombre || '',
    };
  
    localStorage.setItem('formData', JSON.stringify(formData));
    this.route.navigate(['/registro-notas-academicas'], { state: { data: formData } });
    console.log(formData);
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