import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  exibirLayout: Boolean = false;

  constructor(private _router: Router) { }

  ngOnInit() {
    this._router.events.subscribe(() => {
      this.exibirLayout = this._router.url !== '/login' && this._router.url !== '/register';
    });   
  }
}
