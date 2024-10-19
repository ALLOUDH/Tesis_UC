import { Component, EventEmitter, input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { OthersIntDTO } from '../../../dtos/other.dto';
import { AccesoService } from '../../../services/acceso.service';
import { SexoService } from '../../../services/sexo.service';
import { EstadoUsuarioService } from '../../../services/estado-usuario.service';
import { GradoAcademicoService } from '../../../services/grados.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListaAlumnosDTO } from '../../../dtos/lista-alumnos.dto';
import { AlumnosDTO } from '../../../dtos/alumnos.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-alumnos',
  templateUrl: './actualizar-alumnos.component.html',
  styleUrl: './actualizar-alumnos.component.css'
})
export class ActualizarAlumnosComponent {
  alumno!: ListaAlumnosDTO;
  alumnoActualizado = new EventEmitter<void>();
  actualizaralumnoform: FormGroup;
  otherSexo: OthersIntDTO[] = [];
  otherGradoAcademico: OthersIntDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];

  constructor(
    private ModalActualizarAlumno: BsModalRef,
    private accesoService: AccesoService,
    sexoUsuarioService: SexoService,
    estadoUsuarioService: EstadoUsuarioService,
    gradoAcademicoService: GradoAcademicoService,
  ) {
    this.otherSexo = sexoUsuarioService.ObtenerSexo();
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademico = gradoAcademicoService.ObtenerGradoAcademico();

    this.actualizaralumnoform = new FormGroup({
      inputDNI: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]), // Solo números
      inputApellidoPaterno: new FormControl('', Validators.required),
      inputPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]), // VALIDAR
      selectSexo: new FormControl('', Validators.required),
      selectEstadoUsuario: new FormControl('', Validators.required),
      selectGradoAcademico: new FormControl('', Validators.required),
      inputInstitucionProcedencia: new FormControl('', Validators.required),
      inputNombreAlumno: new FormControl('', Validators.required),
      inputApellidoMaterno: new FormControl('', Validators.required),
      inputConfirmPassword: new FormControl('', [Validators.required]),
      inputCodigoAlumno: new FormControl('', [Validators.required]),
      inputDireccionAlumno: new FormControl('', [Validators.required]),

      inputApellidoPaternoApoderado: new FormControl('', Validators.required),
      inputApellidoMaternoApoderado: new FormControl('', Validators.required),
      inputNombreApoderado: new FormControl('', Validators.required),
      inputOcupacionApoderado: new FormControl('', Validators.required),
      inputPensionApoderado: new FormControl('', [Validators.required, Validators.pattern(/^(?!0\d)\d{1,4}([.,]\d{1,2})?$|^(\d{1,4})$/)]),
      inputCelular: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]),
      inputEmail: new FormControl('', [Validators.required, Validators.email])
    }, { validators: [this.passwordMatchValidator, this.passwordMatchesDNI] });
  }

  ngOnInit(): void {
    if (this.alumno) {
      this.CargarDatosAlumno();
      console.log('Datos del alumno:', this.alumno);
    }
  }

  CargarDatosAlumno() {
    this.actualizaralumnoform.patchValue({
      inputDNI: this.alumno.usDni,
      inputApellidoPaterno: this.alumno.usApellidoPaterno,
      selectSexo: this.alumno.usSexo,
      selectEstadoUsuario: this.alumno.usEstado,
      selectGradoAcademico: this.alumno.idgrado,
      inputInstitucionProcedencia: this.alumno.alInstitucion,
      inputNombreAlumno: this.alumno.usNombre,
      inputApellidoMaterno: this.alumno.usApellidoMaterno,
      inputCodigoAlumno: this.alumno.alCodigoAlumno,
      inputDireccionAlumno: this.alumno.alDireccion,
      inputApellidoPaternoApoderado: this.alumno.alApellidoPaternoApoderado,
      inputApellidoMaternoApoderado: this.alumno.alApellidoMaternoApoderado,
      inputNombreApoderado: this.alumno.alNombreApoderado,
      inputOcupacionApoderado: this.alumno.alOcupacionApoderado,
      inputPensionApoderado: this.alumno.alPensionApoderado,
      inputCelular: this.alumno.usCelular,
      inputEmail: this.alumno.usEmail,
    });
  }

  ActualizarAlumno() {
    const alumnoActualizado: AlumnosDTO = {
      UsDni: this.actualizaralumnoform.get('inputDNI')?.value,
      UsContrasena: this.actualizaralumnoform.get('inputPassword')?.value || null, // Enviar null si no se quiere actualizar
      UsRol: "Estudiante",
      UsEmail: this.actualizaralumnoform.get('inputEmail')?.value,
      UsNombre: this.actualizaralumnoform.get('inputNombreAlumno')?.value,
      UsApellidoPaterno: this.actualizaralumnoform.get('inputApellidoPaterno')?.value,
      UsApellidoMaterno: this.actualizaralumnoform.get('inputApellidoMaterno')?.value,
      UsSexo: this.actualizaralumnoform.get('selectSexo')?.value,
      UsCelular: this.actualizaralumnoform.get('inputCelular')?.value,
      UsEstado: this.actualizaralumnoform.get('selectEstadoUsuario')?.value,
      AlInstitucion: this.actualizaralumnoform.get('inputInstitucionProcedencia')?.value,
      AlCodigoAlumno: this.actualizaralumnoform.get('inputCodigoAlumno')?.value,
      AlDireccion: this.actualizaralumnoform.get('inputDireccionAlumno')?.value,
      AlApellidoPaternoApoderado: this.actualizaralumnoform.get('inputApellidoPaternoApoderado')?.value,
      AlApellidoMaternoApoderado: this.actualizaralumnoform.get('inputApellidoMaternoApoderado')?.value,
      AlNombreApoderado: this.actualizaralumnoform.get('inputNombreApoderado')?.value,
      AlOcupacionApoderado: this.actualizaralumnoform.get('inputOcupacionApoderado')?.value,
      AlPensionApoderado: this.actualizaralumnoform.get('inputPensionApoderado')?.value,
      Idgrado: this.actualizaralumnoform.get('selectGradoAcademico')?.value,
  };

  console.log('Objeto a enviar:', alumnoActualizado); // Imprimir objeto para depuración

    this.accesoService.actualizarAlumno(this.alumno.idusuario, alumnoActualizado).subscribe(
      response => {
        // Manejar la respuesta exitosa
        this.alumnoActualizado.emit();
        this.ModalActualizarAlumno.hide();
        this.MostrarMensajeExito('Alumno actualizado', 'El alumno se actualizó correctamente');
        console.log('Alumno actualizado con éxito', response);
      },
      error => {
        // Manejar el error
        this.MostrarMensajeError('Hubo un error al actualizar el alumno', 'Error');
        console.error('Error al actualizar el alumno', error);
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
    return this.actualizaralumnoform.hasError('mismatch') && this.actualizaralumnoform.get('inputConfirmPassword')?.touched;
  }

  // Propiedad que permite obtener los controles del formulario de alumnos
  get Controls() {
    return this.actualizaralumnoform?.controls;
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
    this.ModalActualizarAlumno.hide();
  }
}
