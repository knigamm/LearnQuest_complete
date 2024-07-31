"use client";

import { CourseContentData } from "../util/types";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { useParams } from "next/navigation";

import { VideoIcon, FileIcon } from "lucide-react";

type sidebarprops = {
  contentData: CourseContentData[];
};

const ContentSideBar = ({ contentData }: sidebarprops) => {
  const { contentId } = useParams();
  return (
    <>
      <section className="h-screen w-[20%] bg-gray-100 overflow-x-scroll">
        {contentData.map((content) => {
          return (
            <Link
              href={`${content.content_uid}`}
              key={content.content_uid}
              className={cn(
                "w-full h-16 flex gap-1 flex-col justify-center items-start py-9 p-5 text-[#36394D] text-[16px] font-sans hover:bg-gray-200",
                contentId === content.content_uid ? "bg-gray-200" : ""
              )}
            >
              <div>{content.content_title}</div>
              <div className="flex gap-4 items-center">
                {content.content_type === "video" ? (
                  <VideoIcon className="w-5 h-5" />
                ) : (
                  <FileIcon className="w-5 h-5" />
                )}
                {content.content_type === "video" ? (
                  <span className="text-[12px]">VIDEO</span>
                ) : (
                  <span className="text-[12px]">TEXT</span>
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
};

export default ContentSideBar;
