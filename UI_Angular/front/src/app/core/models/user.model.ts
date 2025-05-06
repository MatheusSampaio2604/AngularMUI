export interface User {
  name: string;
  level: number;
  password?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  userGroups: string[];
}
