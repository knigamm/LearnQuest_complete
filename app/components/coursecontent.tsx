"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import { CourseData, CourseContentData } from "../util/types";

import { VideoIcon, FileIcon, BookOpenIcon } from "lucide-react";
import { animate, motion, useMotionValueEvent, useScroll } from "framer-motion";

import { useState } from "react";
import Link from "next/link";

type coursedata = {
  course_data: CourseData;
  content_data: CourseContentData[];
  enroll_data: { is_user_enrolled: string };
};

type coursecontentprops = {
  course: coursedata;
};

const CourseContent = ({ course }: coursecontentprops) => {
  const [hidden, setHidden] = useState(true);
  const { scrollY } = useScroll();
  console.log(course.enroll_data.is_user_enrolled);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 250) {
      setHidden(false);
    } else {
      setHidden(true);
    }
  });
  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        initial="hidden"
        transition={{ duration: 0.25, ease: "easeInOut" }}
        animate={hidden ? "hidden" : "visible"}
        className="w-full fixed top-16 h-20 bg-black p-5 text-white"
      >
        <p className="font-bold">{course.course_data.course_name}</p>
        <p className="mt-1">{course.course_data.course_description}</p>
      </motion.nav>
      <div className="w-full">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid md:grid-cols-2 gap-6 px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {course.course_data.course_name}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  {course.course_data.course_description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">
                    &#8377;{course.course_data.course_price}
                  </div>
                  {course.enroll_data.is_user_enrolled === "true" && (
                    <Link
                      href={`/course/${course.course_data.course_uid}/${course.content_data[0].content_uid}`}
                    >
                      <Button size="lg">Resume</Button>
                    </Link>
                  )}
                  {course.enroll_data.is_user_enrolled === "false" && (
                    <Button size="lg">Enroll</Button>
                  )}
                </div>
              </div>
            </div>
            <Image
              src={course.course_data.course_image}
              alt="Course Thumbnail"
              width={600}
              height={400}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
            />
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-12 bg-white">
          <div className="max-w-screen-2xl mx-auto flex justify-center">
            <h1 className="text-3xl font-extrabold">Course Content</h1>
          </div>
          <div className="container mt-20 grid md:grid-cols-2 gap-6 px-4 md:px-6">
            <ul className="flex flex-col justify-center pl-3 space-y-8">
              {course.content_data.map((content) => {
                return (
                  <li
                    key={content.content_order}
                    className="flex items-center text-xl gap-3"
                  >
                    <span>
                      {content.content_type === "video" ? (
                        <VideoIcon className="w-6 h-6" />
                      ) : (
                        <FileIcon className="w-6 h-6" />
                      )}
                    </span>
                    <span>{content.content_title}</span>
                  </li>
                );
              })}
            </ul>
            <motion.div
              className="h-fit sticky top-28"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeIn", delay: 0.1 }}
              whileInView={{ opacity: 100 }}
              viewport={{
                amount: "all",
              }}
            >
              <Card className="w-full mx-auto max-w-sm rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={course.course_data.course_image}
                  alt="Course Thumbnail"
                  width={600}
                  height={400}
                  className="mx-auto aspect-video overflow-hidden rounded-ss-lg object-cover"
                />
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">About Course</h3>
                  </div>
                  <div className="flex flex-col gap-3 items-start justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpenIcon className="w-5 h-5" />
                      <span>{course.content_data.length} Chapters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VideoIcon className="w-5 h-5" />
                      <span>14 Hours of Video Content</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CourseContent;
