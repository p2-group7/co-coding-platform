import CourseCard from "@/components/course/CourseCard";
import { api } from "@/trpc/server";
import React from "react";
import CreateLectureCard from "@/components/course/CreateLectureCard";


export default async function page({ params }: { params: { course: string } }) {
  const course = await api.course.getCourse({ id: Number(params.course) });
  if (course === null) {
    return "You dont have access to this";
  }

  const lectures = await api.lecture.getAll(course.id);

  const lectureElements = lectures.map(function (lecture) {
    return (
      <CourseCard
        key={lecture.id}
        id={lecture.id}
        nameShort={lecture.name}
        name={lecture.description ?? "N/A"}
      />
    );
  });

  return (
    <div>
      <h1 className="pb-5 text-6xl">{course?.name}</h1>
      <p className="text-white-700 rounded-lg border-2 border-secondary bg-secondary bg-gradient-to-b from-muted/50 to-muted p-6 text-lg no-underline outline-none focus:shadow-md">
        {course?.description}
      </p>
      <br></br>
      <h1 className="pt-10 text-5xl">Course Lectures</h1>
      <div 
        className="m-10 grid grid-cols-5 gap-4">{lectureElements}
        <CreateLectureCard />
      </div>
    </div>
  );
}
