import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OthersIntDTO } from '../../dtos/other.dto';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';
import { EstadoUsuarioService } from '../../services/estado-usuario.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { UnidadAcademicoService } from '../../services/unidad-academico.service';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';
import { UnidadAcademicaDTO } from '../../dtos/unidadacademica.dto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BimestreAcademicoDTO } from '../../dtos/bimestreacademico.dto';
import { BimestreAcademicoService } from '../../services/bimestre-academico.service';

@Component({
  selector: 'app-administracion-notas-conducta',
  templateUrl: './administracion-notas-conducta.component.html',
  styleUrls: ['./administracion-notas-conducta.component.css']
})
export class AdministracionNotasConductaComponent {
  notascomportamientoform: FormGroup;
  otherGradoAcademico: OthersIntDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];
  unidadAcademica: UnidadAcademicaDTO[] = [];
  periodoAcademico: PeriodoAcademicoDTO[] = [];
  unidadesFiltradas: UnidadAcademicaDTO[] = [];
  bimestreAcademico: BimestreAcademicoDTO[] = [];
  isDataLoaded = { periodos: false, bimestres: false, unidades: false };

  constructor(
    private route: Router,
    private periodoAcademicoService: PeriodoAcademicoService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
    private unidadAcademicoService: UnidadAcademicoService,
    private bimestreAcademicoService: BimestreAcademicoService
  ) {
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.notascomportamientoform = new FormGroup({
      selectPeriodo: new FormControl(''),
      selectUnidad: new FormControl('', Validators.required),
    });

    for (let i = 0; i < this.otherGradoAcademico.length; i++) {
      this.notascomportamientoform.addControl(`inputGrado${i + 1}`, new FormControl(this.otherGradoAcademico[i].nombre));
    }
  }

  ngOnInit(): void {
    this.cargarDatos();
  }
    // Cargar Unidades
    private cargarDatos(): void {
      // Cargar periodos
      this.periodoAcademicoService.getPeriodo().subscribe(
        (data: PeriodoAcademicoDTO[]) => {
          this.periodoAcademico = data;
          this.isDataLoaded.periodos = true;
          this.verificarCargaCompleta();
        },
        (error) => console.error('Error al cargar periodos:', error)
      );
  
      // Cargar bimestres
      this.bimestreAcademicoService.getBimestre().subscribe(
        (data: BimestreAcademicoDTO[]) => {
          this.bimestreAcademico = data;
          this.isDataLoaded.bimestres = true;
          this.verificarCargaCompleta();
        },
        (error) => console.error('Error al cargar bimestres:', error)
      );
  
      // Cargar unidades
      this.unidadAcademicoService.getUnidad().subscribe(
        (data: UnidadAcademicaDTO[]) => {
          this.unidadAcademica = data;
          this.isDataLoaded.unidades = true;
          this.verificarCargaCompleta();
        },
        (error) => console.error('Error al cargar unidades:', error)
      );
  
      // Suscribir a los cambios en el periodo
      this.notascomportamientoform.get('selectPeriodo')?.valueChanges.subscribe((selectedPeriodoId) => {
        if (selectedPeriodoId) {
          this.filtrarUnidades(selectedPeriodoId);
        } else {
          this.unidadesFiltradas = [];
        }
      });
    }

    private verificarCargaCompleta(): void {
      if (this.isDataLoaded.periodos && this.isDataLoaded.bimestres && this.isDataLoaded.unidades) {
        this.setDefaultPeriodo();
      }
    }

  

    private setDefaultPeriodo(): void {
      const añoActual = new Date().getFullYear().toString();
      const periodoEncontrado = this.periodoAcademico.find((periodo) => periodo.peNombre.includes(añoActual));
  
      if (periodoEncontrado) {
        this.notascomportamientoform.patchValue({ selectPeriodo: periodoEncontrado.idperiodo });
        this.filtrarUnidades(periodoEncontrado.idperiodo);
      } else {
        console.warn('No se encontró un periodo para el año actual.');
      }
    }

  private filtrarUnidades(idPeriodo: number): void {
    console.log('Filtrando unidades para idPeriodo:', idPeriodo);
  
    // Busca todos los bimestres asociados al periodo seleccionado
    const bimestresDelPeriodo = this.bimestreAcademico.filter((bimestre) => bimestre.idperiodo === idPeriodo);
    console.log('Bimestres encontrados para el periodo:', bimestresDelPeriodo);
  
    if (bimestresDelPeriodo.length === 0) {
      console.warn(`No se encontraron bimestres para el periodo con ID: ${idPeriodo}`);
      this.unidadesFiltradas = [];
      return;
    }
  
    const idsBimestres = bimestresDelPeriodo.map((bimestre) => bimestre.idbimestre);
  
    // Filtra las unidades que pertenecen a esos bimestres
    this.unidadesFiltradas = this.unidadAcademica.filter((unidad) => idsBimestres.includes(unidad.idbimestre));
    console.log('Unidades filtradas:', this.unidadesFiltradas);
  
    if (this.unidadesFiltradas.length === 0) {
      console.warn(`No se encontraron unidades para los bimestres: ${idsBimestres}`);
    }
  }
  

  EnviarDatos(grado: number) {
    const selectedPeriodo = this.notascomportamientoform.get('selectPeriodo')?.value;
    const selectedUnidad = this.notascomportamientoform.get('selectUnidad')?.value;

    const selectedGrado = this.otherGradoAcademico[grado - 1];
    const gradoId = selectedGrado ? selectedGrado.id : null;

    if (!selectedUnidad) {
      this.MostrarMensajeError('Seleccione una unidad académica', 'Error');
    } else {
      const formData = {
        selectPeriodo: selectedPeriodo,
        selectUnidad: selectedUnidad,
        gradoId: gradoId
      };

      localStorage.setItem('formData', JSON.stringify(formData));
      this.route.navigate(['/registro-notas-conducta'], { state: { data: formData } });
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
