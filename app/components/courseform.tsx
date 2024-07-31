"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CourseCreation } from "../util/types";
import { LoadingSpinner } from "@/components/ui/loader";

import { getImageSignedUrl, createCourse } from "../actions/courseactions";

import Image from "next/image";

import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ArrowLeftIcon } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";

type courseformdata = z.infer<typeof CourseCreation>;
const stepField = ["title", "description", "price", "image"] as const;

const CourseForm = () => {
  const [step, setStep] = useState(1);
  const [prevStep, setPrevStep] = useState(0);
  const delta = step - prevStep;

  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string>("");

  const handleFile = (e: React.ChangeEvent<HTMLFormElement>) => {
    const file = e.target.files?.[0];
    setFile(file);

    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    } else {
      setFileUrl("");
    }
  };

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    clearErrors,
    setError,
  } = useForm<courseformdata>({
    resolver: zodResolver(CourseCreation),
  });

  const processForm: SubmitHandler<courseformdata> = async (data) => {
    try {
      if (file) {
        const formdata = new FormData();
        formdata.append("title", data.title);
        formdata.append("description", data.description);
        formdata.append("price", data.price);
        const signedUrl = await getImageSignedUrl(file.type, file.size);
        if (signedUrl.failure !== undefined) {
          setError("image", { type: "invalid", message: signedUrl.failure });
          return;
        }
        const url = signedUrl?.success?.url;
        formdata.append("image", url.split("?")[0]);
        await createCourse(formdata);
        await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        toast.success("Course created successfully!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  };

  const next = async () => {
    const validationField = stepField[step - 1];
    const validation = await trigger(validationField, { shouldFocus: true });
    if (!validation) return;
    if (step === 4) {
      await handleSubmit(processForm)();
    } else {
      setPrevStep(step);
      setStep(step + 1);
    }
    clearErrors();
  };

  const prev = () => {
    setPrevStep(step);
    setStep((s) => s - 1);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10 mt-10">
        <LoadingSpinner isLoading={isSubmitting} />
        <div className="grid gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              Create a New Course ({step}/4)
            </h1>
            <p className="text-muted-foreground">
              Fill out the form below to set up your new course.
            </p>
          </div>
          <div className="w-full mx-auto mt-10">
            <Progress value={step * 25} />
          </div>
          <form
            className="grid gap-6 mt-10"
            onSubmit={handleSubmit(processForm)}
          >
            {step === 1 && (
              <motion.div
                initial={{ x: delta > 0 ? "0%" : "-50%", opacity: 1 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div>
                  <h1 className="text-lg font-semibold my-2">Course Name</h1>
                  <p className="text-sm text-slate-600 mb-8">
                    What would you like to name your course? Don&apos;t worry
                    you can change it later.
                  </p>
                  <Label htmlFor="course_name">Title</Label>
                  <Input
                    className="max-w-2xl"
                    {...register("title")}
                    placeholder='e.g."Backend with NodeJs"'
                    id="course_name"
                  />
                  {errors?.title?.message && (
                    <div className="text-red-500 text-xs mt-1">
                      {`${errors?.title?.message}`}
                    </div>
                  )}
                  <Button
                    onClick={next}
                    className="w-full max-w-[200px] mt-8 justify-self-start"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                initial={{ x: delta > 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div>
                  <Button
                    onClick={prev}
                    variant="link"
                    className="flex items-center gap-2 text-sm font-medium text-primary p-0"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back
                  </Button>
                  <h1 className="text-lg font-semibold my-2">Description</h1>
                  <p className="text-sm text-slate-600 mb-8">
                    Write a brief description of your course here. Don’t worry,
                    you can edit and refine it later.
                  </p>
                  <Label htmlFor="course_description">Course Description</Label>
                  <Textarea
                    className="max-w-2xl"
                    {...register("description")}
                    placeholder='e.g."In this course you will be taught.... The pre-requisites are..."'
                    id="course_description"
                  />
                  {errors?.description?.message && (
                    <div className="text-red-500 text-xs mt-1">
                      {`${errors?.description?.message}`}
                    </div>
                  )}
                  <Button
                    onClick={next}
                    className="w-full max-w-[200px] justify-self-start mt-8"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ x: delta > 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div>
                  <Button
                    onClick={prev}
                    variant="link"
                    className="flex items-center gap-2 text-sm font-medium text-primary p-0"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back
                  </Button>
                  <h1 className="text-lg font-semibold my-2">Course Price</h1>
                  <Label htmlFor="course_price">Price (&#8377;)</Label>
                  <Input
                    type="number"
                    {...register("price")}
                    id="course_price"
                    className="max-w-2xl"
                  />
                  {errors?.price?.message && (
                    <div className="text-red-500 text-xs mt-1">
                      {`${errors?.price?.message}`}
                    </div>
                  )}
                  <Button
                    onClick={next}
                    className="w-full max-w-[200px] justify-self-start mt-8"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <>
                <motion.div
                  initial={{ x: delta > 0 ? "50%" : "-50%", opacity: 0 }}
                  animate={{ x: "0%", opacity: 1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <div>
                    <Button
                      onClick={prev}
                      variant="link"
                      className="flex items-center gap-2 text-sm font-medium text-primary p-0"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      Back
                    </Button>
                    <h1 className="text-lg font-semibold my-2">Course Image</h1>
                    <p className="text-sm text-slate-600 mb-8">
                      Add an Image which will be displayed to the Customers.
                    </p>
                    <Label htmlFor="course_image">Image</Label>
                    <Input
                      type="file"
                      id="course_image"
                      className="max-w-2xl"
                      {...register("image", {
                        onChange: (e) => handleFile(e),
                      })}
                      accept="image/jpeg,image/png,image/webp"
                    />
                    {errors?.image?.message && (
                      <div className="text-red-500 text-xs mt-1">
                        {`${errors?.image?.message}`}
                      </div>
                    )}
                  </div>
                  {fileUrl && file && (
                    <div className="flex items-center mt-5">
                      <Image
                        src={fileUrl}
                        alt="Course Image"
                        width={300}
                        height={200}
                        className="rounded-md w-auto"
                      />
                    </div>
                  )}

                  <Button
                    onClick={next}
                    disabled={isSubmitting}
                    className="w-full max-w-[200px] justify-self-start mt-8"
                  >
                    Create Course
                  </Button>
                </motion.div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CourseForm;
