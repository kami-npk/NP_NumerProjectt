import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PointsTable } from './components/PointsTable';
import { DividedDifferenceTable } from './components/DividedDifferenceTable';
import { useToast } from "@/components/ui/use-toast";
import katex from 'katex';
import 'katex/dist/katex.min.css';

const NewtonDividedDifference = () => {
  const [findX, setFindX] = useState(0);
  const [pointsAmount, setPointsAmount] = useState(5);
  const [points, setPoints] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [dividedDiffTable, setDividedDiffTable] = useState([]);
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

  const calculateDividedDifference = () => {
    const selectedData = points.filter((_, i) => selectedPoints[i]);
    if (selectedData.length < 2) {
      alert("Please select at least 2 points");
      return;
    }

    const n = selectedData.length;
    const table = Array(n).fill().map(() => Array(n).fill(0));

    // Fill first column with f(x) values
    for (let i = 0; i < n; i++) {
      table[i][0] = selectedData[i].fx;
    }

    // Calculate divided differences
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / 
                      (selectedData[i + j].x - selectedData[i].x);
      }
    }

    setDividedDiffTable(table);
    
    // Calculate result and equation
    let result = table[0][0];
    let term = 1;
    let eq = `f(x) = ${table[0][0].toFixed(4)}`;
    
    for (let i = 1; i < n; i++) {
      term *= (findX - selectedData[i - 1].x);
      result += table[0][i] * term;
      
      const coefficient = table[0][i].toFixed(4);
      eq += ` + (${coefficient})`;
      for (let j = 0; j < i; j++) {
        eq += `(x - ${selectedData[j].x})`;
      }
    }
    
    setResult(result);
    setEquation(eq);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Newton's Divided Difference</h1>
      
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

            <Button onClick={calculateDividedDifference} className="w-full">
              Calculate
            </Button>

            {result !== null && (
              <div className="text-center font-semibold">
                Result: {typeof result === 'number' ? result.toFixed(4) : result}
              </div>
            )}
          </CardContent>
        </Card>

        {dividedDiffTable.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-center">Divided Difference Table</h3>
                <DividedDifferenceTable 
                  dividedDiffTable={dividedDiffTable}
                  points={points}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-center">Interpolation Equation</h3>
                <div className="p-4 bg-muted rounded-lg text-center">
                  {equation}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewtonDividedDifference;
