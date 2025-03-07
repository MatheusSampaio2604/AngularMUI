import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginUser } from '../login-user.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  userRegister: LoginUser;

  constructor(private fb: FormBuilder, private router: Router, private userService: AuthService) {
    this.userRegister = {};

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async register(): Promise<void> {
    const { username, password } = this.registerForm.value;
    this.userRegister = { username: username, password: password };

    const response: boolean = await this.userService.registerAsync(this.userRegister);

    if (response) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Usuário ou senha inválidos';
    }

  }
}
