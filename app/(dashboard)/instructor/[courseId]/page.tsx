import CourseUpdate from "@/app/components/courseupdate";

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getCourseDetails, getCourseContent } from "@/app/actions/fetch";

const Course = async ({ params }: { params: { courseId: string } }) => {
  const clientQuery = new QueryClient();
  await clientQuery.prefetchQuery({
    queryKey: ["course-data"],
    queryFn: () => {
      return getCourseDetails(params.courseId);
    },
  });

  await clientQuery.prefetchQuery({
    queryKey: ["course-content"],
    queryFn: () => {
      return getCourseContent(params.courseId);
    },
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(clientQuery)}>
        <CourseUpdate />
      </HydrationBoundary>
    </>
  );
};

export default Course;
