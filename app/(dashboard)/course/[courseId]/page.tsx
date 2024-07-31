import { logoutaction } from "@/app/actions/authaction";
import CourseContent from "@/app/components/coursecontent";
import getSession from "@/app/util/getsession";
import { CourseContentData, CourseData } from "@/app/util/types";

type coursedata = {
  course_data: CourseData;
  content_data: CourseContentData[];
  enroll_data: { is_user_enrolled: boolean };
};

const getCourse = async (courseId: string) => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }
    const course = await fetch(
      `${process.env.BASE_URL}/api/course/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data = await course.json();

    const enroll = await fetch(
      `${process.env.BASE_URL}/api/enroll/check/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const enroll_data = await enroll.json();

    const content = await fetch(
      `${process.env.BASE_URL}/api/content/all/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const content_data = await content.json();

    return { course_data: data, enroll_data, content_data };
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

const Course = async ({ params }: { params: { courseId: string } }) => {
  const course:coursedata = await getCourse(params.courseId);
  return (
    <>
      <CourseContent course={course} />
    </>
  );
};

export default Course;
