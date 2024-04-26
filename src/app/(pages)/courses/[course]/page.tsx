import InfoCard from "@/components/course/InfoCard";
import { api } from "@/trpc/server";
import React from "react";
import CreateLectureCard from "@/components/course/CreateLectureCard";

//This code will make sure we get the right course(by ID)
export default async function page({ params }: { params: { course: string } }) {
  const course = await api.course.getCourse({ id: Number(params.course) });
  if (course === null) {
    return "You dont have access to this";
  }

  //This code gets all lectures that are below a spesific course
  const lectures = await api.lecture.getAll(course.id);
  const lectureElements = lectures.map(function (lecture) {
    const hrefString =
      "/courses/" + course.id.toString() + "/lectures/" + lecture.id.toString();
    return (
      <InfoCard
        key={lecture.id}
        href={hrefString}
        cardTitle={lecture.name}
        cardDescription={lecture.description ?? "N/A"}
      />
    );
  });

  return (
    <div className="container mx-auto px-1">
      <h1 className="mt-6 pb-5 text-6xl">{course?.name}</h1>
      <p className="text-white-700 rounded-lg border-2 border-secondary bg-secondary bg-gradient-to-b from-muted/50 to-muted p-6 text-lg no-underline outline-none focus:shadow-md">
        {course?.description}
      </p>
      <br></br>
      <h1 className="pt-10 text-5xl">Course Lectures</h1>
      <div className="m-10 grid grid-cols-5 gap-4">
        {lectureElements}
        <CreateLectureCard course={course.id} />
      </div>
    </div>
  );
}
