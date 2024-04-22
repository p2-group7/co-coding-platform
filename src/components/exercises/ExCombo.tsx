import React from "react";
import { api } from "@/trpc/server";
import { Combobox } from "../ui/combobox";
import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

type exercisesType = RouterOutput["exercise"]["getAllExercises"];

export type ExComboProps = {
  lectureId: number;
  selectedExerciseId: number;
};

const ExCombo: React.FC<ExComboProps> = ({ lectureId, selectedExerciseId }) => {
  let exercises = [] as exercisesType;
  // Fetch exercises belonging to the lecture
  async function fetchExercises() {
    try {
      // Call the API to fetch exercises by lectureId
      const fetchedExercises = await api.exercise.getAllExercises(lectureId);
      // Update the state with fetched exercises
      exercises = fetchedExercises;
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  }

  // Fetch exercises only if lectureId is provided
  if (lectureId) {
    fetchExercises().catch((error) => {
      console.error("Error fetching exercises:", error); // TODO handle error
    });
  }
  return (
    <div>
      <Combobox exercises={exercises} selected={selectedExerciseId} />
    </div>
  );
};

export default ExCombo;
