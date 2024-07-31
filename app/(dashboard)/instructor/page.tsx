import { CourseData } from "@/app/util/types";

import InstructorDashboard from "@/app/components/instructordashboard";

import getSession from "@/app/util/getsession";

async function getInstructorCourses() {
  const authToken = getSession()?.value;
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/course/instructor/all`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data = await response?.json();

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

const Instructor = async () => {
  const coursedata: CourseData[] = await getInstructorCourses();
  return <InstructorDashboard coursedata={coursedata} />;
};

export default Instructor;
