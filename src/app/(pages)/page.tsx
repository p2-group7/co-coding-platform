import { api } from "@/trpc/server";
import InfoCard from "@/components/course/InfoCard";
import CourseCreatorCard from "@/components/course/CreateCourseCard";

//This get all the course
export default async function Courses() {
  const course = await api.course.getUserCourses({ userId: 1 }); // TODO: change to current user id
  const courseElements = course.map(function (course) {
    const hrefStr = "/courses/" + course.id.toString();

    // this creates an array the courses as info cards
    return (
      <InfoCard
        key={course.id}
        href={hrefStr}
        cardTitle={course.abrev}
        cardDescription={course.name}
      />
    );
  });

  //and this display the courses
  return (
    <div className="m-10 grid grid-cols-3 gap-4">
      {courseElements}
      <CourseCreatorCard />
    </div>
  );
}
