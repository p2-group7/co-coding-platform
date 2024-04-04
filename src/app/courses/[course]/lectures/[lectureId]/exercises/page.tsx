import React from "react";
import ExerciseInfoBox from "@/components/codeSpace/exerciseInfoBox";
import TestSuite from "@/components/codeSpace/testCase";

const App: React.FC = () => {
  return (
    <div>
      <div>
        <ExerciseInfoBox
          ExsTitle="Exercise 1: Hello World"
          ExsDescription="Write a program that prints 'Hello, World!' to the console."
        />
      </div>

    </div>
  );
};


export default App;
