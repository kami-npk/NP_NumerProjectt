import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SharedInputForm } from './components/SharedInputForm';
import { EquationGraph } from './components/EquationGraph';
import { ErrorGraph } from './components/ErrorGraph';
import { BisectionIterationTable } from './components/BisectionIterationTable';
import { useToast } from "@/components/ui/use-toast";

const BisectionMethods = () => {
  const [equation, setEquation] = useState("x^2 - 4");
  const [xl, setXL] = useState("0");
  const [xr, setXR] = useState("3");
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
        setXL(randomEquation.xl);
        setXR(randomEquation.xr);
        
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

  const calculateBisection = (e) => {
    e.preventDefault();
    let xm, fXm, fXr, ea;
    let iter = 0;
    const MAX_ITER = 50;
    const EPSILON = 0.000001;
    const newIterations = [];
    const newErrorData = [];
    let xlNum = parseFloat(xl);
    let xrNum = parseFloat(xr);

    do {
      xm = (xlNum + xrNum) / 2.0;
      fXr = evaluate(equation.replace(/−/g, '-'), { x: xrNum });
      fXm = evaluate(equation.replace(/−/g, '-'), { x: xm });

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
        y: evaluate(equation.replace(/−/g, '-'), { x: x })
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
        onClick={getRandomEquation} 
        variant="outline" 
        className="w-full"
      >
        Get Random Equation
      </Button>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Bisection Method</h1>
      <div className="space-y-6">
        <SharedInputForm
          title="Input"
          equation={equation}
          onEquationChange={setEquation}
          onCalculate={calculateBisection}
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
                <BisectionIterationTable data={iterations} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default BisectionMethods;
