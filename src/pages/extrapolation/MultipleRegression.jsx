import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MultipleRegressionTable } from './components/MultipleRegressionTable';
import { MultipleRegressionContent } from './components/MultipleRegressionContent';
import { MultipleRegressionInput } from './components/MultipleRegressionInput';
import { calculateMultipleRegression } from './components/MultipleRegressionCalculation';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MultipleRegression = () => {
  const [K, setK] = useState(2);
  const [findX, setFindX] = useState(Array(2).fill(0));
  const [pointsAmount, setPointsAmount] = useState(5);
  const [points, setPoints] = useState([]);
  const [result, setResult] = useState(null);
  const [equations, setEquations] = useState({
    matrix: '',
    substituted: '',
    regression: '',
    final: ''
  });

  useEffect(() => {
    setPoints(Array(pointsAmount).fill().map(() => ({ x: Array(K).fill(0), fx: 0 })));
    setFindX(Array(K).fill(0));
  }, [pointsAmount, K]);

  const handlePointChange = (pointIndex, xIndex, field, value) => {
    const newPoints = [...points];
    if (field === 'x') {
      newPoints[pointIndex].x[xIndex] = value;
    } else {
      newPoints[pointIndex].fx = value;
    }
    setPoints(newPoints);
  };

  const handleCalculate = () => {
    if (points.length < 2) {
      alert("Please enter at least two points");
      return;
    }

    const { A, B, slopes, intercept, result } = calculateMultipleRegression(points, findX, K);

    const matrixEq = generateMatrixEquation(K);
    const substitutedEq = generateSubstitutedEquation(A, B, K);
    const regressionEq = generateRegressionEquation(slopes, intercept, K);
    const finalEq = `f(${findX.join(', ')}) = ${result.toFixed(4)}`;

    setEquations({
      matrix: katex.renderToString(matrixEq),
      substituted: katex.renderToString(substitutedEq),
      regression: katex.renderToString(regressionEq),
      final: katex.renderToString(finalEq)
    });
    setResult(result);
  };

  const generateMatrixEquation = (K) => {
    let eq = '\\begin{bmatrix} n';
    
    // First row
    for (let j = 1; j <= K; j++) {
      eq += ` & \\sum_{i=1}^{n} x_{${j}i}`;
    }
    eq += '\\\\';

    // Remaining rows
    for (let j = 1; j <= K; j++) {
      eq += `\\sum_{i=1}^{n} x_{${j}i}`;
      for (let l = 1; l <= K; l++) {
        eq += ` & \\sum_{i=1}^{n} x_{${j}i} x_{${l}i}`;
      }
      eq += ' \\\\';
    }
    eq += '\\end{bmatrix}';

    // Add coefficient matrix
    eq += '\\begin{bmatrix}';
    for (let j = 0; j <= K; j++) {
      eq += `a_{${j}} \\\\`;
    }
    eq += '\\end{bmatrix}=';

    // Add result matrix
    eq += '\\begin{bmatrix}';
    for (let j = 0; j <= K; j++) {
      if (j === 0) {
        eq += '\\sum_{i=1}^{n} ';
      } else {
        eq += `\\sum_{i=1}^{n} x_{${j}i}`;
      }
      eq += 'y_{i} \\\\';
    }
    eq += '\\end{bmatrix}';

    return eq;
  };

  const generateSubstitutedEquation = (A, B, K) => {
    let eq = '\\begin{bmatrix}';
    
    // Matrix A
    for (let i = 0; i <= K; i++) {
      for (let j = 0; j <= K; j++) {
        eq += A[i][j].toFixed(4);
        if (j < K) eq += ' & ';
      }
      eq += '\\\\';
    }
    eq += '\\end{bmatrix}';

    // Matrix X
    eq += '\\begin{bmatrix}';
    for (let i = 0; i <= K; i++) {
      eq += `a_{${i}}\\\\`;
    }
    eq += '\\end{bmatrix}=';

    // Matrix B
    eq += '\\begin{bmatrix}';
    for (let i = 0; i <= K; i++) {
      eq += B[i].toFixed(4) + '\\\\';
    }
    eq += '\\end{bmatrix}';

    return eq;
  };

  const generateRegressionEquation = (slopes, intercept, K) => {
    let eq = `f(${Array.from({ length: K }, (_, i) => `x_{${i + 1}}`).join(', ')}) = ${intercept.toFixed(4)}`;
    for (let i = 0; i < K; i++) {
      eq += ` + (${slopes[i].toFixed(4)})x_{${i + 1}}`;
    }
    return eq;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Multiple Regression</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultipleRegressionInput
              K={K}
              setK={setK}
              findX={findX}
              setFindX={setFindX}
              pointsAmount={pointsAmount}
              setPointsAmount={setPointsAmount}
              setPoints={setPoints}
            />

            <MultipleRegressionTable
              points={points}
              K={K}
              onPointChange={handlePointChange}
            />

            <Button onClick={handleCalculate} className="w-full">
              Calculate
            </Button>

            {result !== null && (
              <div className="text-center font-semibold">
                Result: {result.toFixed(4)}
              </div>
            )}
          </CardContent>
        </Card>

        {result !== null && (
          <MultipleRegressionContent result={result} equations={equations} />
        )}
      </div>
    </div>
  );
};

export default MultipleRegression;
