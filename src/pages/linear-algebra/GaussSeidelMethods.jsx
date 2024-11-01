import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GaussSeidelMatrixInput from './components/GaussSeidelMatrixInput';
import { JacobiIterationTable } from "./components/JacobiIterationTable";
import { calculateGaussSeidel } from "./components/GaussSeidelCalculation";

const GaussSeidelMethods = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]);
    const [MatrixB, setMatrixB] = useState([]);
    const [initialX, setInitialX] = useState([]);
    const [solution, setSolution] = useState([]);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        const dim = Number(Dimension);
        if (dim > 0) {
            setMatrixA(Array(dim).fill().map(() => Array(dim).fill(0)));
            setMatrixB(Array(dim).fill(0));
            setInitialX(Array(dim).fill(0));
        }
    }, [Dimension]);

    const handleMatrixAChange = (i, j, value) => {
        const updatedMatrixA = [...MatrixA];
        updatedMatrixA[i][j] = parseFloat(value) || 0;
        setMatrixA(updatedMatrixA);
    };

    const handleMatrixBChange = (i, value) => {
        const updatedMatrixB = [...MatrixB];
        updatedMatrixB[i] = parseFloat(value) || 0;
        setMatrixB(updatedMatrixB);
    };

    const handleInitialXChange = (i, value) => {
        const updatedInitialX = [...initialX];
        updatedInitialX[i] = parseFloat(value) || 0;
        setInitialX(updatedInitialX);
    };

    const solveGaussSeidel = () => {
        const { solution: finalSolution, steps: iterationSteps } = calculateGaussSeidel(
            MatrixA,
            MatrixB,
            initialX,
            Dimension
        );
        setSolution(finalSolution);
        setSteps(iterationSteps);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Gauss-Seidel Iteration Method</h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <GaussSeidelMatrixInput
                    Dimension={Dimension}
                    MatrixA={MatrixA}
                    MatrixB={MatrixB}
                    initialX={initialX}
                    setDimension={setDimension}
                    handleMatrixAChange={handleMatrixAChange}
                    handleMatrixBChange={handleMatrixBChange}
                    handleInitialXChange={handleInitialXChange}
                    onSolve={solveGaussSeidel}
                    setMatrixA={setMatrixA}
                    setMatrixB={setMatrixB}
                    setInitialX={setInitialX}
                />

                {steps.length > 0 && (
                    <Card className="bg-muted">
                        <CardHeader className="pb-4">
                            <CardTitle>Solution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <JacobiIterationTable steps={steps} dimension={Dimension} />
                            </div>
                            
                            <div className="mt-6">
                                <h4 className="text-lg font-medium text-center mb-2">Final Solution</h4>
                                <div className="flex justify-center gap-8">
                                    {solution.map((value, index) => (
                                        <div key={index} className="text-lg">
                                            x<sub>{index + 1}</sub> = {value.toFixed(6)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default GaussSeidelMethods;