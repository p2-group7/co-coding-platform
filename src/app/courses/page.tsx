import { api } from "@/trpc/server";
import Navbar from "@/components/Navbar";
import type { GroupInfo } from "@/components/Navbar";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import CourseCard from "@/components/course/CourseCard";
import CourseCreatorCard from "@/components/course/CourseCreaterCard";

export default async function Courses() {
  const courses = await api.get.getCourses();

  const courseElements = courses.map(function (course) {
    return (
      <CourseCard
        key={course.id}
        nameShort={course.nameShort}
        name={course.name}
      />
    );
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {courseElements}
      <CourseCreatorCard />
    </div>
  );
}
