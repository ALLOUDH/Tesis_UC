import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-registrodocente',
  templateUrl: './registrodocente.component.html',
  styleUrl: './registrodocente.component.css',
})
export class RegistrodocenteComponent {


  docenteForm: FormGroup;

  constructor() {
    // Inicialización del FormGroup con validaciones
    this.docenteForm = new FormGroup({
      inputDNI: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8),Validators.pattern('^[0-9]*$')]), // Solo números
      inputApellidoPaterno: new FormControl('', Validators.required),
      inputPassword: new FormControl('', [Validators.required,Validators.minLength(6),Validators.pattern('^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]), // Letras mayúsculas, minúsculas, números y caracteres especiales
      inputEmail: new FormControl('', [Validators.required, Validators.email]),
      inputCelular: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
      instprocedencia: new FormControl('', Validators.required),
      nombredocente: new FormControl('', Validators.required),
      apellidomaterno: new FormControl('', Validators.required),
      inputConfirmPassword: new FormControl('', [Validators.required]),
      especialidad: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator as ValidatorFn });
  }


   //Metodo para validación de que la contraseña ingresada es igual al de confirmar contraseña
passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const group = control as FormGroup;
  const password = group.get('inputPassword')?.value;
  const confirmPassword = group.get('inputConfirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
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
limpiarFormulario() {
  this.docenteForm.reset();
  }
}