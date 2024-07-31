"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Loader } from "lucide-react";

import { loginaction } from "../actions/authaction";

import { useFormState, useFormStatus } from "react-dom";


const Submitbutton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      <Button type="submit" className="w-[70%] mt-3" disabled={pending}>
        {pending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </>
  );
};

const Loginform = () => {
  const [state, formAction] = useFormState(loginaction, null);

  return (
    <>
      <form
        action={formAction}
        className="flex flex-col gap-5 h-full justify-start items-center pt-6"
      >
        <div className="w-[70%]">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className=" placeholder:text-slate-400"
          ></Input>
          {state?.errors?.email && (
            <div className="text-red-500 text-xs mt-1">
              {state?.errors?.email}
            </div>
          )}
        </div>
        <div className="w-[70%]">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className=" placeholder:text-slate-400"
          ></Input>
          {state?.errors?.password && (
            <div className="text-red-500 text-xs mt-1">
              {state?.errors?.password}
            </div>
          )}
        </div>
        <Submitbutton />
      </form>
    </>
  );
};

export default Loginform;
