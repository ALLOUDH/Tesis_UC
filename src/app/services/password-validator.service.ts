import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class PasswordValidatorService {
  validatePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value || '';
    const hasNumber = /[0-9]/.test(password); // Verifica si tiene al menos un número
    const hasLetter = /[a-zA-Z]/.test(password); // Verifica si tiene al menos una letra
    const isValid = hasNumber && hasLetter;

    return isValid ? null : { passwordInvalid: true }; // Retorna el error si no cumple
  }
}