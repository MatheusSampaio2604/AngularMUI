export interface JwtPayload {
  sub: string;
  jti: string;
  exp: number;
  iss: string;
  aud: string;
  level: string;
  name?: string;
  roles?: string[];
  token?: string;
  [key: string]: any; // Claims adicionais como os com URIs
}

export interface CleanJwtPayload {
  username: string;
  roles: string[];
  level: string;
  expiration: number;
}

