import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from '../../services/acceso.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  username: string | null = null;
  userRole: string | null = null;
  constructor(
    private router: Router,
    private bsModalRecoverPass: BsModalRef,
    private modalService: BsModalService,
    private accesoService: AccesoService,
  ) {

  }

  ngOnInit(): void {
    this.UserNameRol();
  }

  CerrarSesion() {
    localStorage.removeItem('usertoken');
    this.router.navigate(['/login']);
  }

  UserNameRol() {
    if ((this.accesoService.getUserName() === null) || (this.accesoService.getUserRole() === null)) {
      this.username = "Usuario";
      this.userRole = "Rol";
      console.log("No se encontraron los datos del usuario");
    }else {
      this.username = this.accesoService.getUserName()+" "+this.accesoService.getUserSurname();
      this.userRole = this.accesoService.getUserRole();
    }
  }
}
