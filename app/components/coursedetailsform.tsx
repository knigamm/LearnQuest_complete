"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import toast from "react-hot-toast";

import { CourseUpdation, CourseData, CourseContentData } from "../util/types";
import { getImageSignedUrl, updateCourse } from "../actions/courseactions";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { useParams } from "next/navigation";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCourseContent, getCourseDetails } from "../actions/fetch";

type courseformdata = z.infer<typeof CourseUpdation>;

const CourseDetailsForm = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string>("");

  const params = useParams();
  const queryClient = useQueryClient();

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

  const { data: courseData } = useQuery<CourseData | { error: string }>({
    queryKey: ["course-data"],
    queryFn: () => {
      return getCourseDetails(params.courseId as string);
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful,
      isDirty,
      dirtyFields,
    },
    setValue,
    setError,
  } = useForm<courseformdata>({
    resolver: zodResolver(CourseUpdation),
    defaultValues:
      courseData && !("error" in courseData)
        ? {
            title: courseData.course_name,
            description: courseData.course_description,
            image: courseData.course_image,
            price: courseData.course_price.toString(),
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

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setValue("image", url, { shouldDirty: true });
    } else {
      setFileUrl("");
    }
  };

  const onSubmit: SubmitHandler<courseformdata> = async (data) => {
    try {
      let url = "";
      const formdata = new FormData();
      formdata.append("course_id", courseData.course_uid);
      formdata.append("title", data.title);
      formdata.append("description", data.description);
      formdata.append("price", data.price);
      if (dirtyFields.image && file) {
        const signedUrl = await getImageSignedUrl(file.type, file.size);
        if (signedUrl.failure !== undefined) {
          setError("image", { type: "invalid", message: signedUrl.failure });
          return;
        }
        url = signedUrl?.success?.url;
        formdata.append("image", url.split("?")[0]);
        formdata.append("delete_image", courseData.course_image);
      } else {
        formdata.append("image", courseData.course_image);
      }

      await updateCourse(formdata);
      if (dirtyFields.image && file) {
        await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
      }
      queryClient.invalidateQueries({ queryKey: ["course-data"] });
      toast.success("Course updated successfully!");
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-1 mt-2">
            <Label htmlFor="course_name">Title</Label>
            <Input
              {...register("title")}
              placeholder='e.g."Backend with NodeJs"'
              id="course_name"
            />
            {errors?.title?.message && (
              <div className="text-red-500 text-xs mt-1">
                {`${errors?.title?.message}`}
              </div>
            )}
          </div>
          <div className="space-y-1 mt-2">
            <Label htmlFor="course_price">Price (&#8377;)</Label>
            <Input type="number" {...register("price")} id="course_price" />
            {errors?.price?.message && (
              <div className="text-red-500 text-xs mt-1">
                {`${errors?.price?.message}`}
              </div>
            )}
          </div>
        </div>
        <div className="w-full space-y-1 mt-4">
          <Label htmlFor="course_description">Course Description</Label>
          <Textarea
            {...register("description")}
            placeholder='e.g."In this course you will be taught.... The pre-requisites are..."'
            id="course_description"
          />
          {errors?.description && (
            <div className="text-red-500 text-xs mt-1">
              {`${errors?.description?.message}`}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <Label htmlFor="course_image">Image</Label>
            <input type="hidden" {...register("image")} />
            <Input
              type="file"
              id="course_image"
              onChange={(e) => handleImage(e)}
              accept="image/jpeg,image/png,image/webp"
            />
            {errors?.image && (
              <div className="text-red-500 text-xs mt-1">
                {`${errors?.image?.message}`}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 ">
          {(courseData.course_image || fileUrl.length !== 0) && (
            <Image
              src={fileUrl ? fileUrl : courseData.course_image}
              alt="Course Image"
              width={300}
              height={200}
              className="rounded-md w-96"
            />
          )}
        </div>
        <div className="flex justify-end gap-4 items-center mt-6">
          {isDirty && !isSubmitSuccessful && !isSubmitting && (
            <text className="text-red-400 text-sm">
              You have unsaved changes
            </text>
          )}
          <div className="flex gap-2 items-center">
            {isSubmitting && <Loader2 className="w-6 h-6 animate-spin" />}
            {isSubmitSuccessful && <Check className="text-green-500" />}
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CourseDetailsForm;
