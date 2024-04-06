import * as React from "react";
import { Combobox } from "@/components/ui/combobox";

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
      <div className="m-4 mb-4 h-full rounded-lg border border-transparent bg-secondary p-4">
        <Combobox /> {/* Render the Combobox component */}
        <h2 className="font-bold">{ExsTitle}</h2>
        <p>{ExsDescription}</p>
      </div>
    </div>
  );
};

export default ExerciseInfoBox;
