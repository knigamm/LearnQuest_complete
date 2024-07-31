import { Button } from "@/components/ui/button";

import Signupform from "@/app/components/signupform";

import Link from "next/link";

const Signup = () => {
  return (
    <>
      <div className="flex flex-col h-full w-full bg-slate-50">
        <div className="flex h-min w-full justify-end items-center gap-3 pr-6 pt-4">
          <text className="text-[14px] font-medium">Do have an account?</text>
          <Button variant="link" asChild className="p-0">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
        <div className="flex h-full w-full justify-center items-end">
          <div className="flex flex-col gap-4 h-min justify-end items-start w-[70%] text-nowrap">
            <text className="font-semibold text-2xl">REGISTER NOW</text>
            <text className="font-semibold text-3xl">WELCOME TO LEARNQUEST</text>
          </div>
        </div>
        <Signupform/>
      </div>
    </>
  );
};

export default Signup;
