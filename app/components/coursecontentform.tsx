"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, LoaderCircle } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Dropzone from "./dropzone";

import { Dispatch, SetStateAction, useState } from "react";

import Player from "next-video/player";

import { useForm, SubmitHandler } from "react-hook-form";
import { FileWithPath } from "react-dropzone";
import toast from "react-hot-toast";

import { CourseData, ChapterCreation, CourseContentData } from "../util/types";
import {
  createChapter,
  getDataSignedUrl,
  updateChapter,
  getVideoSignedUrl,
} from "../actions/courseactions";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCourseContent, getCourseDetails } from "../actions/fetch";

type chapterCreation = z.infer<typeof ChapterCreation>;

type contentFormProps = {
  isEditing: boolean;
  content?: CourseContentData;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const CourseContentForm = ({
  isEditing,
  content,
  setOpen,
}: contentFormProps) => {
  const params = useParams();
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [fileType, setFileType] = useState(
    content?.content_type ? content.content_type : ""
  );
  const [fileUrl, setFileUrl] = useState("");
  const { data: courseData } = useQuery<CourseData | { error: string }>({
    queryKey: ["course-data"],
    queryFn: () => getCourseDetails(params.courseId as string),
    refetchOnMount: false,
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

  const { data: signedUrl, isLoading: isSignedUrlLoading } = useQuery({
    queryKey: ["signedUrl"],
    queryFn: () => getVideoSignedUrl(content?.content_data),
    enabled: !!content,
    staleTime: 60,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, dirtyFields },
    setError,
    setValue,
  } = useForm<chapterCreation>({
    resolver: zodResolver(ChapterCreation),
    defaultValues: isEditing
      ? {
          title: content?.content_title,
          description: content?.content_description,
          data: content?.content_data,
        }
      : {},
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

 
  const onUpload = (file: FileWithPath | null) => {
    if (file) {
      setFile(file);
      const type = file.type.split("/");
      setFileType(type[0] === "application" ? type[1] : type[0]);
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setValue("data", url, { shouldDirty: true });
    }
  };

  const onSubmit: SubmitHandler<chapterCreation> = async (data) => {
    console.log("onsubmit");
    try {
      let url = "";
      const formdata = new FormData();
      formdata.append("content_title", data.title);
      formdata.append("content_description", data.description);
      formdata.append("course_id", courseData.course_uid);
      if (dirtyFields.data && file) {
        const signedUrl = await getDataSignedUrl(file.type, file.size);
        if (signedUrl.failure !== undefined) {
          setError("data", { type: "invalid", message: signedUrl.failure });
          return;
        }
        url = signedUrl?.success?.url;
        formdata.append("content_data", url?.split("?")[0]);
        if (content) {
          formdata.append("delete_data", content?.content_data);
        }
      } else if (content) {
        formdata.append("content_data", content.content_data);
      }
      formdata.append("content_type", fileType);
      if (content) {
        formdata.append("content_id", content?.content_uid);
      }
      const courseLength = courseContent.length + 1;
      formdata.append("content_order", courseLength.toString());
      if (content) {
        await updateChapter(formdata);
      } else {
        await createChapter(formdata);
      }
      if (dirtyFields.data && file) {
        await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
      }
      setOpen(false);
      toast.success("Chapter created successfully!");
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  };


  return (
    <>
      <Dropzone onFileSelect={({ dropFile }) => onUpload(dropFile)} />
      {errors?.data?.message && (
        <div className="text-red-500 text-xs">{`${errors?.data?.message}`}</div>
      )}
      {isSignedUrlLoading ? (
        <div className="w-full h-80 flex justify-center items-center">
          <LoaderCircle className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        (fileUrl || (signedUrl?.success?.signedUrl && isEditing)) && (
          <Player
            className="w-full"
            src={fileUrl ? fileUrl : signedUrl?.success?.signedUrl}
          />
        )
      )}
      {file && <p>{file?.path}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="space-y-1 mt-2">
            <Label htmlFor="chapter_name">Title</Label>
            <Input
              {...register("title")}
              placeholder='e.g."Introduction to Nodejs"'
              id="chapter_name"
            />
            {errors?.title?.message && (
              <div className="text-red-500 text-xs mt-1">
                {`${errors?.title?.message}`}
              </div>
            )}
          </div>
          <div className="space-y-1 mt-2">
            <Label htmlFor="chapter_description">Description</Label>
            <Textarea
              {...register("description")}
              placeholder='e.g."In this chapter you will be introduced to Nodejs..."'
              id="chapter_description"
            />
            {errors?.description?.message && (
              <div className="text-red-500 text-xs mt-1">
                {`${errors?.description?.message}`}
              </div>
            )}
          </div>
          <input type="hidden" {...register("data")} />

          <div className="space-y-1 mt-2">
            <Label htmlFor="chapter_type">Type</Label>
            <Input
              value={
                ((fileType || content) && fileType
                  ? fileType
                  : content?.content_type) || "Not selected"
              }
              disabled
              id="chapter_type"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CourseContentForm;
