"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { z } from "zod";

const MAX_AGE = 60 * 60 * 24 * 7;

export const signupaction = async (
  isInstructor: boolean,
  prevState: any,
  formdata: FormData
) => {
  const signupobject = z.object({
    first_name: z.string({ message: "First Name has to be characters only" }),
    last_name: z.string({ message: "Last Name has to be characters only" }),
    email: z.string().email({ message: "Enter valid email" }),
    is_instructor: z.boolean(),
    password: z
      .string()
      .min(5, { message: "Password needs to be longer than length 5" }),
  });

  const validatedFields = signupobject.safeParse({
    first_name: formdata.get("firstname")?.toString(),
    last_name: formdata.get("lastname")?.toString(),
    email: formdata.get("email")?.toString(),
    is_instructor: isInstructor,
    password: formdata.get("password")?.toString(),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }
  try {
    await fetch(`${process.env.BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }

  redirect("/login?signup=true");
};

export const loginaction = async (prevState: any, formdata: FormData) => {
  const loginobject = z.object({
    email: z.string().email({ message: "Enter valid email" }),
    password: z
      .string()
      .min(5, { message: "Password needs to be longer than length 5" }),
  });

  const validatedFields = loginobject.safeParse({
    email: formdata.get("email")?.toString(),
    password: formdata.get("password")?.toString(),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });
    const data = await response.json();
    if (data && data?.detail) {
      return {
        errors: {
          email: "",
          password: data.detail,
        },
      };
    }
    cookies().set("session", data?.access_token, {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
  redirect("/");
};

export const logoutaction = () => {
  cookies().delete("session");
  redirect("/");
};
