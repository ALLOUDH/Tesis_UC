import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from '../../services/acceso.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  username: string | null = null;
  userRole: string | null = null;
  avatarText: string = '';
  avatarColors: { bgColor: string; textColor: string } = { bgColor: '', textColor: '' };

  constructor(
    private router: Router,
    private bsModalRecoverPass: BsModalRef,
    private modalService: BsModalService,
    private accesoService: AccesoService,
  ) {

  }

  ngOnInit(): void {
    this.UserNameRol();
    this.loadAvatarFromStorage();
  }

  CerrarSesion() {
    localStorage.removeItem('usertoken');
    localStorage.removeItem('avatarText');  // Limpia el avatar almacenado
    localStorage.removeItem('avatarColors');  // Limpia los colores del avatar
    this.router.navigate(['/login']);
  }

  UserNameRol() {
    if (this.accesoService.getUserName() && this.accesoService.getUserRole()) {
      const firstName = this.accesoService.getUserName() ?? '';
      const lastName = this.accesoService.getUserSurname() ?? '';
      this.username = `${firstName} ${lastName}`;
      this.userRole = this.accesoService.getUserRole();

      // Asignar la primera letra del nombre al avatar
      const firstInitial = firstName.charAt(0).toUpperCase();
      const lastInitial = lastName.charAt(0).toUpperCase();
      this.avatarText = `${firstInitial}${lastInitial}`.trim();

      if (!localStorage.getItem('avatarText') || !localStorage.getItem('avatarColors')) {
        this.avatarColors = this.generateRandomColor();
        this.saveAvatarToStorage(); // Guarda los datos generados
      }
    } else {
      this.username = "Usuario";
      this.userRole = "Rol";
      this.avatarText = "U"; // Predeterminado para usuarios no identificados
    }
  }

  // Cargar avatar desde localStorage
  loadAvatarFromStorage() {
    const savedAvatarText = localStorage.getItem('avatarText');
    const savedAvatarColors = localStorage.getItem('avatarColors');

    if (savedAvatarText && savedAvatarColors) {
      this.avatarText = savedAvatarText;
      this.avatarColors = JSON.parse(savedAvatarColors);
    }
  }

  // Generar colores de avatar aleatorios
  generateRandomColor() {
    const bgColor = this.getRandomHexColor();  // Generar un color aleatorio de fondo
    const textColor = this.getContrastingTextColor(bgColor);  // Generar color de texto contrastante
    return { bgColor, textColor };
  }

  // Función para generar un color hexadecimal aleatorio
  getRandomHexColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 es el valor máximo para un color hex
    return `#${randomColor.padStart(6, '0')}`;  // Asegura que el color siempre tenga 6 dígitos hexadecimales
  }

  // Función para obtener un color de texto contrastante con el color de fondo
  getContrastingTextColor(bgColor: string): string {
    const r = parseInt(bgColor.substring(1, 3), 16);
    const g = parseInt(bgColor.substring(3, 5), 16);
    const b = parseInt(bgColor.substring(5, 7), 16);

    // Fórmula de brillo percibido
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Ajustar luminosidad para generar el color contrastante
    const adjustmentFactor = brightness < 128 ? 1.5 : 0.5; // Hacer más claro si es oscuro, más oscuro si es claro
    const newColor = this.adjustLuminosity(bgColor, adjustmentFactor);

    return newColor;
  }

  // Ajustar luminosidad del color en base a un factor
  adjustLuminosity(color: string, factor: number): string {
    const r = Math.min(255, Math.max(0, Math.round(parseInt(color.substring(1, 3), 16) * factor)));
    const g = Math.min(255, Math.max(0, Math.round(parseInt(color.substring(3, 5), 16) * factor)));
    const b = Math.min(255, Math.max(0, Math.round(parseInt(color.substring(5, 7), 16) * factor)));

    return `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}`;
  }

  // Convertir número a formato hexadecimal de dos dígitos
  toHex(value: number): string {
    return value.toString(16).padStart(2, '0');
  }

  // Guardar el avatar generado en localStorage
  saveAvatarToStorage() {
    localStorage.setItem('avatarText', this.avatarText);
    localStorage.setItem('avatarColors', JSON.stringify(this.avatarColors));
  }

  MensajeInformacion() {
    Swal.fire({
      title: 'Esta funcionalidad esta en desarrollo',
      text: 'Pronto estara disponible',
      icon: 'info',
      timer: 2000, // Cierra automáticamente después de 3 segundos
      showConfirmButton: false, // Desactiva el botón de confirmación
      timerProgressBar: true // Muestra una barra de progreso
    });
  }
}
