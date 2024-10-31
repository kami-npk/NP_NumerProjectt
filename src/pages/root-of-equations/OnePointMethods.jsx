import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalculation } from './hooks/useOnePointCalculation';
import { EquationGraph } from './components/EquationGraph';
import { ErrorGraph } from './components/ErrorGraph';
import { IterationTable } from './components/IterationTable';
import { useToast } from "@/components/ui/use-toast";

const OnePointMethods = () => {
  const [equation, setEquation] = useState("x^2 - 4");
  const [initialX, setInitialX] = useState("0");
  const { result, iterations, graphData, errorData, calculateRoot } = useCalculation();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!equation || !initialX) return;
    calculateRoot(equation, initialX);
  };

  const formatResult = (value) => {
    if (value === null || !isFinite(value)) return "No solution found";
    return value.toPrecision(7);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">One-point Iteration Method</h1>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="equation">Equation f(x)</Label>
                <Input
                  id="equation"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="e.g., x^2 - 4"
                />
              </div>
              <div>
                <Label htmlFor="initialX">Initial X</Label>
                <Input
                  id="initialX"
                  type="number"
                  value={initialX}
                  onChange={(e) => setInitialX(e.target.value)}
                  placeholder="e.g., 0"
                />
              </div>
              <Button type="submit" className="w-full">Solve</Button>
              <Button 
                type="button"
                onClick={getRandomEquation} 
                variant="outline" 
                className="w-full"
              >
                Get Random Equation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {result !== null && (
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center font-semibold">Answer: {formatResult(result)}</p>
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
  );
};

export default OnePointMethods;
