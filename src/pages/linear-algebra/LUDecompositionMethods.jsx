import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import LUMatrixInput from './components/LUMatrixInput';
import InversionSolutionDisplay from './components/InversionSolutionDisplay';

const LUDecompositionMethods = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]);
    const [MatrixB, setMatrixB] = useState([]);
    const [MatrixL, setMatrixL] = useState([]);
    const [MatrixU, setMatrixU] = useState([]);
    const [solution, setSolution] = useState([]);
    const [steps, setSteps] = useState([]);
    const [solutionSteps, setSolutionSteps] = useState([]);

    useEffect(() => {
        const dim = Number(Dimension);
        if (dim > 0) {
            setMatrixA(Array(dim).fill().map(() => Array(dim).fill(0)));
            setMatrixB(Array(dim).fill(0));
        }
    }, [Dimension]);

    const handleMatrixAChange = (i, j, value) => {
        if (Array.isArray(i)) {
            setMatrixA(i);
        } else {
            const updatedMatrixA = [...MatrixA];
            updatedMatrixA[i][j] = parseFloat(value) || 0;
            setMatrixA(updatedMatrixA);
        }
    };

    const handleMatrixBChange = (i, value) => {
        if (Array.isArray(i)) {
            setMatrixB(i);
        } else {
            const updatedMatrixB = [...MatrixB];
            updatedMatrixB[i] = parseFloat(value) || 0;
            setMatrixB(updatedMatrixB);
        }
    };

    const solveLU = () => {
        const matrixA = MatrixA.map(row => row.slice());
        const matrixB = MatrixB.slice();
        const n = Dimension;

        // Initialize L and U matrices
        const L = Array(n).fill().map(() => Array(n).fill(0));
        const U = Array(n).fill().map(() => Array(n).fill(0));
        const stepsList = [];

        // LU Decomposition
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i <= j) {
                    U[i][j] = matrixA[i][j];
                    for (let k = 0; k < i; k++) {
                        U[i][j] -= L[i][k] * U[k][j];
                    }
                }
                if (i === j) {
                    L[i][i] = 1;
                } else if (i < j) {
                    L[j][i] = matrixA[j][i];
                    for (let k = 0; k < i; k++) {
                        L[j][i] -= L[j][k] * U[k][i];
                    }
                    L[j][i] /= U[i][i];
                }
            }
            stepsList.push({
                description: `Step ${i + 1}`,
                matrix: { L: L.map(row => row.slice()), U: U.map(row => row.slice()) }
            });
        }

        // Solve for Y in LY = B
        const Y = Array(n).fill(0);
        const YSteps = [];

        for (let i = 0; i < n; i++) {
            Y[i] = matrixB[i];
            for (let j = 0; j < i; j++) {
                Y[i] -= L[i][j] * Y[j];
            }
            YSteps.push({
                description: `Solving for Y${i + 1}`,
                step: `Y${i + 1} = ${Y[i]}`
            });
        }

        // Solve for X in UX = Y
        const X = Array(n).fill(0);
        const XSteps = [];

        for (let i = n - 1; i >= 0; i--) {
            X[i] = Y[i];
            for (let j = i + 1; j < n; j++) {
                X[i] -= U[i][j] * X[j];
            }
            XSteps.push({
                description: `Solving for X${i + 1}`,
                step: `X${i + 1} = ${X[i]}`
            });
        }

        setMatrixL(L);
        setMatrixU(U);
        setSteps(stepsList);
        setSolution(X);
        setSolutionSteps(XSteps);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">LU Decomposition Method</h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <LUMatrixInput
                    Dimension={Dimension}
                    setDimension={setDimension}
                    MatrixA={MatrixA}
                    MatrixB={MatrixB}
                    handleMatrixAChange={handleMatrixAChange}
                    handleMatrixBChange={handleMatrixBChange}
                />

                <div className="flex justify-center mt-4">
                    <Button onClick={solveLU}>Solve</Button>
                </div>

                {solution.length > 0 && (
                    <InversionSolutionDisplay
                        inverseMatrix={MatrixL}
                        steps={steps}
                        solutionSteps={solutionSteps}
                        MatrixB={MatrixB}
                    />
                )}
            </div>
        </div>
    );
};

export default LUDecompositionMethods;
