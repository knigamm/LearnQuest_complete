"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { getCourseDetails } from "../actions/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { CourseData } from "../util/types";

import { useState } from "react";
import { useParams } from "next/navigation";
import { publishCourse } from "../actions/courseactions";
import { LoadingSpinner } from "@/components/ui/loader";
import toast from "react-hot-toast";

const PublishSwitch = ({
  published,
  isDisabled,
}: {
  published: boolean | undefined;
  isDisabled: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const params = useParams();
  const { data: courseData } = useQuery<CourseData | { error: string }>({
    queryKey: ["course-data"],
    queryFn: () => {
      return getCourseDetails(params.courseId as string);
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const [state, setStatus] = useState(() => {
    if (courseData && !("error" in courseData)) {
      return courseData.is_published;
    }
  });

  if (!courseData) {
    return;
  }
  if ("error" in courseData) {
    return <div>{courseData.error}</div>;
  }

  const handlePublish = async (v: boolean) => {
    try {
      setStatus(v);
      const formdata = new FormData();
      formdata.append("title", courseData.course_name);
      formdata.append("description", courseData.course_description);
      formdata.append("price", courseData.course_price.toString());
      formdata.append("image", courseData.course_image);
      formdata.append("is_publish", v.toString());
      formdata.append("course_id", courseData.course_uid);
      setIsLoading(true);
      await publishCourse(formdata);
      queryClient.invalidateQueries({ queryKey: ["course-data"] });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setStatus(!v);
      toast.error("Could not publish course. Please try again!");
    }
  };

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <div className="flex items-center space-x-2">
        <Switch
          id="publish"
          disabled={isDisabled}
          checked={state}
          onCheckedChange={(v) => handlePublish(v)}
        />
        <Label htmlFor="publish">{state ? "Unpublish" : "Publish"}</Label>
      </div>
    </>
  );
};

export default PublishSwitch;
