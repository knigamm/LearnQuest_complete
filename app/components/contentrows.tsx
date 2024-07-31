"use client";

import { TableCell, TableRow } from "@/components/ui/table";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Ellipsis,
  Pencil,
  Trash2,
  Video,
  File,
  Loader,
  Square,
  Grip,
  VideoIcon,
  FileIcon,
} from "lucide-react";

import { CourseData } from "../util/types";
import { deleteCourse } from "../actions/courseactions";
import { formatDate } from "../util/utilityfunctions";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingSpinner } from "@/components/ui/loader";

import { CourseContentData } from "../util/types";
import CourseContentForm from "./coursecontentform";

import { deleteContent } from "../actions/courseactions";
import { Reorder, useDragControls } from "framer-motion";

const ContentRows = ({
  content,
  courseContent,
}: {
  content: CourseContentData;
  courseContent: CourseContentData[];
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const controls = useDragControls();

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();
  const deletefunc = async () => {
    const formdata = new FormData();
    formdata.append("content_id", content.content_uid);
    formdata.append("content_data", content.content_data);
    formdata.append("course_id", content.course_uid);
    await deleteContent(formdata);
    setDeleteOpen(false);
  };

  return (
    <>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <DialogOverlay className="overflow-y-scroll max-h-screen">
          <DialogContent
            className="max-w-[700px] overflow-y-scroll max-h-[80%]"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Edit Chapter</DialogTitle>
            </DialogHeader>
            <CourseContentForm isEditing content={content} setOpen={setOpen} />
          </DialogContent>
        </DialogOverlay>
      </Dialog>

      <AlertDialog open={deleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              chapter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <form onSubmit={handleSubmit(deletefunc)}>
              <AlertDialogAction type="submit" className="flex gap-2">
                {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
                Continue
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Reorder.Item
        className="group"
        as="tr"
        value={content}
        dragListener={false}
        dragControls={controls}
        key={content.content_uid}
      >
        <TableCell>{content.content_order}</TableCell>
        <TableCell>{content.content_title}</TableCell>
        <TableCell>
          {content.content_type === "video" ? (
            <VideoIcon className="w-4 h-4" />
          ) : (
            <FileIcon className="w-4 h-4" />
          )}
        </TableCell>
        <TableCell>{formatDate(content.created_at)}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Ellipsis size={20} className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => setOpen(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setDeleteOpen((o) => !o)}
                className="text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
        <TableCell onPointerDown={(e) => controls.start(e)}>
          <Grip className="w-4 h-4 cursor-grab group-hover:visible invisible active:cursor-grabbing" />
        </TableCell>
      </Reorder.Item>
    </>
  );
};

export default ContentRows;
