"use server";

import getSession from "../util/getsession";
import { logoutaction } from "./authaction";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION_learn,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_learn!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_learn!,
  },
});

const MAX_SIZE = 1024 * 1024 * 5;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const MAX_DATA_SIZE = 1024 * 1024 * 1024 * 1;
const ACCEPTED_DATA_FILE_TYPES = ["video/mp4", "application/pdf"];

export const getImageSignedUrl = async (type: string, size: number) => {
  const session = getSession()?.value;
  if (!session) {
    return logoutaction();
  }

  if (!ACCEPTED_FILE_TYPES.includes(type)) {
    return { failure: "Invalid File Type" };
  }

  if (size > MAX_SIZE) {
    return { failure: "File should be smaller than 5mb" };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME_learn!,
    Key: `images/${generateFileName()}`,
  });

  const signedUrl = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return { success: { url: signedUrl } };
};

export const getVideoSignedUrl = async (url: string | undefined) => {
  try {
    if (!url) return { failure: { message: "Could not fetch data" } };
    const session = getSession()?.value;
    if (!session) {
      return logoutaction();
    }
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME_learn!,
      Key: `videos/${url.toString().split("/").pop()}`,
    });
    const signedUrl = await getSignedUrl(s3, getObjectCommand, {
      expiresIn: 60,
    });
    return { success: { signedUrl } };
  } catch (error) {
    console.log(error);
    return {
      failure: { message: "Could not fetch the data please try again!!" },
    };
  }
};

export const getDataSignedUrl = async (type: string, size: number) => {
  const session = getSession()?.value;
  if (!session) {
    return logoutaction();
  }

  if (!ACCEPTED_DATA_FILE_TYPES.includes(type)) {
    return { failure: "Invalid File Type" };
  }

  if (size > MAX_DATA_SIZE) {
    return { failure: "File should be smaller than 1Gb" };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME_learn!,
    Key: `videos/${generateFileName()}`,
  });

  const signedUrl = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return { success: { url: signedUrl } };
};

export const createCourse = async (formdata: FormData) => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }

    const body = {
      course_name: formdata.get("title"),
      course_description: formdata.get("description"),
      course_image: formdata.get("image"),
      course_price: Number(formdata.get("price")),
      is_published: false,
    };
    const response = await fetch(`${process.env.BASE_URL}/api/course/create`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    if (data && data?.detail) {
      throw new Error(data?.detail);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
  redirect("/instructor");
};

export const createChapter = async (formdata: FormData) => {
  console.log(formdata);
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }

    const body = {
      course_uid: formdata.get("course_id"),
      content_title: formdata.get("content_title"),
      content_description: formdata.get("content_description"),
      content_type: formdata.get("content_type"),
      content_data: formdata.get("content_data"),
      content_order: Number(formdata.get("content_order")),
    };
    const response = await fetch(`${process.env.BASE_URL}/api/content`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    if (data && data?.detail) {
      throw new Error(data?.detail);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
  revalidatePath(`/instructor/${formdata.get("course_id")}`);
};

export const updateChapter = async (formdata: FormData) => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }

    const body = {
      content_title: formdata.get("content_title"),
      content_description: formdata.get("content_description"),
      content_type: formdata.get("content_type"),
      content_data: formdata.get("content_data"),
      content_order: Number(formdata.get("content_order")),
    };
    const response = await fetch(
      `${process.env.BASE_URL}/api/content/${formdata.get("content_id")}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    if (data && data?.detail) {
      throw new Error(data?.detail);
    }
    if (formdata.get("delete_data")) {
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME_learn!,
        Key: `videos/${formdata
          .get("delete_data")
          ?.toString()
          .split("/")
          .pop()}`,
      });

      await s3.send(deleteObjectCommand);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const publishCourse = async (formdata: FormData) => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }

    const body = {
      course_name: formdata.get("title"),
      course_description: formdata.get("description"),
      course_image: formdata.get("image"),
      course_price: Number(formdata.get("price")),
      is_published: formdata.get("is_publish") === "true" ? true : false,
    };

    await fetch(
      `${process.env.BASE_URL}/api/course/update/${formdata.get("course_id")}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }

  revalidatePath(`/instructor/${formdata.get("course_id")}`);
};

export const updateCourse = async (formdata: FormData) => {
  try {
    const authToken = getSession()?.value;
    if (!authToken) {
      return logoutaction();
    }

    const body = {
      course_name: formdata.get("title"),
      course_description: formdata.get("description"),
      course_image: formdata.get("image"),
      course_price: Number(formdata.get("price")),
      is_published: false,
    };

    const res = await fetch(
      `${process.env.BASE_URL}/api/course/update/${formdata.get("course_id")}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    console.log("returned data", data);
    if (formdata.get("delete_image")) {
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME_learn!,
        Key: `images/${formdata
          .get("delete_image")
          ?.toString()
          .split("/")
          .pop()}`,
      });

      await s3.send(deleteObjectCommand);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }

  revalidatePath(`/instructor/${formdata.get("course_id")}`);
};

export const deleteContent = async (formdata: FormData) => {
  try {
    const authToken = getSession()?.value;
    console.log("deleting");
    if (!authToken) {
      return logoutaction();
    }

    await fetch(
      `${process.env.BASE_URL}/api/content/${formdata.get("content_id")}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME_learn!,
      Key: `videos/${formdata
        .get("content_data")
        ?.toString()
        .split("/")
        .pop()}`,
    });

    await s3.send(deleteObjectCommand);
  } catch (error) {
    console.log(error);
  }
  revalidatePath(`/instructor/${formdata.get("course_id")}`);
};

export const deleteCourse = async (formdata: FormData) => {
  try {
    const authToken = getSession()?.value;
    console.log("deleting");
    if (!authToken) {
      return logoutaction();
    }
    const courseResponse = await fetch(
      `${process.env.BASE_URL}/api/course/${formdata.get("course_id")}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    console.log(formdata.get("course_id"));
    const courseData = await courseResponse.json();
    console.log("course data", courseData);
    if (courseData && courseData?.detail) {
      throw new Error(courseData?.detail);
    }

    await fetch(
      `${process.env.BASE_URL}/api/course/delete/${formdata.get("course_id")}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    // if (response) {
    //   const data = await response.json();
    //   if (data && data?.detail) {
    //     throw new Error(data?.detail);
    //   }
    // }
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME_learn!,
      Key: `images/${courseData.course_image.split("/").pop()}`,
    });

    await s3.send(deleteObjectCommand);
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/instructor");
};
