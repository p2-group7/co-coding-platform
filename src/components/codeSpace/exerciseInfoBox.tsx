import React from 'react';

interface ExerciseProps {
  ExsTitle: string;
  ExsDescription: string;
}

const ExerciseInfoBox: React.FC<ExerciseProps> = ({ ExsTitle, ExsDescription }) => {
  return (
    <div className="container mx-auto md:w-1/3">
      <div className="border border-transparent rounded-lg p-4 mb-4 bg-secondary">
        <h2 className='font-bold'>{ExsTitle}</h2>
        <p>{ExsDescription}</p>
      </div>
    </div>
  );
};

export default ExerciseInfoBox;
