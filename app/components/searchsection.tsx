import { Separator } from "@/components/ui/separator";

import { CourseData } from "../util/types";

import getSession from "../util/getsession";
import { logoutaction } from "../actions/authaction";

import toast from "react-hot-toast";
import Link from "next/link";

const getCourses = async (query: string | undefined) => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      logoutaction();
    }

    const response = await fetch(
      `${process.env.BASE_URL}/api/course/keywords/${query}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    toast.error("Some error occured!! Please refresh.");
  }
};

const CourseCard = ({ courseData }: { courseData: CourseData }) => {
  return (
    <Link href={`/course/${courseData.course_uid}`}>
      <div className="w-full max-w-screen-xl ml-6 py-6 h-[250px] flex items-center mb-3 group">
        <img
          src={courseData.course_image}
          className="h-full w-[25%] object-cover group-hover:brightness-75 transition duration-200 ease-in-out"
        />
        <div className="h-full w-[60%] ml-6">
          <h1 className="text-xl font-bold font-sans">
            {courseData.course_name}
          </h1>
          <p className="text-lg font-normal font-sans mt-2">
            {courseData.course_description}
          </p>
          {/* <p className="text-sm mt-2 font-light text-[#6a6f73]">
            {courseData.course_creator}
          </p> */}
        </div>
        <div className="h-full w-[15%] ml-10">
          <h1 className="text-xl font-semibold font-sans">
            &#8377;{courseData.course_price}
          </h1>
        </div>
      </div>
      <Separator className="my-4 ml-6 max-w-screen-xl" />
    </Link>
  );
};

const SearchSection = async ({ query }: { query: string | undefined }) => {
  const courseData: CourseData[] = await getCourses(query);
  console.log(courseData);
  return (
    <>
      {courseData?.map((course) => {
        return (
          <>
            <CourseCard key={course.course_uid} courseData={course} />
          </>
        );
      })}
    </>
  );
};

export default SearchSection;
