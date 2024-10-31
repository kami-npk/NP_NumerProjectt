import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { useToast } from "@/components/ui/use-toast";
import { SecantInputForm } from './components/SecantInputForm';
import { SecantResults } from './components/SecantResults';

const SecantMethods = () => {
  const [equation, setEquation] = useState("x^2 - 4");
  const [x0, setX0] = useState("0");
  const [x1, setX1] = useState("1");
  const [result, setResult] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [errorData, setErrorData] = useState([]);
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
        setX0(randomEquation.xl);
        setX1(randomEquation.xr);
        
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

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

  const calculateRoot = () => {
    const x0Num = parseFloat(x0);
    const x1Num = parseFloat(x1);
    const newIterations = [];
    const newGraphData = [];
    const newErrorData = [];
    
    let xOld = x0Num;
    let xNew = x1Num;
    let iter = 0;
    const MAX_ITER = 50;
    const EPSILON = 0.000001;

    try {
      // Add initial values as first iteration
      newIterations.push({
        iteration: iter,
        xold: x0Num,
        xnew: x1Num,
        error: 100 // Initial error
      });

      do {
        const fXold = evaluate(equation, { x: xOld });
        const fXnew = evaluate(equation, { x: xNew });
        
        const x = xNew - (fXnew * (xOld - xNew)) / (fXold - fXnew);
        const currentError = error(xNew, x);
        
        iter++;
        newIterations.push({
          iteration: iter,
          xold: xNew, // Previous xNew becomes xOld
          xnew: x,    // New x becomes xNew
          error: currentError
        });
        
        newErrorData.push({ iteration: iter, error: currentError });
        
        if (Math.abs(x - xNew) < EPSILON || iter >= MAX_ITER) {
          setResult(x);
          break;
        }
        
        xOld = xNew;
        xNew = x;
      } while (true);

      // Generate graph data
      const step = (parseFloat(x1) - parseFloat(x0)) / 100;
      for (let x = parseFloat(x0); x <= parseFloat(x1); x += step) {
        try {
          const y = evaluate(equation, { x });
          newGraphData.push({ x, y });
        } catch (error) {
          console.error('Error evaluating equation:', error);
        }
      }

      setIterations(newIterations);
      setGraphData(newGraphData);
      setErrorData(newErrorData);
    } catch (error) {
      console.error('Error in calculation:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Secant Method</h1>
      <div className="space-y-6">
        <SecantInputForm
          equation={equation}
          x0={x0}
          x1={x1}
          onEquationChange={setEquation}
          onX0Change={setX0}
          onX1Change={setX1}
          onGetRandom={getRandomEquation}
          onCalculate={calculateRoot}
        />

        {result !== null && (
          <SecantResults
            result={result}
            graphData={graphData}
            errorData={errorData}
            iterations={iterations}
          />
        )}
      </div>
    </div>
  );
};

export default SecantMethods;
