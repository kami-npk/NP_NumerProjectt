import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputForm } from './components/InputForm';
import { EquationGraph } from './components/EquationGraph';
import { ErrorGraph } from './components/ErrorGraph';
import { IterationTable } from './components/IterationTable';
import { diffEquation, error } from './components/CalculationUtils';
import { getRandomEquation } from './utils/getRandomEquation';

const NewtonRaphsonMethods = () => {
  const [equation, setEquation] = useState("x^2 - 4");
  const [initialX, setInitialX] = useState("0");
  const [result, setResult] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [errorData, setErrorData] = useState([]);

  const calculateRoot = () => {
    let x = parseFloat(initialX);
    let iter = 0;
    const MAX_ITER = 50;
    const EPSILON = 0.000001;
    const newIterations = [];
    const newErrorData = [];

    do {
      const xNew = x - (evaluate(equation, { x }) / evaluate(diffEquation(equation), { x }));
      const ea = error(x, xNew);
      
      iter++;
      newIterations.push({ iteration: iter, x: xNew, error: ea });
      newErrorData.push({ iteration: iter, error: ea });
      
      if (ea < EPSILON) {
        setResult(xNew);
        break;
      }
      
      x = xNew;
    } while (iter < MAX_ITER);

    setIterations(newIterations);
    setErrorData(newErrorData);

    // Generate equation graph data
    const graphData = [];
    const step = 0.1;
    for (let x = -5; x <= 5; x += step) {
      try {
        const y = evaluate(equation, { x });
        graphData.push({ x, y });
      } catch (error) {
        console.error('Error evaluating equation:', error);
      }
    }
    setGraphData(graphData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Newton-Raphson Method</h1>
      <div className="space-y-6">
        <InputForm
          equation={equation}
          initialX={initialX}
          onEquationChange={setEquation}
          onInitialXChange={setInitialX}
          onCalculate={calculateRoot}
          result={result}
          additionalButtons={
            <Button 
              onClick={() => getRandomEquation(setEquation)} 
              variant="outline" 
              className="w-full"
            >
              Get Random Equation
            </Button>
          }
        />

        {result !== null && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Equation Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <EquationGraph data={graphData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <ErrorGraph data={errorData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Iteration Table</CardTitle>
              </CardHeader>
              <CardContent>
                <IterationTable data={iterations} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default NewtonRaphsonMethods;