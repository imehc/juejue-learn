declare namespace globalThis {
  interface ErrorBody {
    code: number;
    type: string;
    message: string;
    details?: {
      field: string;
      messages: string[];
    }[];
  }
}
