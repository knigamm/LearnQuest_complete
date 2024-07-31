import { logoutaction } from "@/app/actions/authaction";

import ContentDisplay from "@/app/components/contentdisplay";
import CourseDisplaySkeleton from "@/app/components/coursedisplayskeleton";

import getSession from "@/app/util/getsession";
import { CourseContentData } from "@/app/util/types";

import { Suspense } from "react";

const getContent = async (contentId: string) => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }
    const res = await fetch(
      `${process.env.BASE_URL}/api/content/${contentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

const ContentPage = async ({
  params,
}: {
  params: { courseId: string; contentId: string };
}) => {
  const contentData: CourseContentData = await getContent(params.contentId);

  return (
    <>
      <Suspense fallback={<CourseDisplaySkeleton/>}>
        <ContentDisplay contentData={contentData} />
      </Suspense>
    </>
  );
};

export default ContentPage;
