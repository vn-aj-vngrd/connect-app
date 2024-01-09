export type Error = {
  code?: string;
  description?: string;
  message?: string;
};

export type Response<T = undefined> = {
  id?: number;
  data?: T | null;
  message?: string | null;
  errors?: Error[] | null;
};
