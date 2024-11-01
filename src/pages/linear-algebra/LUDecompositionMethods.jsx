import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LUMatrixInput from './components/LUMatrixInput';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LUDecompositionMethods = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]);
    const [MatrixB, setMatrixB] = useState([]);
    const [MatrixL, setMatrixL] = useState([]);
    const [MatrixU, setMatrixU] = useState([]);
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
        const updatedMatrixA = [...MatrixA];
        updatedMatrixA[i][j] = parseFloat(value) || 0;
        setMatrixA(updatedMatrixA);
    };

    const handleMatrixBChange = (i, value) => {
        const updatedMatrixB = [...MatrixB];
        updatedMatrixB[i] = parseFloat(value) || 0;
        setMatrixB(updatedMatrixB);
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
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">LU Decomposition Method</h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <LUMatrixInput
                    Dimension={Dimension}
                    MatrixA={MatrixA}
                    MatrixB={MatrixB}
                    setDimension={setDimension}
                    handleMatrixAChange={handleMatrixAChange}
                    handleMatrixBChange={handleMatrixBChange}
                    onSolve={solveLU}
                />

                {solution.length > 0 && (
                    <Card className="bg-muted">
                        <CardHeader className="pb-4">
                            <CardTitle>Solution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-lg font-medium text-center mb-2">Matrix L</h4>
                                    <Table className="border border-border w-auto mx-auto">
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="h-8 px-1 w-12"></TableHead>
                                                {Array(Dimension).fill().map((_, i) => (
                                                    <TableHead key={i} className="text-center h-8 px-1 w-16">L{i + 1}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {MatrixL.map((row, i) => (
                                                <TableRow key={i} className="border-b border-border">
                                                    <TableCell className="font-medium text-center h-8 px-1">{`Row ${i + 1}`}</TableCell>
                                                    {row.map((value, j) => (
                                                        <TableCell key={j} className="text-center h-8 px-1">{value.toFixed(4)}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-center mb-2">Matrix U</h4>
                                    <Table className="border border-border w-auto mx-auto">
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="h-8 px-1 w-12"></TableHead>
                                                {Array(Dimension).fill().map((_, i) => (
                                                    <TableHead key={i} className="text-center h-8 px-1 w-16">U{i + 1}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {MatrixU.map((row, i) => (
                                                <TableRow key={i} className="border-b border-border">
                                                    <TableCell className="font-medium text-center h-8 px-1">{`Row ${i + 1}`}</TableCell>
                                                    {row.map((value, j) => (
                                                        <TableCell key={j} className="text-center h-8 px-1">{value.toFixed(4)}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-center mb-2">Solution (From UX = Y)</h4>
                                <div className="flex justify-center gap-8">
                                    {solution.map((value, index) => (
                                        <div key={index} className="text-lg">
                                            x<sub>{index + 1}</sub> = {value.toFixed(4)}
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

export default LUDecompositionMethods;
