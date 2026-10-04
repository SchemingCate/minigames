export class networkError extends Error {
  constructor(message = 'Network error - check your internet connection') {
    super(message);
  }
}

export class serverError extends Error {
  constructor(
    public readonly errorNumber: number,
    message = `Server error ${errorNumber}`,
  ) {
    super(message);
  }
}
