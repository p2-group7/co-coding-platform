import React from 'react';

interface ExerciseProps {
  ExsTitle: string;
  ExsDescription: string;
}

const ExerciseInfoBox: React.FC<ExerciseProps> = ({ ExsTitle, ExsDescription }) => {
  return (
    <div className="exercise">
      <h2>{ExsTitle}</h2>
      <p>{ExsDescription}</p>
    </div>
  );
};

export default ExerciseInfoBox;
