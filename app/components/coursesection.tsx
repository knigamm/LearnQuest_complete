import { CourseData } from "../util/types";

import Link from "next/link";

import getSession from "../util/getsession";

import toast from "react-hot-toast";
import { Suspense } from "react";
import CourseSkeleton from "./courseskeleton";

const getCourses = async () => {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/course?page=1&limit=8`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const CourseCards = async ({ sectionName }: { sectionName: string }) => {
  const courseDetails: CourseData[] = await getCourses();
  return (
    <section className="bg-[#f7f9fa] sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-3xl font-extrabold">{sectionName}</h1>

        <div className="flex flex-wrap gap-4 mt-4">
          {courseDetails?.map((courseDetail) => (
            <Link
              key={courseDetail.course_uid}
              href={`/course/${courseDetail.course_uid}`}
              className="flex flex-col basis-1/4 max-w-[24%] h-80 w-full mb-6 rounded-lg group bg-white shadow-sm"
            >
              <div className="h-[50%] w-full">
                <img
                  src={courseDetail.course_image}
                  className="object-cover h-full group-hover:brightness-75 duration-200 ease-in-out w-full overflow-hidden rounded-ss-lg rounded-se-lg"
                />
              </div>
              <div className="flex flex-col px-4 py-2">
                <h1 className="text-lg font-bold text-wrap w-full font-sans">
                  {courseDetail.course_name}
                </h1>
                <p className="line-clamp-1 mt-2 font-light font-sans">
                  {courseDetail.course_description}
                </p>
                <h1 className="text-lg font-semibold font-sans mt-2">
                  &#8377;{courseDetail.course_price}
                </h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const CourseSection = async ({ sectionName }: { sectionName: string }) => {
  return (
    <>
      <Suspense fallback={<CourseSkeleton sectionName={sectionName} />}>
        <CourseCards sectionName={sectionName} />
      </Suspense>
    </>
  );
};

export default CourseSection;
