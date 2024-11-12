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

  constructor(
    private route: Router,
    private periodoAcademicoService: PeriodoAcademicoService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
    private unidadAcademicoService: UnidadAcademicoService,
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
    this.unidadAcademicoService.getUnidad().subscribe(
      (data: UnidadAcademicaDTO[]) => {
        this.unidadAcademica = data;
      },
      (error) => {
        console.error("Error al obtener las unidades académicas:", error);
      }
    );

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

  private setDefaultPeriodo(): void {
    const añoActual = new Date().getFullYear().toString();

    const periodoEncontrado = this.periodoAcademico.find(periodo => periodo.peNombre.includes(añoActual));

    if (periodoEncontrado) {
      this.notascomportamientoform.patchValue({
        selectPeriodo: periodoEncontrado.idperiodo,
      });
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
