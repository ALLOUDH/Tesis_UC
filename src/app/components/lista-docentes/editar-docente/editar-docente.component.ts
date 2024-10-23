import { Component , EventEmitter, input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { OthersIntDTO } from '../../../dtos/other.dto';
import { AccesoService } from '../../../services/acceso.service';
import { SexoService } from '../../../services/sexo.service';
import { EstadoUsuarioService } from '../../../services/estado-usuario.service';
import { ListaDocentesDTO } from '../../../dtos/lista-docentes.dto';
import { DocentesDTO } from '../../../dtos/docentes.dto';
import Swal from 'sweetalert2';
import { GradoAcademicoDocenteService } from '../../../services/grado-academico-docente.service';
import { AuxiliarService } from '../../../services/esauxiliar-docente.service';
import { ListaDocentesComponent } from '../lista-docentes.component';

@Component({
  selector: 'app-editar-docente',
  templateUrl: './editar-docente.component.html',
  styleUrl: './editar-docente.component.css'
})
export class EditarDocenteComponent {
  docentes!: ListaDocentesDTO;
  docenteActualizado = new EventEmitter<void>();
  actualizardocenteform: FormGroup;
  otherSexo: OthersIntDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];
  otherGradoAcademicoDocente: OthersIntDTO[] = [];
  otherAuxiliarDocente: OthersIntDTO[] = []

  

  constructor(
    private ModalEditarDocente: BsModalRef,
    private accesoService: AccesoService,
    sexoUsuarioService: SexoService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoDocenteService: GradoAcademicoDocenteService,
    auxiliardocenteService: AuxiliarService,

  ) { this.otherSexo = sexoUsuarioService.ObtenerSexo();
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademicoDocente = gradoAcademicoDocenteService.ObtenerGradoAcademicoDocente();
    this.otherAuxiliarDocente = auxiliardocenteService.ObtenerAuxiliarDocente();

    this.actualizardocenteform = new FormGroup({
      inputDNI: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8),Validators.pattern('^[0-9]*$')]), // Solo números
      inputApellidoPaterno: new FormControl('', Validators.required),
      inputPassword: new FormControl('', [Validators.required, Validators.minLength(8),Validators.maxLength(8), Validators.pattern('^[0-9]*$')]), // igual al DNI
      inputEmail: new FormControl('', [Validators.required, Validators.email]),
      inputCelular: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
      selectSexo: new FormControl('', Validators.required),
      selectEstadoUsuario: new FormControl('', Validators.required),
      selectGradoAcademicoDocente: new FormControl('', Validators.required),
      inputNombreDocente: new FormControl('', Validators.required),
      inputApellidoMaterno: new FormControl('', Validators.required),
      inputConfirmPassword: new FormControl('', [Validators.required]),
      inputEspecialidad: new FormControl('', [Validators.required]),
      selectAuxiliar: new FormControl('', Validators.required),
    }, { validators: [this.passwordMatchValidator, this.passwordMatchesDNI] });
  }

ngOnInit(): void {
    if (this.docentes) {
      this.CargarDatosDocente();
    }
  }

CargarDatosDocente() {
  
this.actualizardocenteform.patchValue( { 
  inputDNI: this.docentes.usDni,
  inputApellidoPaterno: this.docentes.usApellidoPaterno,
  selectSexo: this.docentes.usSexo,
  selectEstadoUsuario: this.docentes.usEstado,
  selectGradoAcademicoDocente: this.docentes.doGradoAcademico,
  inputNombreDocente: this.docentes.usNombre,
  inputApellidoMaterno: this.docentes.usApellidoMaterno,
  inputCelular: this.docentes.usCelular,
  inputEmail: this.docentes.usEmail,
  inputEspecialidad: this.docentes.doEspecialidad,
  selectAuxiliar: this.docentes.doEsAuxiliar,

    });
    

  }

  ActualizarDocente() {
    const docenteActualizado: DocentesDTO = {

      UsDni: this.actualizardocenteform.get('inputDNI')?.value,
      UsContrasena: this.actualizardocenteform.get('inputPassword')?.value || null, 
      UsRol: "Docente",
      UsEmail: this.actualizardocenteform.get('inputEmail')?.value,
      UsNombre: this.actualizardocenteform.get('inputNombreDocente')?.value,
      UsApellidoPaterno: this.actualizardocenteform.get('inputApellidoPaterno')?.value,
      UsApellidoMaterno: this.actualizardocenteform.get('inputApellidoMaterno')?.value,
      UsSexo: this.actualizardocenteform.get('selectSexo')?.value,
      UsCelular: this.actualizardocenteform.get('inputCelular')?.value,
      UsEstado: this.actualizardocenteform.get('selectEstadoUsuario')?.value,

      DoEsAuxiliar: this.actualizardocenteform.get('selectAuxiliar')?.value,
      DoEspecialidad: this.actualizardocenteform.get('inputEspecialidad')?.value,
      DoGradoAcademico: this.actualizardocenteform.get('selectGradoAcademicoDocente')?.value.toString(),
      
    };
    

    this.accesoService.actualizarDocente(this.docentes.idusuario, docenteActualizado).subscribe(
      response => {
        
        this.docenteActualizado.emit();
        this.ModalEditarDocente.hide();
        this.MostrarMensajeExito('Docente actualizado', 'El docente se actualizó correctamente');
        console.log('Docente actualizado con éxito', response);
      },
      error => {
        // Manejar el error
        this.MostrarMensajeError('Hubo un error al actualizar el docente', 'Error');
        console.error('Error al actualizar el docente', error);
        if (error.error && error.error.errors) {
          console.error('Detalles de los errores de validación:', error.error.errors);
        }
        this.MostrarMensajeError('Hubo un error al actualizar el docente', 'Error');
      }
    );
  }
   // Método para validar que la contraseña ingresada es igual a la de confirmar contraseña
   passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.get('inputPassword')?.value;
    const confirmPassword = group.get('inputConfirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }
  // Método para validar que la contraseña ingresada es igual al DNI
  passwordMatchesDNI: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const dni = group.get('inputDNI')?.value;
    const password = group.get('inputPassword')?.value;

    return password === dni ? null : { dniMismatch: true };
  }
  // Método para verificar si hay un error de coincidencia de contraseñas
  get passwordMismatch() {
    return this.actualizardocenteform.hasError('mismatch') && this.actualizardocenteform.get('inputConfirmPassword')?.touched;
  }

  // Propiedad que permite obtener los controles del formulario de alumnos
  get Controls() {
    return this.actualizardocenteform?.controls;
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

  CerrarModal() {
    this.ModalEditarDocente.hide();
  }

}

