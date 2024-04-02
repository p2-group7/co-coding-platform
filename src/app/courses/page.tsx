import { api } from "@/trpc/server";
import CourseCard from "@/components/course/CourseCard";
import CourseCreatorCard from "@/components/course/CourseCreaterCard";

export default async function Courses() {
  const course = await api.get.getCourses();

  const courseElements = course.map(function (course) {
    return (
      <CourseCard key={course.id} id={course.id} nameShort={course.abrev} name={course.name} />
    );
  });

  return (
    <div className="grid grid-cols-3 gap-4 m-10">
      {courseElements}
      <CourseCreatorCard />
    </div>
  );
}
