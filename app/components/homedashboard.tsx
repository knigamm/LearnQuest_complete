import CourseSection from "./coursesection";
import SearchInput from "./searchinput";

const HomeDashboard = () => {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary to-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center text-primary-foreground">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Unlock Your Learning Potential
              </h1>
              <p className="text-lg md:text-xl">
                Explore courses and resources that empower you to achieve your
                educational goals.
              </p>
            </div>
            <SearchInput div="w-[60%]" input="h-[60px] text-xl" />
          </div>
        </div>
      </section>

      <CourseSection sectionName="Popular Courses" />
    </>
  );
};

export default HomeDashboard;
