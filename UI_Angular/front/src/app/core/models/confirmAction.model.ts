import { User } from "./user.model";

export interface ConfirmAction {
  message: string;
  action: () => Promise<void>;
}

export interface ConfirmUserAction {
  data: User;
  action: () => Promise<void>;
}

