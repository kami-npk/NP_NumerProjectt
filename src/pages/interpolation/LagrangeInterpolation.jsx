import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PointsTable } from './components/PointsTable';
import { useToast } from "@/components/ui/use-toast";
import katex from 'katex';
import 'katex/dist/katex.min.css';

const LagrangeInterpolation = () => {
  const [findX, setFindX] = useState(0);
  const [pointsAmount, setPointsAmount] = useState(5);
  const [points, setPoints] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [result, setResult] = useState(null);
  const [equation, setEquation] = useState("");
  const [answerEquation, setAnswerEquation] = useState("");
  const { toast } = useToast();

  // Initialize points array when pointsAmount changes
  useEffect(() => {
    setPoints(Array(pointsAmount).fill().map(() => ({ x: 0, fx: 0 })));
    setSelectedPoints(Array(pointsAmount).fill(false));
  }, [pointsAmount]);

  const getRandomEquation = async () => {
    try {
      const response = await fetch('http://localhost:80/interpolation.php');
      const data = await response.json();
      
      const randomIndex = Math.floor(Math.random() * data.length);
      const equation = data[randomIndex];
      
      // Create new points array from the random equation
      const newPoints = Array(5).fill().map((_, index) => ({
        x: parseFloat(equation[`${index + 1}x`]),
        fx: parseFloat(equation[`${index + 1}f(x)`])
      }));
      
      setPoints(newPoints);
      setSelectedPoints(Array(5).fill(true));
      setPointsAmount(5);
      setFindX(parseFloat(equation.find_x));
      
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

  const handlePointChange = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: parseFloat(value) || 0 };
    setPoints(newPoints);
  };

  const handleSelectionChange = (index) => {
    const newSelected = [...selectedPoints];
    newSelected[index] = !newSelected[index];
    setSelectedPoints(newSelected);
  };

  const calculateLagrange = () => {
    const selectedData = points.filter((_, i) => selectedPoints[i]);
    if (selectedData.length < 2) {
      alert("Please select at least 2 points");
      return;
    }

    let result = 0;
    let equation = "";

    for (let i = 0; i < selectedData.length; i++) {
      let term = 1;
      let Li = `L${i + 1}`;
      
      for (let j = 0; j < selectedData.length; j++) {
        if (i !== j) {
          term *= (findX - selectedData[j].x) / (selectedData[i].x - selectedData[j].x);
        }
      }
      
      result += term * selectedData[i].fx;
      equation += `${Li} = ${term.toFixed(4)}, `;
    }

    setResult(result);
    setEquation(equation.slice(0, -2));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lagrange Interpolation</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md space-y-2">
                <Label>Find f(x) where x is:</Label>
                <Input
                  type="number"
                  value={findX}
                  onChange={(e) => setFindX(parseFloat(e.target.value))}
                />
              </div>

              <div className="w-full max-w-md space-y-2">
                <Label>Points Amount:</Label>
                <Input
                  type="number"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(parseInt(e.target.value))}
                  min="2"
                />
              </div>

              <Button 
                onClick={getRandomEquation} 
                variant="outline" 
                className="w-full max-w-md"
              >
                Get Random Equation
              </Button>
            </div>

            <PointsTable
              points={points}
              selectedPoints={selectedPoints}
              onPointChange={handlePointChange}
              onSelectionChange={handleSelectionChange}
            />

            <Button onClick={calculateLagrange} className="w-full">
              Calculate
            </Button>

            {result !== null && (
              <div className="text-center font-semibold">
                Result: {typeof result === 'number' ? result.toFixed(4) : result}
              </div>
            )}
          </CardContent>
        </Card>

        {result !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-semibold mb-2">Interpolation Equation</div>
              <div>{equation}</div>
              <div className="text-lg font-semibold mb-2">Result</div>
              <div>{result !== null ? result.toFixed(4) : ''}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LagrangeInterpolation;
