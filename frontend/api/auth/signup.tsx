import axios from "axios";
import { signupSchema } from "@/schemas";
import { z } from "zod";
import { Response } from "@/types";

type Signup = z.infer<typeof signupSchema>;

export const signup = async (body: Signup) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;

  const res = await axios.post<Response>(api, body, {
    withCredentials: true,
  });

  return res;
};
