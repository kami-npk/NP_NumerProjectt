import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SharedInputForm } from './components/SharedInputForm';
import { EquationGraph } from './components/EquationGraph';
import { ErrorGraph } from './components/ErrorGraph';
import { FalsePositionIterationTable } from './components/FalsePositionIterationTable';
import { getRandomEquation } from './utils/getRandomEquation';

const FalsePositionMethods = () => {
  const [equation, setEquation] = useState("x^2 - 4");
  const [xl, setXL] = useState("0");
  const [xr, setXR] = useState("3");
  const [result, setResult] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [errorData, setErrorData] = useState([]);

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

  const calculateFalsePosition = (e) => {
    e.preventDefault();
    let xm, fXm, fXr, fXl, ea;
    let iter = 0;
    const MAX_ITER = 50;
    const EPSILON = 0.000001;
    const newIterations = [];
    const newErrorData = [];
    let xlNum = parseFloat(xl);
    let xrNum = parseFloat(xr);

    do {
      fXl = evaluate(equation, { x: xlNum });
      fXr = evaluate(equation, { x: xrNum });
      xm = ((xlNum * fXr) - (xrNum * fXl)) / (fXr - fXl);
      fXm = evaluate(equation, { x: xm });

      iter++;
      if (fXm * fXr > 0) {
        ea = error(xrNum, xm);
        newIterations.push({ iteration: iter, xl: xlNum, xm, xr: xrNum, error: ea });
        newErrorData.push({ iteration: iter, error: ea });
        xrNum = xm;
      } else if (fXm * fXr < 0) {
        ea = error(xlNum, xm);
        newIterations.push({ iteration: iter, xl: xlNum, xm, xr: xrNum, error: ea });
        newErrorData.push({ iteration: iter, error: ea });
        xlNum = xm;
      }
    } while (ea > EPSILON && iter < MAX_ITER);

    setResult(xm);
    setIterations(newIterations);
    setErrorData(newErrorData);

    // Generate equation graph data
    const graphData = [];
    const step = (parseFloat(xr) - parseFloat(xl)) / 100;
    for (let x = parseFloat(xl); x <= parseFloat(xr); x += step) {
      graphData.push({
        x: x,
        y: evaluate(equation, { x: x })
      });
    }
    setGraphData(graphData);
  };

  const additionalInputs = (
    <>
      <div className="space-y-2">
        <Label htmlFor="xl">X Left (XL)</Label>
        <Input
          id="xl"
          type="number"
          value={xl}
          onChange={(e) => setXL(e.target.value)}
          placeholder="e.g., 0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="xr">X Right (XR)</Label>
        <Input
          id="xr"
          type="number"
          value={xr}
          onChange={(e) => setXR(e.target.value)}
          placeholder="e.g., 3"
        />
      </div>
      <Button 
        onClick={() => getRandomEquation(setEquation, setXL, setXR)} 
        variant="outline" 
        className="w-full"
      >
        Get Random Equation
      </Button>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">False-position Method</h1>
      <div className="space-y-6">
        <SharedInputForm
          title="Input"
          equation={equation}
          onEquationChange={setEquation}
          onCalculate={calculateFalsePosition}
          result={result}
        >
          {additionalInputs}
        </SharedInputForm>

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
                <FalsePositionIterationTable data={iterations} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default FalsePositionMethods;