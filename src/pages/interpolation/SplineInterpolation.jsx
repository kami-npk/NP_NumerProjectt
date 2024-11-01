import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SplinePointsTable } from './components/SplinePointsTable';
import { SplineSolutionTable } from './components/SplineSolutionTable';
import { useToast } from "@/components/ui/use-toast";
import katex from 'katex';
import 'katex/dist/katex.min.css';

const SplineInterpolation = () => {
  const [findX, setFindX] = useState(4.5);
  const [pointsAmount, setPointsAmount] = useState(5);
  const [selectedPolynomial, setSelectedPolynomial] = useState("1");
  const [points, setPoints] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [result, setResult] = useState(null);
  const [splineEquation, setSplineEquation] = useState("");
  const [answerEquation, setAnswerEquation] = useState("");

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

  useEffect(() => {
    setPoints(Array(pointsAmount).fill().map(() => ({ x: 0, fx: 0 })));
    setSelectedPoints(Array(pointsAmount).fill(false));
  }, [pointsAmount]);

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

  const calculateSpline = () => {
    const selectedData = points.filter((_, i) => selectedPoints[i]);
    if (selectedData.length < 2) {
      alert("Please select at least two points");
      return;
    }

    const xValues = selectedData.map(p => p.x);
    const fValues = selectedData.map(p => p.fx);
    let interpolatedValue;
    let equation = "";
    let answerEq = "";

    // Linear Spline calculation
    if (selectedPolynomial === "1") {
      for (let i = 0; i < xValues.length - 1; i++) {
        const x0 = xValues[i];
        const x1 = xValues[i + 1];
        const f0 = fValues[i];
        const f1 = fValues[i + 1];
        const slope = (f1 - f0) / (x1 - x0);
        
        equation += `f_{${i}}(x) = ${f0} + (${slope})(x - ${x0}); \\ ${x0} \\leq x \\leq ${x1} \\\\ `;

        if (x0 <= findX && findX <= x1) {
          interpolatedValue = f0 + (findX - x0) * slope;
          answerEq = `f(${findX}) = ${interpolatedValue}`;
        }
      }
    } 
    else if (selectedPolynomial === "2") { // Quadratic Spline
      const n = selectedData.length;
      const h = Array(n - 1).fill(0);
      const a = Array(n - 1).fill(0);
      const b = Array(n - 1).fill(0);
      const c = Array(n - 1).fill(0);

      // Calculate h values and a coefficients
      for (let i = 0; i < n - 1; i++) {
        h[i] = xValues[i + 1] - xValues[i];
        a[i] = fValues[i];
      }

      // Calculate b and c coefficients
      for (let i = 0; i < n - 1; i++) {
        b[i] = (fValues[i + 1] - fValues[i]) / h[i];
        if (i < n - 2) {
          c[i + 1] = (b[i + 1] - b[i]) / (2 * h[i]);
        }
      }

      // Generate polynomial string and calculate interpolated value
      for (let i = 0; i < n - 1; i++) {
        const x0 = xValues[i];
        const x1 = xValues[i + 1];
        
        equation += `f_{${i}}(x) = ${a[i].toFixed(4)} + ${b[i].toFixed(4)}(x - ${x0}) + ${c[i].toFixed(4)}(x - ${x0})^2; \\ ${x0} \\leq x \\leq ${x1} \\\\ `;

        if (x0 <= findX && findX <= x1) {
          const dx = findX - x0;
          interpolatedValue = a[i] + b[i] * dx + c[i] * dx * dx;
          answerEq = `f(${findX}) = ${interpolatedValue.toFixed(4)}`;
        }
      }
    }
    else if (selectedPolynomial === "3") { // Cubic Spline
      const n = selectedData.length;
      const h = Array(n - 1).fill(0);
      const alpha = Array(n - 1).fill(0);
      const l = Array(n).fill(0);
      const mu = Array(n - 1).fill(0);
      const z = Array(n).fill(0);
      const c = Array(n).fill(0);
      const b = Array(n - 1).fill(0);
      const d = Array(n - 1).fill(0);

      // Step 1: Calculate h and alpha
      for (let i = 0; i < n - 1; i++) {
        h[i] = xValues[i + 1] - xValues[i];
        alpha[i] = 3 * (fValues[i + 1] - fValues[i]) / h[i] - 3 * (i > 0 ? (fValues[i] - fValues[i - 1]) / h[i - 1] : 0);
      }

      // Step 2: Calculate l, mu, and z
      l[0] = 1;
      for (let i = 1; i < n - 1; i++) {
        l[i] = 2 * (h[i - 1] + h[i]) - h[i - 1] * mu[i - 1];
        mu[i] = h[i] / l[i];
        z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
      }

      // Step 3: Calculate coefficients
      for (let j = n - 2; j >= 0; j--) {
        c[j] = z[j] - mu[j] * c[j + 1];
        b[j] = (fValues[j + 1] - fValues[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
        d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
      }

      // Generate polynomial string and calculate interpolated value
      for (let i = 0; i < n - 1; i++) {
        const x0 = xValues[i];
        const x1 = xValues[i + 1];
        
        equation += `f_{${i}}(x) = ${fValues[i].toFixed(4)} + ${b[i].toFixed(4)}(x - ${x0}) + ${c[i].toFixed(4)}(x - ${x0})^2 + ${d[i].toFixed(4)}(x - ${x0})^3; \\ ${x0} \\leq x \\leq ${x1} \\\\ `;

        if (x0 <= findX && findX <= x1) {
          const dx = findX - x0;
          interpolatedValue = fValues[i] + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx;
          answerEq = `f(${findX}) = ${interpolatedValue.toFixed(4)}`;
        }
      }
    }

    const renderedEquation = katex.renderToString(equation, {
      throwOnError: false,
    });

    const renderedAnswer = katex.renderToString(answerEq, {
      throwOnError: false,
    });

    setSplineEquation(renderedEquation);
    setAnswerEquation(renderedAnswer);
    setResult(interpolatedValue);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Spline Interpolation</h1>
      
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
                <Label>Select Solution:</Label>
                <Select value={selectedPolynomial} onValueChange={setSelectedPolynomial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select spline type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Linear</SelectItem>
                    <SelectItem value="2">Quadratic</SelectItem>
                    <SelectItem value="3">Cubic</SelectItem>
                  </SelectContent>
                </Select>
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

            <SplinePointsTable
              points={points}
              selectedPoints={selectedPoints}
              onPointChange={handlePointChange}
              onSelectionChange={handleSelectionChange}
            />

            <Button onClick={calculateSpline} className="w-full">
              Calculate
            </Button>
          </CardContent>
        </Card>

        {result !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SplineSolutionTable points={points.filter((_, i) => selectedPoints[i])} />

              <div>
                <h3 className="text-lg font-semibold mb-2">Spline Equation</h3>
                <div dangerouslySetInnerHTML={{ __html: splineEquation }} />
              </div>

              <div className="text-center">
                <div dangerouslySetInnerHTML={{ __html: answerEquation }} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SplineInterpolation;
