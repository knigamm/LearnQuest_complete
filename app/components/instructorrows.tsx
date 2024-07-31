"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Ellipsis, Pencil, Trash2 } from "lucide-react";

import { CourseData } from "../util/types";
import { deleteCourse } from "../actions/courseactions";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingSpinner } from "@/components/ui/loader";

type instructorrow = {
  course: CourseData;
};

const InstructorRows: React.FC<instructorrow> = ({ course }) => {
  const [open, setOpen] = useState(false);
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();
  const deletefunc = async () => {
    const formdata = new FormData();
    formdata.append("course_id", course.course_uid);
    await deleteCourse(formdata);
  };
  return (
    <>
      <LoadingSpinner isLoading={isSubmitting} />
      <TableRow className="font-semibold" key={course.course_uid}>
        <TableCell>{course.course_name}</TableCell>
        <TableCell>&#8377;{course.course_price}</TableCell>
        <TableCell>
          <Badge
            variant={course.is_published ? "default" : "secondary"}
            className={course.is_published ? "bg-green-400" : ""}
          >
            {course.is_published ? "Published" : "Draft"}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Ellipsis size={20} className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={`/instructor/${course.course_uid}`}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => setOpen((o) => !o)}
                className="text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={open}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this course.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <form onSubmit={handleSubmit(deletefunc)}>
                  <AlertDialogAction type="submit">Continue</AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TableCell>
      </TableRow>
    </>
  );
};

export default InstructorRows;
