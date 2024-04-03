import React from "react";
import ExerciseBox from "@/components/codeSpace/exerciseInfoBox";

const App: React.FC = () => {
  return (
    <div>
      <div
        className="container mx-auto px-1"
        style={{ width: "300px", height: "300px" }}
      >
        <h1>Programming Exercises</h1>
        <ExerciseBox
          ExsTitle="Exercise 1: Hello World"
          ExsDescription="Write a program that prints 'Hello, World!' to the console."
        />
      </div>
    </div>
  );
};

export default App;
