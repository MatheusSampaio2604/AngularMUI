export class LoginUser {
  //username?: string;
  //email?: string;
  //profiles?: string[];

  username?: string;
  password?: string;
}

//export class ReponseUser {
//  username?: string;
//  email?: string;
//  profiles?: string[];
//  token?: string;
//  expiration?: number;
//}

export class RegisterUser {
    Name: string;
    Password: string;
    UserGroups: string[] = ["Operator"];
    Enabled: boolean = true;

  constructor (name:string, password:string){
    this.Name = name;
    this.Password = password;
  }

}