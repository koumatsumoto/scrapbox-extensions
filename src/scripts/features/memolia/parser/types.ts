export type ParseResult<A> =
  | {
      valid: true;
      data: A;
    }
  | {
      valid: false;
      error: unknown;
    };
