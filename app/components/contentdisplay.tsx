import Player from "next-video/player";
import { CourseContentData } from "../util/types";

import { Button } from "@/components/ui/button";

import Link from "next/link";

import { ArrowLeftIcon } from "lucide-react";

import { getVideoSignedUrl } from "@/app/actions/courseactions";

type contentdisplayprops = {
  contentData: CourseContentData;
};
const ContentDisplay = async ({ contentData }: contentdisplayprops) => {
  const signedUrl:
    | {
        failure: {
          message: string;
        };
        success?: undefined;
      }
    | {
        success: {
          signedUrl: string;
        };
        failure?: undefined;
      }
    | undefined = await getVideoSignedUrl(contentData.content_data);

  return (
    <>
      <div className="flex flex-col w-[70%] h-[50%] mx-auto">
        <Link href={`/course/${contentData.course_uid}`}>
          <Button
            variant="link"
            className="flex items-center gap-2 text-sm font-medium text-[#0056D2] p-0"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Course
          </Button>
        </Link>
        <text className="text-xl font-sans font-semibold mb-2">
          {contentData.content_order}. {contentData.content_title}
        </text>
        <Player src={signedUrl?.success?.signedUrl} />
        <div className="mt-2">
          <h1 className="text-lg font-semibold">Description</h1>
          <p className="font-light">{contentData.content_description}</p>
        </div>
      </div>
    </>
  );
};

export default ContentDisplay;
