import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SexoService } from '../../services/sexo.service';
import { OthersDTO, OthersIntDTO } from '../../dtos/other.dto';
import { EstadoUsuarioService } from '../../services/estado-usuario.service';
import { DocentesDTO } from '../../dtos/docentes.dto';
import { UserRoleService } from '../../services/user-role.service';
import Swal from 'sweetalert2';
import { AccesoService } from '../../services/acceso.service';
import { GradoAcademicoDocenteService } from '../../services/grado-academico-docente.service';
import { AuxiliarService } from '../../services/esauxiliar-docente.service';


@Component({
  selector: 'app-registrodocente',
  templateUrl: './registrodocente.component.html',
  styleUrl: './registrodocente.component.css',
})
export class RegistrodocenteComponent {
  docenteForm: FormGroup;
  otherSexo: OthersIntDTO[] = [];
  otherEstadoUsuario: OthersIntDTO[] = [];
  otherAuxiliarDocente: OthersIntDTO[] = [];
  otherGradoAcademicoDocente: OthersIntDTO[] = [];
  otherUserRole: OthersDTO[] = [];
  UserRole: any;

  

  constructor(
    private AccesoService: AccesoService,
    sexoUsuarioService: SexoService,
    estadoUsuarioService: EstadoUsuarioService,
    userRoleService: UserRoleService,
    auxiliardocenteService: AuxiliarService,
    gradoAcademicoDocenteService: GradoAcademicoDocenteService,

  ) {
    this.UserRole = userRoleService.ObtenerUserRole();
    this.otherSexo = sexoUsuarioService.ObtenerSexo();
    this.otherEstadoUsuario = estadoUsuarioService.ObtenerEstadoUsuario();
    this.otherGradoAcademicoDocente = gradoAcademicoDocenteService.ObtenerGradoAcademicoDocente();
    this.otherAuxiliarDocente = auxiliardocenteService.ObtenerAuxiliarDocente();
    
    // Inicialización del FormGroup con validaciones
    this.docenteForm = new FormGroup({
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


   //Metodo para validación de que la contraseña ingresada es igual al de confirmar contraseña
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
  return this.docenteForm.hasError('mismatch') && this.docenteForm.get('inputConfirmPassword')?.touched;
}

  // Propiedad que permite obtener los controles del formulario de alumnos
get Controls() {
  return this.docenteForm?.controls;
}

//Funcion para limpiar datos del form
LimpiarFormulario() {
  this.docenteForm.reset();
  }

AsignarDocente(docente: DocentesDTO) {
    this.AsignarValoresAControles(docente);
  }


AsignarValoresAControles(docente: DocentesDTO) {
    const rolDocente = this.UserRole.find((rol: any) => rol.id === 'Docente');

    this.docenteForm.get('UsRol')?.setValue(rolDocente.id);

    this.docenteForm.get('inputDNI')?.setValue(docente.UsDni);
    this.docenteForm.get('inputApellidoPaterno')?.setValue(docente.UsApellidoPaterno);
    this.docenteForm.get('inputPassword')?.setValue(docente.UsContrasena);
    this.docenteForm.get('inputEmail')?.setValue(docente.UsEmail);
    this.docenteForm.get('selectSexo')?.setValue(docente.UsSexo);
    this.docenteForm.get('inputCelular')?.setValue(docente.UsCelular);
    this.docenteForm.get('inputNombreDocente')?.setValue(docente.UsNombre);
    this.docenteForm.get('inputApellidoMaterno')?.setValue(docente.UsApellidoMaterno);
    this.docenteForm.get('selectEstadoUsuario')?.setValue(docente.UsEstado);

    this.docenteForm.get('inputEspecialidad')?.setValue(docente.DoEspecialidad);
    this.docenteForm.get('selectGradoAcademicoDocente')?.setValue(docente.DoGradoAcademico);

    this.docenteForm.get('selectAuxiliar')?.setValue(docente.DoEsAuxiliar);
  }

  RegistrarDocente() {
    for (let i in this.docenteForm.controls) {
        this.docenteForm.controls[i].markAsTouched();
    }
    if (this.docenteForm.valid) {
        let docente= new DocentesDTO();
        const rolDocente = this.UserRole.find((rol: any) => rol.id === 'Docente');
        docente.UsRol = rolDocente ? rolDocente.id : null; // Manejo de rol

        docente.UsDni = this.docenteForm.controls['inputDNI'].value;
        docente.UsApellidoPaterno = this.docenteForm.controls['inputApellidoPaterno'].value;
        docente.UsContrasena = this.docenteForm.controls['inputPassword'].value;
        docente.UsEmail = this.docenteForm.controls['inputEmail'].value;
        docente.UsSexo = this.docenteForm.controls['selectSexo'].value;
        docente.UsEstado = this.docenteForm.controls['selectEstadoUsuario'].value;

        // Para obtener el nombre en lugar del id, ya que (no tenemos una tabla especifica de grado academico) asi como de grado de los alumnos
        const selectedGradoAcademico = this.otherGradoAcademicoDocente.find(g => g.id === this.docenteForm.controls['selectGradoAcademicoDocente'].value);
        docente.DoGradoAcademico = selectedGradoAcademico ? selectedGradoAcademico.nombre : ""; // Asignar el nombre correspondiente al id y jale ese valor

        docente.UsCelular = this.docenteForm.controls['inputCelular'].value;
        docente.UsNombre = this.docenteForm.controls['inputNombreDocente'].value;
        docente.UsApellidoMaterno = this.docenteForm.controls['inputApellidoMaterno'].value;
        docente.DoEspecialidad = this.docenteForm.controls['inputEspecialidad'].value;

        docente.DoEsAuxiliar = this.docenteForm.controls['selectAuxiliar'].value;
        
        console.log(docente);
        this.AccesoService.registrarDocente(docente).subscribe(
            (response: any) => {
                if (response.isSuccess) {
                    this.MostrarMensajeExito("Registro exitoso", "El docente ha sido registrado correctamente");
                    this.LimpiarFormulario();
                } else {
                    this.MostrarMensajeError("Registro Fallido", "Oops! Algo salió mal");
                }
            },
            (error) => {
                console.error('Error en el servidor:', error);
                this.MostrarMensajeError('El Docente ingresado ya existe', 'Error');
            }
        );
    } else {
        this.MostrarMensajeError("Por favor, complete los campos obligatorios", "Oops! Algo salió mal");
    }
}
MostrarMensajeExito(titulo: string, mensaje: string) {
  Swal.fire({
    title: titulo,
    html: mensaje,
    icon: 'success',
    showConfirmButton: false,
    timer: 1800,
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
