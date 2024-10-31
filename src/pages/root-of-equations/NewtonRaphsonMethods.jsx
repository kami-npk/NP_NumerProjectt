import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EquationGraph } from './components/EquationGraph';
import { ErrorGraph } from './components/ErrorGraph';
import { IterationTable } from './components/IterationTable';
import { diffEquation, error } from './components/CalculationUtils';
import { useToast } from "@/components/ui/use-toast";
import { evaluate } from 'mathjs';

const NewtonRaphsonMethods = () => {
  const [equation, setEquation] = useState("x^2 - 4");
  const [initialX, setInitialX] = useState("0");
  const [result, setResult] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const { toast } = useToast();

  const getRandomEquation = async () => {
    try {
      const response = await fetch('http://localhost:80/rootofequation.php');
      const data = await response.json();

      const filteredData = data.filter(item => 
        ["1", "2", "3"].includes(item.data_id)
      );

      if (filteredData.length > 0) {
        const randomEquation = filteredData[Math.floor(Math.random() * filteredData.length)];
        
        setEquation(randomEquation.fx);
        setInitialX(randomEquation.xl);
        
        toast({
          title: "Equation loaded",
          description: "Random equation has been loaded successfully.",
        });
      }
    } catch (error) {
      console.error('Error fetching random equation:', error);
      toast({
        title: "Error",
        description: "Failed to fetch random equation.",
        variant: "destructive",
      });
    }
  };

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
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Input Equation f(x)</Label>
              <Input
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="e.g., x^2 - 4"
              />
            </div>
            <div className="space-y-2">
              <Label>Initial X</Label>
              <Input
                type="number"
                value={initialX}
                onChange={(e) => setInitialX(e.target.value)}
                placeholder="e.g., 0"
              />
            </div>
            <Button 
              onClick={getRandomEquation} 
              variant="outline" 
              className="w-full"
            >
              Get Random Equation
            </Button>
            <Button onClick={calculateRoot} className="w-full">
              Solve
            </Button>
          </CardContent>
        </Card>

        {result !== null && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center font-semibold">Answer: {result.toPrecision(7)}</p>
              </CardContent>
            </Card>

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
          </div>
        )}
      </div>
    </div>
  );
};

export default NewtonRaphsonMethods;
