import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import MatrixInputWithRandom from './components/MatrixInputWithRandom';
import InversionSolutionDisplay from './components/InversionSolutionDisplay';

const MatrixInversionMethods = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]);
    const [MatrixB, setMatrixB] = useState([]);
    const [inverseMatrix, setInverseMatrix] = useState([]);
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

    const solveInverse = () => {
        const matrixA = MatrixA.map(row => row.slice());
        const matrixB = MatrixB.slice();
        const n = Dimension;

        // Initialize the augmented matrix [A | I]
        const augmentedMatrix = matrixA.map((row, i) => [...row, ...Array(n).fill(0)]);
        for (let i = 0; i < n; i++) augmentedMatrix[i][n + i] = 1;

        const stepsList = [];
        const addStep = (description, matrix) => {
            stepsList.push({ description, matrix: matrix.map(row => row.slice()) });
        };

        // Gauss-Jordan Elimination
        for (let k = 0; k < n; k++) {
            if (augmentedMatrix[k][k] === 0) {
                for (let i = k + 1; i < n; i++) {
                    if (augmentedMatrix[i][k] !== 0) {
                        [augmentedMatrix[k], augmentedMatrix[i]] = [augmentedMatrix[i], augmentedMatrix[k]];
                        addStep(`Swapped row ${k + 1} with row ${i + 1}`, augmentedMatrix);
                        break;
                    }
                }
            }

            const pivot = augmentedMatrix[k][k];
            for (let j = 0; j < 2 * n; j++) {
                augmentedMatrix[k][j] /= pivot;
            }
            addStep(`Normalized row ${k + 1}`, augmentedMatrix);

            for (let i = 0; i < n; i++) {
                if (i !== k) {
                    const factor = augmentedMatrix[i][k];
                    for (let j = 0; j < 2 * n; j++) {
                        augmentedMatrix[i][j] -= factor * augmentedMatrix[k][j];
                    }
                    addStep(`Eliminated column ${k + 1} from row ${i + 1}`, augmentedMatrix);
                }
            }
        }

        const inverse = augmentedMatrix.map(row => row.slice(n));
        const resultX = Array(n).fill(0);
        const solutionStepsList = [];

        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                sum += inverse[i][j] * matrixB[j];
            }
            resultX[i] = sum;
            solutionStepsList.push({
                description: `Row ${i + 1} multiplication`,
                step: `x${i + 1} = ${inverse[i].map((val, idx) => `${val.toFixed(4)} × ${matrixB[idx]}`).join(' + ')} = ${sum.toFixed(4)}`
            });
        }

        setInverseMatrix(inverse);
        setSteps(stepsList);
        setSolutionSteps(solutionStepsList);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Matrix Inversion Method</h1>
            
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
                    <Button onClick={solveInverse}>Solve</Button>
                </div>

                {inverseMatrix.length > 0 && (
                    <InversionSolutionDisplay
                        inverseMatrix={inverseMatrix}
                        steps={steps}
                        solutionSteps={solutionSteps}
                        MatrixB={MatrixB}
                    />
                )}
            </div>
        </div>
    );
};

export default MatrixInversionMethods;