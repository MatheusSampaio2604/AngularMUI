import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  exibirLayout = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.exibirLayout = this.router.url !== '/login' && this.router.url !== '/register';
    });
  }
}
