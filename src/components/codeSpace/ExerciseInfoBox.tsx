import * as React from "react";
import { Button } from "../ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import ExCombo from "../exercises/ExCombo";
export type ExerciseProps = {
  ExsTitle: string;
  ExsDescription: string;
  ExsLectureId: number;
  ExsExerciseId: number;
};

const ExerciseInfoBox: React.FC<ExerciseProps> = ({
  ExsTitle,
  ExsDescription,
  ExsLectureId,
}) => {
  const formattedDescription = ExsDescription.replaceAll("\\n", "<br>");
  return (
    <div className="h-full w-full">
      <div className="flex h-full flex-col rounded-lg border border-transparent bg-secondary p-4">
        <div className="mb-4 flex items-start">
          <ExCombo lectureId={ExsLectureId} selectedExerciseName={ExsTitle} />
          <Button className="mx-5 bg-black">
            <Pencil1Icon className="text-white" />
          </Button>
        </div>
        <h2 className="font-bold">{ExsTitle}</h2>
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formattedDescription }}
        ></div>
      </div>
    </div>
  );
};

export default ExerciseInfoBox;
