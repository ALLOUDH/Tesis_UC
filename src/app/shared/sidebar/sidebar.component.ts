import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  constructor(
    private router: Router,
    private bsModalRecoverPass: BsModalRef,
    private modalService: BsModalService,
  ) {

  }


RegistrarAlumno() {
  this.router.navigate(['/registroalumno']);
}

RegistrarDocente() {
  this.router.navigate(['/registrodocente']);
  }

RegistrarPadre() {
  this.router.navigate(['/registropadre']);
  }
}
