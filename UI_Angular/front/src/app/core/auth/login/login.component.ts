import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUser } from '../login-user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  userLogin: LoginUser;

  constructor(private fb: FormBuilder, private router: Router, private userService: AuthService) {
    this.userLogin = {};

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login(): Promise<void> {
    const { username, password } = this.loginForm.value;
    this.userLogin = { username: username, password: password };

    const response: boolean = await this.userService.loginAsync(this.userLogin);

    if (response) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Usuário ou senha inválidos';
    }

  }
}
