import React from "react";
import { api } from "@/trpc/server";
import ExerciseInfoBox from "@/components/codeSpace/exerciseInfoBox";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

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
