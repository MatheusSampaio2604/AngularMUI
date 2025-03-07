import { Component } from '@angular/core';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-manager',
  standalone: false,
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent {
  users: User[] = [
    { name: 'Admin 1', email: 'admin1@email.com', role: 'Administrator' },
    { name: 'User 1', email: 'user1@email.com', role: 'User' },
    { name: 'Admin 2', email: 'admin2@email.com', role: 'Administrator' },
    { name: 'User 2', email: 'user2@email.com', role: 'User' }
  ];

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  editUser(user: User) {
    console.log('Editar usuário:', user);
  }

  addUser() {
    console.log('Adicionar novo usuário');
  }
}
