"use server";

import getSession from "../util/getsession";
import { CourseContentData, CourseData } from "../util/types";
import { logoutaction } from "./authaction";

export const getCourseDetails = async (
  courseId: string
): Promise<CourseData | { error: string }> => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      logoutaction();
      return { error: "unauthorized" };
    }
    const res = await fetch(
      `${process.env.BASE_URL}/api/course/instructor/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data: CourseData = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return { error: String(error) };
  }
};

export const getCourseContent = async (
  courseId: string
): Promise<CourseContentData[] | { error: string }> => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }
    new Promise((resolve) => setTimeout(resolve, 5000));
    const res = await fetch(
      `${process.env.BASE_URL}/api/content/all/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    let data = await res.json();
    if (data.detail) {
      data = [];
    }
    return data;
  } catch (error) {
    return { error: String(error) };
  }
};
