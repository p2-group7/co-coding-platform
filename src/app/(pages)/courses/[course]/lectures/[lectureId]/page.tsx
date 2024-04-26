import React from "react";
import InfoCard from "@/components/course/InfoCard";
import { api } from "@/trpc/server";
import CreateExerciseCard from "@/components/course/CreateExerciseCard";

export default async function page({
  params,
}: {
  params: { lectureId: string };
}) {
  const lecture = await api.lecture.getLecture({
    id: Number(params.lectureId),
  });
  if (lecture === null) {
    return "You dont have access to this";
  }

  const exercises = await api.exercise.getAllExercises(lecture.id);

  const exerciseElements = exercises.map(function (exercise) {
    const hrefString = //look at this database bc exercise dont got course info
      /*"/courses/" + course.id.toString()*/ +"/lectures/" +
      lecture.id.toString() +
      "/exercises/" +
      exercise.id.toString();
    return (
      <InfoCard
        key={exercise.id}
        href={hrefString}
        cardTitle={exercise.name}
        cardDescription= {exercise.description ?? "N/A"}
      />
    );
  });

  return (
    <div className="container mx-auto px-1">
      <h1 className="mt-6 pb-5 text-6xl">{lecture?.name}</h1>
      <p className="text-white-700 rounded-lg border-2 border-secondary bg-secondary bg-gradient-to-b from-muted/50 to-muted p-6 text-lg no-underline outline-none focus:shadow-md">
        {lecture?.description}
      </p>
      <br></br>
      <h1 className="pt-10 text-5xl">Exercises</h1>
      <div className="m-10 grid grid-cols-5 gap-4">
        {exerciseElements}
        <CreateExerciseCard lecture={lecture.id} />
      </div>
    </div>
  );
}
