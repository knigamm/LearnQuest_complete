import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchIcon } from "lucide-react";

import { CourseData } from "@/app/util/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InstructorRows from "./instructorrows";

import Link from "next/link";

type instructordashboardprops = {
  coursedata: CourseData[];
};

const InstructorDashboard: React.FC<instructordashboardprops> = ({
  coursedata,
}) => {
  return (
    <div className="flex flex-col mx-auto h-full w-[80%]">
      {coursedata.length !== 0 ? (
        <>
          <div className="flex justify-between p-4">
            <h1 className="text-2xl font-semibold my-4">Your Courses</h1>
            <div className="flex gap-4 items-center p-3">
              <div className="relative w-full max-w-md">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search course..."
                  className="pl-8 w-full"
                />
              </div>
              <Button className="mr-3" asChild>
                <Link href="/instructor/new">New course</Link>
              </Button>
            </div>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead colSpan={1}></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {coursedata?.map((course) => (
                <InstructorRows course={course} key={course.course_uid} />
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-2xl font-bold">No Courses Available</h3>
          <p className="text-muted-foreground">
            You haven&apos;t created any courses yet.
          </p>
          <Button className="mr-3 mt-3" asChild>
            <Link href="/instructor/new">New course</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
