import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUser } from '../login-user.model';
import { AuthService } from '../auth.service';
import { SnackBar } from '../../../shared/utils/snackBar';
import { NgIf } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    NgIf,
  ]
})


export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  userLogin: LoginUser;

  constructor(private _fb: FormBuilder, private _router: Router, private _userService: AuthService,
              private _snackBarUtils: SnackBar) {
    this.userLogin = {};

    this.loginForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async login(): Promise<void> {
    const { username, password } = this.loginForm.value;
    this.userLogin = { username: username, password: password };

    const response: boolean = await this._userService.loginAsync(this.userLogin);

    if (response) {
      this._router.navigate(['/home']);
    } else {
      this.errorMessage = 'Usuário ou senha inválidos';
      this._snackBarUtils.alertMessage('Usuário ou senha inválidos', ['error-snackbar']);
    }
  }
}
