import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private bsModalRecoverPass: BsModalRef,
    private modalService: BsModalService,
  ) {

  }
  CerrarSesion() {
    localStorage.removeItem('usertoken');
    this.router.navigate(['/login']);
  }
}
