export interface User {
  name: string;
  level: number;
  password?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  userGroups: string[];
}

export class User {
  name: string = '';
  level: number = 0;
  password?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean = true;
  userGroups: string[] = [];
}
