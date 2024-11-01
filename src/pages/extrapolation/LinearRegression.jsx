import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lusolve } from 'mathjs';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { LinearRegressionForm } from './components/LinearRegressionForm';
import { LinearRegressionTable } from './components/LinearRegressionTable';
import { LinearRegressionContent } from './components/LinearRegressionContent';
import { LinearRegressionInput } from './components/LinearRegressionInput';

const LinearRegression = () => {
  const [findX, setFindX] = useState(4.5);
  const [pointsAmount, setPointsAmount] = useState(5);
  const [points, setPoints] = useState([]);
  const [result, setResult] = useState(null);
  const [slope, setSlope] = useState(null);
  const [intercept, setIntercept] = useState(null);
  const [equations, setEquations] = useState({
    matrix: '',
    substituted: '',
    regression: '',
    final: ''
  });

  const handlePointChange = (index, field, value) => {
    const newPoints = [...points];
    if (!newPoints[index]) {
      newPoints[index] = { x: 0, y: 0 };
    }
    newPoints[index][field] = parseFloat(value) || 0;
    setPoints(newPoints);
  };

  const calculateRegression = () => {
    if (points.length < 2) {
      alert("Please enter at least two points");
      return;
    }

    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    points.forEach(point => {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumX2 += point.x * point.x;
    });

    const A = [[n, sumX], [sumX, sumX2]];
    const B = [sumY, sumXY];
    
    const solution = lusolve(A, B);
    const newIntercept = Number(solution[0]);
    const newSlope = Number(solution[1]);
    
    setIntercept(newIntercept);
    setSlope(newSlope);
    
    const result = newSlope * findX + newIntercept;
    setResult(result);

    // Generate LaTeX equations
    const matrixLatex = `\\begin{bmatrix} n & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{bmatrix} \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix} = \\begin{bmatrix} \\sum y_i \\\\ \\sum x_iy_i \\end{bmatrix}`;
    const matrixSubLatex = `\\begin{bmatrix} ${n} & ${sumX} \\\\ ${sumX} & ${sumX2} \\end{bmatrix} \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix} = \\begin{bmatrix} ${sumY} \\\\ ${sumXY} \\end{bmatrix}`;
    const functionLatex = `f(x) = ${newIntercept.toFixed(4)} + ${newSlope.toFixed(4)}x`;
    const finalLatex = `f(${findX}) = ${result.toFixed(4)}`;

    setEquations({
      matrix: katex.renderToString(matrixLatex),
      substituted: katex.renderToString(matrixSubLatex),
      regression: katex.renderToString(functionLatex),
      final: katex.renderToString(finalLatex)
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Linear Regression</h1>
      
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LinearRegressionInput
              findX={findX}
              setFindX={setFindX}
              pointsAmount={pointsAmount}
              setPointsAmount={setPointsAmount}
              setPoints={setPoints}
              handlePointChange={handlePointChange}
              calculateRegression={calculateRegression}
            />

            <LinearRegressionForm
              findX={findX}
              setFindX={setFindX}
              pointsAmount={pointsAmount}
              setPointsAmount={setPointsAmount}
              points={points}
              handlePointChange={handlePointChange}
              calculateRegression={calculateRegression}
              result={result}
            />
          </CardContent>
        </Card>

        {result !== null && (
          <>
            <LinearRegressionContent
              result={result}
              points={points}
              slope={slope}
              intercept={intercept}
              findX={findX}
              equations={equations}
            />

            <Card>
              <CardHeader>
                <CardTitle>Calculation Table</CardTitle>
              </CardHeader>
              <CardContent>
                <LinearRegressionTable points={points} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default LinearRegression;