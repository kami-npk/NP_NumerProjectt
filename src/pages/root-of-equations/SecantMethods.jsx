import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SharedInputForm } from './components/SharedInputForm';
import { EquationGraph } from './components/EquationGraph';
import { ErrorGraph } from './components/ErrorGraph';
import { SecantIterationTable } from './components/SecantIterationTable';
import { useToast } from "@/components/ui/use-toast";

const SecantMethods = () => {
  const [equation, setEquation] = useState("x^2 - 4");
  const [x0, setX0] = useState("0");
  const [x1, setX1] = useState("1");
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
        setX0(randomEquation.xl);
        setX1(randomEquation.xr);
        
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

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

  const calculateRoot = () => {
    const x0Num = parseFloat(x0);
    const x1Num = parseFloat(x1);
    const newIterations = [];
    const newGraphData = [];
    const newErrorData = [];
    
    let xOld = x0Num;
    let xNew = x1Num;
    let iter = 0;
    const MAX_ITER = 50;
    const EPSILON = 0.000001;

    try {
      // Add initial values as first iteration
      newIterations.push({
        iteration: iter,
        xold: x0Num,
        xnew: x1Num,
        error: 100 // Initial error
      });

      do {
        const fXold = evaluate(equation, { x: xOld });
        const fXnew = evaluate(equation, { x: xNew });
        
        const x = xNew - (fXnew * (xOld - xNew)) / (fXold - fXnew);
        const currentError = error(xNew, x);
        
        iter++;
        newIterations.push({
          iteration: iter,
          xold: xNew, // Previous xNew becomes xOld
          xnew: x,    // New x becomes xNew
          error: currentError
        });
        
        newErrorData.push({ iteration: iter, error: currentError });
        
        if (Math.abs(x - xNew) < EPSILON || iter >= MAX_ITER) {
          setResult(x);
          break;
        }
        
        xOld = xNew;
        xNew = x;
      } while (true);

      // Generate graph data
      const step = (parseFloat(x1) - parseFloat(x0)) / 100;
      for (let x = parseFloat(x0); x <= parseFloat(x1); x += step) {
        try {
          const y = evaluate(equation, { x });
          newGraphData.push({ x, y });
        } catch (error) {
          console.error('Error evaluating equation:', error);
        }
      }

      setIterations(newIterations);
      setGraphData(newGraphData);
      setErrorData(newErrorData);
    } catch (error) {
      console.error('Error in calculation:', error);
    }
  };

  const additionalInputs = (
    <>
      <div className="space-y-2">
        <Label htmlFor="x0">X₀ (first initial value)</Label>
        <Input
          id="x0"
          type="number"
          value={x0}
          onChange={(e) => setX0(e.target.value)}
          placeholder="e.g., 0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="x1">X₁ (second initial value)</Label>
        <Input
          id="x1"
          type="number"
          value={x1}
          onChange={(e) => setX1(e.target.value)}
          placeholder="e.g., 1"
        />
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Secant Method</h1>
      <div className="space-y-6">
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
            {additionalInputs}
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
          <>
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
                <SecantIterationTable data={iterations} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SecantMethods;
