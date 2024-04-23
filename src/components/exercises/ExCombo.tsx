import React from "react";
import { api } from "@/trpc/server";
import { Combobox } from "../ui/combobox";
import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

type exercisesType = RouterOutput["exercise"]["getAllExercises"];

export type ExComboProps = {
  lectureId: number;
  selectedExerciseName: string;
};

async function ExCombo({ lectureId, selectedExerciseName }: ExComboProps) {
  let exercises: exercisesType = [];
  // Fetch exercises belonging to the lecture
  try {
    // Call the API to fetch exercises by lectureId
    const fetchedExercises = await api.exercise.getAllExercises(lectureId);
    // Update the state with fetched exercises
    exercises = fetchedExercises;
    console.log(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
  }

  return (
    <div>
      <Combobox exercises={exercises} selected={selectedExerciseName} />
    </div>
  );
}

export default ExCombo;
