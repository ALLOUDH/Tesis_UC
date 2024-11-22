import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OthersIntDTO } from '../../dtos/other.dto';
import { BimestreAcademicoService } from '../../services/bimestre-academico.service';
import { EstadoUsuarioService } from '../../services/estado-usuario.service';
import { GradoAcademicoService } from '../../services/grados.service';
import { PeriodoAcademicoService } from '../../services/periodo-academico.service';
import { BimestreAcademicoDTO } from '../../dtos/bimestreacademico.dto';
import { PeriodoAcademicoDTO } from '../../dtos/periodoacademico.dto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CategorianotasService } from '../../services/categorianotas.service';

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

  bimestresFiltrados: BimestreAcademicoDTO[] = [];

  constructor(
    private route: Router,
    private bimestreAcademicoService: BimestreAcademicoService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
    private periodoAcademicoService: PeriodoAcademicoService,
    private categorianotasService: CategorianotasService,
  ) {
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();
    this.adminnotaspadre = new FormGroup({
      selectPeriodo: new FormControl(''),
      selectBimestre: new FormControl('', Validators.required),
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
    this.suscribirCambioPeriodo();
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
      this.filtrarBimestres(periodoEncontrado.idperiodo);
    }
  }

  private filtrarBimestres(idPeriodo: number): void {
    this.bimestresFiltrados = this.bimestreAcademico.filter(bimestre => bimestre.idperiodo === idPeriodo);
    if (this.bimestresFiltrados.length === 0) {
      console.warn(`No se encontraron bimestres para el periodo con ID: ${idPeriodo}`);
    }
  }

  private suscribirCambioPeriodo(): void {
    this.adminnotaspadre.get('selectPeriodo')?.valueChanges.subscribe((idPeriodo: number) => {
      if (idPeriodo) {
        this.filtrarBimestres(idPeriodo);
      } else {
        this.bimestresFiltrados = [];
      }
    });
  }

  EnviarDatos(grado: number) {
    const nombreCategoria = 'Notas de padres'; // El nombre de la categoría que deseas buscar

    // Obtener el ID de la categoría con el nombre especificado
    this.categorianotasService.getCategorias().subscribe((categorias) => {
      const categoriaComportamiento = categorias.find(categoria => categoria.catNombre === nombreCategoria);

      if (categoriaComportamiento) {
        // Solo después de encontrar la categoría, procede con la construcción de formData
        const categoriaId = categoriaComportamiento.idcategoriaNotas;

        // Obtener datos del formulario
        const selectedPeriodo = this.adminnotaspadre.get('selectPeriodo')?.value;
        const selectedBimestre = this.adminnotaspadre.get('selectBimestre')?.value;

        // Obtener el grado específico basado en el parámetro 'grado'
        const selectedGrado = this.otherGradoAcademico[grado - 1];
        const gradoId = selectedGrado ? selectedGrado.id : null;

        if (selectedBimestre.length === 0) {
          this.MostrarMensajeError('Seleccione un bimestre', 'Error');
        } else {
          // Crear el formData solo después de obtener todos los datos necesarios
          const formData = {
            categoriaId: categoriaId, // Ahora debería incluirse correctamente
            selectPeriodo: selectedPeriodo,
            selectBimestre: selectedBimestre,
            gradoId: gradoId
          };

          // Guardar formData en localStorage
          localStorage.setItem('formData', JSON.stringify(formData));
          // Navegar a la ruta y enviar los datos
          this.route.navigate(['/registro-notas-padre'], { state: { data: formData } });
          console.log(formData); // Para verificar en la consola
        }
      } else {
        this.MostrarMensajeError('Categoría no encontrada', 'Error');
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
