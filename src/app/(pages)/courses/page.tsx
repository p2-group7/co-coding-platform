import { api } from "@/trpc/server";
import InfoCard from "@/components/course/CourseCard";
import CourseCreatorCard from "@/components/course/CreateCourseCard";

export default async function Courses() {
  const course = await api.get.getCourses();

  const courseElements = course.map(function (course) {
    const hrefStr = "/courses/" + course.id.toString();
    return (
      <InfoCard
        key={course.id}
        href={hrefStr}
        nameShort={course.abrev}
        name={course.name}
      />
    );
  });

  return (
    <div className="m-10 grid grid-cols-3 gap-4">
      {courseElements}
      <CourseCreatorCard />
    </div>
  );
}
