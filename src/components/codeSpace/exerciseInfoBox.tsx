"use client";

import * as React from "react";

interface ExerciseProps {
  ExsTitle: string;
  ExsDescription: string;
}

const ExerciseInfoBox: React.FC<ExerciseProps> = ({
  ExsTitle,
  ExsDescription,
}) => {
  return (
    <div className="container mx-auto md:w-1/3">
      <div className="mb-4 rounded-lg border border-transparent bg-secondary p-4">
        <h2 className="font-bold">{ExsTitle}</h2>
        <p>{ExsDescription}</p>
      </div>
    </div>
  );
};

export default ExerciseInfoBox;
