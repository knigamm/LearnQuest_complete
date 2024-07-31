import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator"; 

const SearchSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="w-full max-w-screen-xl ml-6 py-6 h-[250px] flex items-center mb-3 group">
            <Skeleton className="h-full w-[25%] rounded-xl" />

            <div className="h-full space-y-4 w-[60%] ml-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-[60%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
            <div className="h-full w-[15%] ml-10">
              <Skeleton className="h-4 w-[30%]" />
            </div>
          </div>

          <Separator className="my-4 ml-6 max-w-screen-xl" />
        </div>
      ))}
    </>
  );
};

export default SearchSkeleton;
