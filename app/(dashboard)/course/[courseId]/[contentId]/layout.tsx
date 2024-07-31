import { logoutaction } from "@/app/actions/authaction";
import getSession from "@/app/util/getsession";

import { redirect } from "next/navigation";

import ContentSideBar from "@/app/components/contentsidebar";

import { CourseContentData } from "@/app/util/types";

const checkEnrollment = async (courseId: string) => {
  let data;
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }
    const res = await fetch(
      `${process.env.BASE_URL}/api/enroll/check/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    data = await res.json();
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  } finally {
    if (data.is_user_enrolled === "false") {
      redirect("/");
    }
  }
};

const getContent = async (courseId: string) => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }
    const res = await fetch(
      `${process.env.BASE_URL}/api/content/all/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data = await res.json();
    if (data.detail) {
      return [];
    }
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

const contentLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { contentId: string; courseId: string };
}) => {
  await checkEnrollment(params.courseId);
  const contentData: CourseContentData[] = await getContent(params.courseId);
  return (
    <>
      <div className="w-full h-screen flex">
        <ContentSideBar contentData={contentData} />
        {children}
      </div>
    </>
  );
};
export default contentLayout;
