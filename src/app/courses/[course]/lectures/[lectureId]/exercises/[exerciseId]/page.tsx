import React from "react";
import { api } from "@/trpc/server";
import ExerciseInfoBox from "@/components/codeSpace/exerciseInfoBox";
import ResizableDemo from "@/components/codeSpace/Resizable";


export default async function page({
  params,
}: {
  params: { exerciseId: string };
}) {
  const exercise = await api.exercise.getExercise({
    id: Number(params.exerciseId),
  });
  if (exercise === null) {
    return "You dont have access to this";
  }

  return (
    <div className="h-screen w-screen m-1">
      <ResizableDemo />
    </div>
  );
}
