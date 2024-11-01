import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpsonInputForm } from './components/SimpsonInputForm';
import { calculateSimpsonArea, generateGraphData } from './components/SimpsonCalculation';
import { EquationGraph } from './components/EquationGraph';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const SimpsonRule = () => {
  const [equation, setEquation] = useState("x^2");
  const [a, setA] = useState("0");
  const [b, setB] = useState("2");
  const [n, setN] = useState("4");
  const [result, setResult] = useState(null);
  const [solution, setSolution] = useState("");

  const handleCalculate = () => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const nNum = parseInt(n);
    
    const { area, solutionLatex } = calculateSimpsonArea(equation, aNum, bNum, nNum);
    setResult(area);
    setSolution(katex.renderToString(solutionLatex, { throwOnError: false }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Simpson's Rule</h1>
      
      <div className="flex flex-col items-center space-y-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpsonInputForm
                equation={equation}
                a={a}
                b={b}
                n={n}
                onEquationChange={setEquation}
                onAChange={setA}
                onBChange={setB}
                onNChange={setN}
                onCalculate={handleCalculate}
              />
            </CardContent>
          </Card>
        </div>
        
        {(solution || result) && (
          <div className="w-full space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Graph</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <EquationGraph
                  equation={equation}
                  a={parseFloat(a)}
                  b={parseFloat(b)}
                  n={parseInt(n)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center" dangerouslySetInnerHTML={{ __html: solution }} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpsonRule;