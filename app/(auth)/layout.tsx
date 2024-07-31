import Image from "next/image";
import learningimage from "@/public/learningimage.jpg";
import logo from "@/public/learnquesttransparent.png";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-full">
        <div className="h-full w-2/3 relative">
          <Image
            src={learningimage}
            alt="Online Learning Image"
            className="w-full h-full z-10"
          ></Image>
          <Link href='/'>
          <Image
            src={logo}
            alt="LearnQuest Logo"
            className="absolute w-1/6 ml-6 z-30 top-8"
          ></Image>
          </Link>
        </div>
        <div className="h-full w-1/3">{children}</div>
      </div>
    </>
  );
}
