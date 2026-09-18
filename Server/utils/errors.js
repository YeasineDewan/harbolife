

export class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

export class UnAuthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

export class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}
export class ValidationError extends Error {
  constructor(message = "Validation Error") {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 422;
  }
}

export class TooManyRequestsError extends Error {
  constructor(message = "Too Many Requests") {
    super(message);
    this.name = "TooManyRequestsError";
    this.statusCode = 429;
  }
}

export class TokenExpiredError extends Error {
  constructor(message = "Token Expired") {
    super(message);
    this.name = "TokenExpiredError";
    this.statusCode = 401;
  }
}

export class InvalidTokenError extends Error {
  constructor(message = "Invalid Token") {
    super(message);
    this.name = "InvalidTokenError";
    this.statusCode = 401;
  }
}


export class OutOfStockError extends Error {
  constructor(message = "Product Out Of Stock") {
    super(message);
    this.name = "OutOfStockError";
    this.statusCode = 400;
  }
}

export class PrescriptionRequiredError extends Error {
  constructor(message = "Prescription Required") {
    super(message);
    this.name = "PrescriptionRequiredError";
    this.statusCode = 403;
  }
}

export class ExpiredProductError extends Error {
  constructor(message = "Product Is Expired") {
    super(message);
    this.name = "ExpiredProductError";
    this.statusCode = 400;
  }
}

export class OrderNotCancellableError extends Error {
  constructor(message = "Order Cannot Be Cancelled") {
    super(message);
    this.name = "OrderNotCancellableError";
    this.statusCode = 400;
  }
}


export class ServiceUnavailableError extends Error {
  constructor(message = "Service Unavailable") {
    super(message);
    this.name = "ServiceUnavailableError";
    this.statusCode = 503;
  }
}

export class PaymentFailedError extends Error {
  constructor(message = "Payment Failed") {
    super(message);
    this.name = "PaymentFailedError";
    this.statusCode = 402;
  }
}