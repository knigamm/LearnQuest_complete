"use client";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Loginform from "@/app/components/loginform";

import Link from "next/link";

const Login = () => {
  const params = useSearchParams();
  const isFromSignup = params?.get("signup");
  return (
    <>
      <div className="flex flex-col h-full w-full bg-slate-50">
        <div className="flex h-min w-full justify-end items-center gap-3 pr-6 pt-4">
          <text className="text-[14px] font-medium">
            Don&apos;t have an account?
          </text>
          <Button variant="link" asChild className="p-0">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        <div className="flex h-full w-full justify-center items-end">
          {isFromSignup === "true" ? (
            <Alert className="border-green w-[70%]">
              <AlertTitle className="text-green-400">
                Signup Complete!
              </AlertTitle>
              <AlertDescription>
                Login with your credentials to proceed.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-col gap-4 h-min justify-end items-start w-[70%] text-nowrap">
              <text className="font-semibold text-3xl">Hi, Welcome Back!</text>
            </div>
          )}
        </div>
        <Loginform />
      </div>
    </>
  );
};

export default Login;
