import { Skeleton } from "@/components/ui/skeleton";

const CourseSkeleton = ({ sectionName }: { sectionName: string }) => {
  return (
    <>
      <section className="bg-white sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-3xl font-extrabold">{sectionName}</h1>

          <div className="flex flex-wrap gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col basis-1/4 max-w-[24%] h-80 w-full mb-6 rounded-lg"
              >
                <div className="h-[50%] w-full">
                  <Skeleton className="h-full w-full rounded-xl" />
                </div>
                <div className="flex flex-col py-2 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[30%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseSkeleton;
