import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { evaluate, derivative } from 'mathjs';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { forwardCalculate, backwardCalculate, centerCalculate } from './components/DifferentiationCalculations';
import { SolutionDisplay } from './components/SolutionDisplay';
import { useToast } from "@/components/ui/use-toast";
import { fetchRandomEquation } from './utils/differentiationUtils';

const NumericalDifferentiation = () => {
  const [equation, setEquation] = useState("");
  const [x, setX] = useState("");
  const [h, setH] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("1");
  const [selectedDirection, setSelectedDirection] = useState("1");
  const [solution, setSolution] = useState(null);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const f = (x) => {
    return evaluate(equation, { x });
  };

  const getRandomEquation = async () => {
    try {
      const data = await fetchRandomEquation();
      setEquation(data['f(x)']);
      setX(data.a);
      setH("0.1");
      
      toast({
        title: "Success",
        description: "Random equation loaded successfully",
      });
    } catch (error) {
      console.error('Error fetching random equation:', error);
      toast({
        title: "Error",
        description: "Failed to fetch random equation",
        variant: "destructive",
      });
    }
  };

  const calculateDifferentiation = () => {
    if (!equation || !x || !h) return;

    const xNum = parseFloat(x);
    const hNum = parseFloat(h);
    let titleLatex = '';
    let method;

    // Set title based on order
    titleLatex = ["First", "Second", "Third", "Fourth"][parseInt(selectedOrder) - 1] + " ";

    // Set method and complete title based on direction
    switch (selectedDirection) {
      case "1":
        titleLatex += "Forward Divided-Differences ; O(h)";
        method = forwardCalculate;
        break;
      case "2":
        titleLatex += "Backward Divided-Differences ; O(h)";
        method = backwardCalculate;
        break;
      case "3":
        titleLatex += "Central Divided-Differences ; O(h^2)";
        method = centerCalculate;
        break;
      default:
        return;
    }

    // Calculate numerical result
    const { result: numericalResult, formula } = method(f, xNum, hNum, selectedOrder);
    
    // Calculate exact derivatives and build latex string
    let diffEquation = equation;
    let exactDiffLatex = `Exact\\ Differentiation\\ of\\ f(x) = ${equation}\\\\`;
    let symbol = "'";
    
    for (let i = 1; i <= parseInt(selectedOrder); i++) {
      diffEquation = derivative(diffEquation, 'x').toString();
      exactDiffLatex += `f${symbol}(x) = ${diffEquation}\\\\`;
      symbol += "'";
    }

    // Calculate exact value and add to latex
    const exactValue = evaluate(diffEquation, { x: xNum });
    exactDiffLatex += `At\\ x = ${xNum}\\ ;\\ f${symbol}(${xNum}) = ${exactValue}\\\\`;
    exactDiffLatex += `f${symbol}(${xNum}) = ${numericalResult}`;

    // Calculate and format error with correct derivative notation
    const error = Math.abs((numericalResult - exactValue) / exactValue) * 100;
    
    // Get the correct derivative notation for the error formula based on order
    let derivativeNotation = '';
    for (let i = 0; i < parseInt(selectedOrder); i++) {
      derivativeNotation += "'";
    }
    
    const errorLatex = `\\displaystyle e = \\left|\\frac{f${derivativeNotation}(x)_{numerical} - f${derivativeNotation}(x)_{true}}{f${derivativeNotation}(x)_{true}}\\right| \\times 100\\% = ${error.toFixed(4)}\\%`;

    // Combine all latex parts
    const solutionLatex = `
      ${titleLatex}\\\\
      ${formula}\\\\
      ${exactDiffLatex}\\\\
      ${errorLatex}
    `;

    // Render solution
    const renderedSolution = katex.renderToString(solutionLatex, {
      displayMode: true,
      throwOnError: false,
    });

    setSolution(renderedSolution);
    setResult(numericalResult);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Numerical Differentiation</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="max-w-md mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Order</Label>
                  <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">First</SelectItem>
                      <SelectItem value="2">Second</SelectItem>
                      <SelectItem value="3">Third</SelectItem>
                      <SelectItem value="4">Fourth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Direction</Label>
                  <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Forward</SelectItem>
                      <SelectItem value="2">Backward</SelectItem>
                      <SelectItem value="3">Central</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Input Equation f(x)</Label>
                <Input
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="e.g., x^2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Input x</Label>
                  <Input
                    type="number"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Input h</Label>
                  <Input
                    type="number"
                    value={h}
                    onChange={(e) => setH(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={getRandomEquation} 
                variant="outline" 
                className="w-full"
              >
                Get Random Equation
              </Button>

              <Button onClick={calculateDifferentiation} className="w-full">
                Solve
              </Button>

              {result !== null && (
                <div className="text-center font-semibold">
                  Result: {result}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <SolutionDisplay solution={solution} />
      </div>
    </div>
  );
};

export default NumericalDifferentiation;
