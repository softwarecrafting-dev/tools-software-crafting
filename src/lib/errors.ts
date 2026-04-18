export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "EmailAlreadyExistsError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password.");
    this.name = "InvalidCredentialsError";
  }
}

export class TokenExpiredError extends Error {
  constructor() {
    super("The token has expired.");
    this.name = "TokenExpiredError";
  }
}

export class InvalidTokenError extends Error {
  constructor() {
    super("The token is invalid.");
    this.name = "InvalidTokenError";
  }
}
