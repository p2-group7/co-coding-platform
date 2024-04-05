"use client";

import * as React from "react";

export type ExerciseProps = {
  ExsTitle: string;
  ExsDescription: string;
};

const ExerciseInfoBox: React.FC<ExerciseProps> = ({
  ExsTitle,
  ExsDescription,
}) => {
  return (
    <div className="container mx-auto h-full md:w-1/3">
      <div className="m-4 mb-4 h-full rounded-lg border border-transparent bg-secondary p-4">
        <h2 className="font-bold">{ExsTitle}</h2>
        <p>{ExsDescription}</p>
      </div>
    </div>
  );
};

export default ExerciseInfoBox;
