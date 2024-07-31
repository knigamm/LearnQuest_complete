"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { Reorder } from "framer-motion";
import { getCourseContent, getCourseDetails } from "../actions/fetch";

import ContentRows from "./contentrows";
import CourseContentForm from "./coursecontentform";
import { CourseContentData, CourseData } from "../util/types";
import { LoadingSpinner } from "@/components/ui/loader";
import { updateChapter } from "../actions/courseactions";
import toast from "react-hot-toast";

const CourseContentTable = () => {
  const [open, setOpen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const params = useParams();
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
  const [showCourseContent, setShowCourseContent] = useState(() => {
    if (courseContent && !("error" in courseContent)) {
      return courseContent as CourseContentData[];
    } else {
      return [] as CourseContentData[];
    }
  });

  const { data: courseData } = useQuery<CourseData | { error: string }>({
    queryKey: ["course-data"],
    queryFn: () => {
      return getCourseDetails(params.courseId as string);
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
    <>
      <LoadingSpinner isLoading={isReordering} />
      <Dialog modal open={open} onOpenChange={setOpen}>
        <DialogOverlay className="overflow-y-scroll max-h-screen">
          <DialogContent
            className="max-w-[700px] overflow-y-scroll max-h-[80%]"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>New Chapter</DialogTitle>
            </DialogHeader>
            <CourseContentForm isEditing={false} setOpen={setOpen} />
          </DialogContent>
        </DialogOverlay>
      </Dialog>

      {courseContent.length !== 0 ? (
        <>
          <div className="flex justify-between p-4">
            <h1 className="text-xl font-semibold my-4">Chapters</h1>
            <div className="flex gap-4 items-center p-3">
              <div className="relative w-full max-w-md">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search course..."
                  className="pl-8 w-full"
                />
              </div>
              <Button onClick={() => setOpen(true)} className="mr-3">
                Create Chapter
              </Button>
            </div>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead colSpan={1}></TableHead>
                <TableHead colSpan={1}></TableHead>
              </TableRow>
            </TableHeader>
            <Reorder.Group
              as="tbody"
              values={showCourseContent}
              onReorder={async (e) => {
                console.log(e);
                setShowCourseContent(e);
                setIsReordering(true);
                const promises = e.map((content, i) => {
                  const formdata = new FormData();
                  formdata.append("content_title", content.content_title);
                  formdata.append(
                    "content_description",
                    content.content_description
                  );
                  formdata.append("content_type", content.content_type);
                  formdata.append("content_data", content.content_data);
                  formdata.append("content_order", (i + 1).toString());
                  formdata.append("content_id", content.content_uid);
                  return updateChapter(formdata);
                });
                try {
                  await Promise.all(promises);
                } catch (error) {
                  toast.error("Could not reorder. Please try again!");
                } finally {
                  setIsReordering(false);
                }
              }}
            >
              {showCourseContent.map((content) => (
                <ContentRows
                  content={content}
                  key={content.content_uid}
                  courseContent={courseContent}
                />
              ))}
            </Reorder.Group>
          </Table>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[80%]">
          <h3 className="text-2xl font-bold">No Chapters Available</h3>
          <p className="text-muted-foreground">
            You haven&apos;t created any chapters yet.
          </p>
          <Button onClick={() => setOpen(true)} className="mr-3 mt-3">
            Create Chapter
          </Button>
        </div>
      )}
    </>
  );
};

export default CourseContentTable;
