import axios from "axios";
import { loginSchema } from "@/schemas";
import { z } from "zod";
import { Response } from "@/types";

type Login = z.infer<typeof loginSchema>;

export const login = async (body: Login) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

  const res = await axios.post<Response>(api, body, {
    withCredentials: true,
  });

  return res;
};
