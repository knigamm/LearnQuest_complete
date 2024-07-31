import { Skeleton } from "@/components/ui/skeleton";

const CourseDisplaySkeleton = () => {
  return (
    <>
      <div className="flex flex-col w-[70%] h-[80%] mt-4 mx-auto">
        <Skeleton className="w-[20%] h-6 mb-4" />
        <Skeleton className="w-full h-full rounded-lg" />
        <div className="mt-2">
          <Skeleton className="h-4 w-[30%] mt-2" />
          <Skeleton className="h-4 w-[60%] mt-2" />
          <Skeleton className="h-6 w-full mt-2" />
          <Skeleton className="h-6 w-full mt-2" />
        </div>
      </div>
    </>
  );
};

export default CourseDisplaySkeleton;
