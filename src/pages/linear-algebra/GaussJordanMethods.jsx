import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import MatrixInputWithRandom from './components/MatrixInputWithRandom';
import SolutionDisplay from './components/SolutionDisplay';

const GaussJordanMethods = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]);
    const [MatrixB, setMatrixB] = useState([]);
    const [solution, setSolution] = useState([]);
    const [steps, setSteps] = useState([]);

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

    const solveAnswer = () => {
        const matrixA = MatrixA.map(row => row.slice());
        const matrixB = MatrixB.slice();
        const stepsList = [];

        const addStep = (description, matrix, vector) => {
            stepsList.push({ description, matrix: matrix.map(row => row.slice()), vector: vector.slice() });
        };

        const n = Dimension;

        // Gauss-Jordan Elimination
        for (let k = 0; k < n; k++) {
            if (matrixA[k][k] === 0) {
                for (let i = k + 1; i < n; i++) {
                    if (matrixA[i][k] !== 0) {
                        [matrixA[k], matrixA[i]] = [matrixA[i], matrixA[k]];
                        [matrixB[k], matrixB[i]] = [matrixB[i], matrixB[k]];
                        addStep(`Swapped row ${k + 1} with row ${i + 1}`, matrixA, matrixB);
                        break;
                    }
                }
            }

            // Normalize the pivot row
            const pivot = matrixA[k][k];
            for (let j = 0; j < n; j++) {
                matrixA[k][j] /= pivot;
            }
            matrixB[k] /= pivot;
            addStep(`Normalized row ${k + 1}`, matrixA, matrixB);

            // Eliminate the current column from other rows
            for (let i = 0; i < n; i++) {
                if (i !== k) {
                    const factor = matrixA[i][k];
                    for (let j = 0; j < n; j++) {
                        matrixA[i][j] -= factor * matrixA[k][j];
                    }
                    matrixB[i] -= factor * matrixB[k];
                    addStep(`Eliminated x${k + 1} from row ${i + 1}`, matrixA, matrixB);
                }
            }
        }

        setSolution(matrixB);
        setSteps(stepsList);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Gauss-Jordan Method</h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <MatrixInputWithRandom
                    Dimension={Dimension}
                    setDimension={setDimension}
                    MatrixA={MatrixA}
                    MatrixB={MatrixB}
                    handleMatrixAChange={handleMatrixAChange}
                    handleMatrixBChange={handleMatrixBChange}
                />

                <div className="flex justify-center mt-4">
                    <Button onClick={solveAnswer}>Solve</Button>
                </div>

                {solution.length > 0 && (
                    <SolutionDisplay solution={solution} steps={steps} />
                )}
            </div>
        </div>
    );
};

export default GaussJordanMethods;
