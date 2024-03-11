// jwt-payload.dto.ts
export class JwtPayload {
  _id: string;  // Subject, typically the user ID
  iat?: number; // Issued at
  exp?: number; // Expiration time
}
