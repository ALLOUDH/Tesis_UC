import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OthersIntDTO } from '../../dtos/other.dto';
import { BimestreAcademicoService } from '../../services/bimestre-academico.service';
import { EstadoUsuarioService } from '../../services/estado-usuario.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';
import { BimestreAcademicoDTO } from '../../dtos/bimestreacademico.dto';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administracion-notas-padre',
  templateUrl: './administracion-notas-padre.component.html',
  styleUrl: './administracion-notas-padre.component.css'
})
export class AdministracionNotasPadreComponent {
  adminnotaspadre: FormGroup;
  otherGradoAcademico: OthersIntDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];
  bimestreAcademico: BimestreAcademicoDTO[] = [];
  periodoAcademico: PeriodoAcademicoDTO[] = [];

  constructor(
    private route: Router,
    private bimestreAcademicoService: BimestreAcademicoService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
    private periodoAcademicoService: PeriodoAcademicoService,
  ) {
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.adminnotaspadre = new FormGroup({
      selectPeriodo: new FormControl(''),
      selectBimestre: new FormControl(''),
    });

    for (let i = 0; i < this.otherGradoAcademico.length; i++) {
      this.adminnotaspadre.addControl(`inputGrado${i + 1}`, new FormControl(this.otherGradoAcademico[i].nombre));
    }
  }

  ngOnInit(): void {
    this.bimestreAcademicoService.getBimestre().subscribe(
      (data: BimestreAcademicoDTO[]) => {
        this.bimestreAcademico = data;
      },
      (error) => {
        console.error("Error al obtener los bimestres:", error);
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
    const añoActual = new Date().getFullYear().toString(); // Obtener el año actual como string

    // Buscar el periodo que coincide con el año actual
    const periodoEncontrado = this.periodoAcademico.find(periodo => periodo.peNombre.includes(añoActual));

    // Si se encuentra un periodo que coincide, establecerlo en el formulario
    if (periodoEncontrado) {
      this.adminnotaspadre.patchValue({
        selectPeriodo: periodoEncontrado.idperiodo, // O puedes usar periodoEncontrado.peNombre según lo que necesites
      });
    }
  }

  EnviarDatos(grado: number) {
    // Obtener datos del formulario
    const selectedPeriodo = this.adminnotaspadre.get('selectPeriodo')?.value;
    const selectedBimestre = this.adminnotaspadre.get('selectBimestre')?.value;

    // Obtener el grado específico basado en el parámetro 'grado'
    // Obtener el ID del grado específico basado en el parámetro 'grado'
    const selectedGrado = this.otherGradoAcademico[grado - 1]; // Accediendo al DTO
    const gradoId = selectedGrado ? selectedGrado.id : null; // Obtener el ID del grado

    const formData = {
      selectPeriodo: selectedPeriodo,
      selectBimestre: selectedBimestre,
      gradoId: gradoId // Solo el grado que deseas enviar
    };

    localStorage.setItem('formData', JSON.stringify(formData));
    // Navegar a la ruta y enviar los datos
    this.route.navigate(['/registro-notas-padre'], { state: { data: formData } });
    console.log(formData); // Para verificar en la consola
  }
}
