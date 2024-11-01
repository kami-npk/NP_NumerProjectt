import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PointsTable } from './components/PointsTable';
import { useToast } from "@/components/ui/use-toast";
import { LagrangeSolutionDisplay } from './components/LagrangeSolutionDisplay';
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

  const calculateLagrange = () => {
    const selectedData = points.filter((_, i) => selectedPoints[i]);
    if (selectedData.length < 2) {
      alert("Please select at least 2 points");
      return;
    }

    let result = 0;
    let equations = [];
    let finalEquation = `f(${findX}) = `;
    let terms = [];

    // Calculate each L term
    for (let i = 0; i < selectedData.length; i++) {
      let numerator = '';
      let denominator = '';
      let termValue = 1;

      for (let j = 0; j < selectedData.length; j++) {
        if (i !== j) {
          // Calculate the actual value
          termValue *= (findX - selectedData[j].x) / (selectedData[i].x - selectedData[j].x);

          // Build the equation strings
          numerator += `(x_${j} - x)`;
          denominator += `(x_${j} - x_${i})`;
        }
      }

      // Store the term value for final calculation
      terms.push(termValue);
      result += termValue * selectedData[i].fx;

      // Create the LaTeX equation for this L term
      const lEquation = `L_${i} = \\frac{${numerator}}{${denominator}} = \\frac{`;

      // Add the numerical values
      let numValues = '';
      let denValues = '';
      for (let j = 0; j < selectedData.length; j++) {
        if (i !== j) {
          numValues += `(${selectedData[j].x}-${findX})`;
          denValues += `(${selectedData[j].x}-${selectedData[i].x})`;
        }
      }

      equations.push(katex.renderToString(
        `${lEquation}${numValues}}{${denValues}} = ${termValue.toFixed(6)}`,
        { displayMode: true }
      ));
    }

    // Build the final equation
    let finalCalc = 'f(' + findX + ')=';
    for (let i = 0; i < selectedData.length; i++) {
      finalCalc += `(${terms[i].toFixed(6)})(${selectedData[i].fx})`;
      if (i < selectedData.length - 1) finalCalc += '+';
    }
    finalCalc += `=${result.toFixed(6)}`;

    const renderedFinalEq = katex.renderToString(finalCalc, { displayMode: true });

    setEquation(equations.join(''));
    setAnswerEquation(renderedFinalEq);
    setResult(result);
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lagrange Interpolation</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="max-w-md mx-auto">
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
            </CardContent>
          </Card>
        </div>

        {result !== null && (
          <LagrangeSolutionDisplay 
            equation={equation}
            answerEquation={answerEquation}
          />
        )}
      </div>
    </div>
  );
};

export default LagrangeInterpolation;
