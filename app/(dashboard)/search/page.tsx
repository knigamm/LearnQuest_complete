import SearchSection from "@/app/components/searchsection";
import SearchInput from "@/app/components/searchinput";
import { Suspense } from "react";

import SearchSkeleton from "@/app/components/searchskeleton";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const query = searchParams.q;
  return (
    <>
      <section
        key={Math.random()}
        className="w-full h-screen max-w-screen-2xl m-auto"
      >
        <SearchInput
          div="w-[40%] mt-2"
          input="h-[50px] bg-white text-lg"
          searchValue={query ? query : ""}
        />
        <h1 className="p-6 text-3xl font-bold">Search results for &quot;{query}&quot;</h1>
        <Suspense fallback={<SearchSkeleton/>}>
          <SearchSection query={query} />
        </Suspense>
      </section>
    </>
  );
};

export default SearchPage;
