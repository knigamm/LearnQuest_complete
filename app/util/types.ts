import { z } from "zod";

export type UserData = {
  email: string;
  uid: string;
  first_name: string;
  created_at: string;
  last_name: string;
  is_instructor: boolean;
};

export type CourseData = {
  course_image: string;
  course_description: string;
  course_name: string;
  course_price: number;
  created_at: string;
  course_creator: string;
  course_uid: string;
  is_published?: boolean;
  updated_at: string;
};

export type CourseContentData = {
  content_description: string;
  content_uid: string;
  content_data: string;
  created_at: string;
  content_title: string;
  course_uid: string;
  content_type: string;
  content_order: number;
};

export const CourseCreation = z.object({
  title: z.string().min(1, "Course must have a title"),
  description: z.string().min(1, "Course must have a description"),
  price: z.string().min(1, "Enter the price of the course"),
  image: z
    .any()
    .refine((file) => file?.length == 1, "Course must have an image"),
});

export const CourseUpdation = z.object({
  title: z.string().min(1, "Course must have a title"),
  description: z.string().min(1, "Course must have a description"),
  price: z.string().min(1, "Enter the price of the course"),
  image: z.string().min(1, { message: "Course must have an image" }),
});

export const ChapterCreation = z.object({
  title: z.string().min(1,"Chapter must have a title"),
  description: z.string().min(1,"Chapter must have a description"),
  data:z.string().min(1,"Chapter must have chapter data")
})