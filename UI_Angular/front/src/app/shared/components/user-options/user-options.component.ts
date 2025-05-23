import { Component } from "@angular/core";
import { User } from "../../../core/models/user.model"
import { AuthService } from "../../../core/auth/auth.service"
import { empty } from "rxjs";

@Component({
  selector: 'app-user-options',
  standalone: false,
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.css'
})
export class UserOptionsComponent {
  user : User
  constructor(private _authService: AuthService) {
    this.user = this.getData()
  }
  getData(): User {
    var {FirstName,LastName,level,name,roles} = this._authService.userData()
    this.user = new User;
    // this.user.firstName == null ? "Not Defined" : FirstName;
    // this.user.firstName = this.user.firstName === undefined ? "Empty" : FirstName
    this.user.firstName = FirstName == undefined ? "Not defined" : FirstName
    this.user.lastName = LastName == undefined ? "Not defined" : LastName
    this.user.level = level;
    this.user.name = name;
    this.user.userGroups = roles;

    return this.user;
    }
  }