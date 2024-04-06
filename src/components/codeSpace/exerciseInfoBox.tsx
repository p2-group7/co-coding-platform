import * as React from "react";
import { Combobox } from "../ui/combobox";
import { Button } from "../ui/button";

export type ExerciseProps = {
  ExsTitle: string;
  ExsDescription: string;
};

const ExerciseInfoBox: React.FC<ExerciseProps> = ({
  ExsTitle,
  ExsDescription,
}) => {
  return (
    <div className="h-full w-full md:w-1/3">
      <div className="m-4 mb-4 flex h-full flex-col rounded-lg border border-transparent bg-secondary p-4">
        <div className="mb-4 flex items-start">
          <Combobox />
          <Button className="mx-5 bg-black">✏️</Button>
        </div>
        <h2 className="font-bold">{ExsTitle}</h2>
        <p>{ExsDescription}</p>
      </div>
    </div>
  );
};

export default ExerciseInfoBox;
