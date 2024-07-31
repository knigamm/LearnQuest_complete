"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CourseContentData, CourseData } from "../util/types";

import CourseDetailsForm from "./coursedetailsform";
import CourseContentTable from "./coursecontenttable";
import PublishSwitch from "./publish";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { getCourseDetails, getCourseContent } from "../actions/fetch";

const CourseUpdate = () => {
  const params = useParams();
  const { data: courseData } = useQuery<CourseData | { error: string }>({
    queryKey: ["course-data"],
    queryFn: async () => {
      return getCourseDetails(params.courseId as string);
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { data: courseContent } = useQuery<
    CourseContentData[] | { error: string }
  >({
    queryKey: ["course-content"],
    queryFn: () => {
      return getCourseContent(params.courseId as string);
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (!courseContent) {
    return;
  }
  if ("error" in courseContent) {
    return <div>{courseContent.error}</div>;
  }

  if (!courseData) {
    return;
  }
  if ("error" in courseData) {
    return <div>{courseData.error}</div>;
  }

  return (
    <div className="h-full">
      <section className="max-w-[70%] w-full h-full mx-auto p-8 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold">Course Update</h1>
            <text>
              Fields complete ({courseContent.length === 0 ? "3" : "4"}/4)
            </text>
          </div>
          <PublishSwitch
            published={courseData.is_published}
            isDisabled={!courseContent.length}
          />
        </div>
        <Tabs defaultValue="detail" className="mt-4 flex-1 h-full">
          <TabsList>
            <TabsTrigger value="detail">Course Details</TabsTrigger>
            <TabsTrigger value="content">Course Chapters</TabsTrigger>
          </TabsList>
          <TabsContent value="detail">
            <CourseDetailsForm />
          </TabsContent>
          <TabsContent value="content" className="flex-1 h-full">
            <CourseContentTable />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default CourseUpdate;
