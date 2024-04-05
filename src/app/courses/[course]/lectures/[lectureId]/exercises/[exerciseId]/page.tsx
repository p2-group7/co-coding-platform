import React from "react";
import { api } from "@/trpc/server";
import ExerciseInfoBox from "@/components/codeSpace/exerciseInfoBox";
import type { ExerciseProps } from "@/components/codeSpace/exerciseInfoBox";

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
    <div>
      <div className="bg:black h-screen">
        <ExerciseInfoBox
          ExsTitle={exercise.name}
          ExsDescription={exercise.description ?? "No description"}
        />
      </div>
    </div>
  );
}
