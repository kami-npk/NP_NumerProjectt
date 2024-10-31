import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SharedInputForm } from './components/SharedInputForm';
import { EquationGraph } from './components/EquationGraph';
import { ErrorGraph } from './components/ErrorGraph';
import { IterationTable } from './components/IterationTable';
import { useToast } from "@/components/ui/use-toast";

const GraphicalMethods = () => {
  const [equation, setEquation] = useState("");
  const [xStart, setXStart] = useState("");
  const [xEnd, setXEnd] = useState("");
  const [result, setResult] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const { toast } = useToast();

  const getRandomEquation = async () => {
    try {
      const response = await fetch('http://localhost/rootofequation.php');
      const data = await response.json();

      // Filter to get only the required IDs
      const filteredData = data.filter(item => 
        ["1", "2", "3"].includes(item.data_id)
      );

      // Select a random equation
      if (filteredData.length > 0) {
        const randomEquation = filteredData[Math.floor(Math.random() * filteredData.length)];
        
        // Set the values directly from the API response
        setEquation(randomEquation.fx);
        setXStart(randomEquation.xl);
        setXEnd(randomEquation.xr);
        
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

  const calculateRoot = (e) => {
    e.preventDefault();
    const xStartNum = parseFloat(xStart);
    const xEndNum = parseFloat(xEnd);
    const step = (xEndNum - xStartNum) / 100;
    const newGraphData = [];
    const newIterations = [];
    const newErrorData = [];
    let minY = Infinity;
    let minX = xStartNum;
    let iter = 0;

    try {
      for (let x = xStartNum; x <= xEndNum; x += step) {
        const y = evaluate(equation, { x });
        newGraphData.push({ x, y });
        
        const absY = Math.abs(y);
        if (absY < Math.abs(minY)) {
          minY = y;
          minX = x;
        }

        iter++;
        const error = absY;
        newIterations.push({ iteration: iter, x, error });
        newErrorData.push({ iteration: iter, error });
      }

      setResult(minX);
      setGraphData(newGraphData);
      setIterations(newIterations);
      setErrorData(newErrorData);

      toast({
        title: "Calculation complete",
        description: "Root found successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate root. Please check your equation.",
        variant: "destructive",
      });
    }
  };

  const additionalInputs = (
    <>
      <div className="space-y-2">
        <Label htmlFor="xStart">X Start</Label>
        <Input
          id="xStart"
          type="number"
          value={xStart}
          onChange={(e) => setXStart(e.target.value)}
          placeholder="Enter X start"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="xEnd">X End</Label>
        <Input
          id="xEnd"
          type="number"
          value={xEnd}
          onChange={(e) => setXEnd(e.target.value)}
          placeholder="Enter X end"
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
      <h1 className="text-3xl font-bold mb-6 text-center">Graphical Method</h1>
      <div className="space-y-6">
        <SharedInputForm
          title="Input"
          equation={equation}
          onEquationChange={setEquation}
          onCalculate={calculateRoot}
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
                <IterationTable data={iterations} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default GraphicalMethods;