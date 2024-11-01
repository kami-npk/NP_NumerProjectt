import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CholeskyMatrixInput from './components/CholeskyMatrixInput';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateCholesky, solveSystem } from "./components/CholeskyCalculation";

const CholeskyDecompositionMethods = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]);
    const [MatrixB, setMatrixB] = useState([]);
    const [MatrixL, setMatrixL] = useState([]);
    const [solution, setSolution] = useState({ X: [], Y: [] });
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

    const solveCholesky = () => {
        const { L, stepsList } = calculateCholesky(MatrixA, Dimension);
        const { X, Y } = solveSystem(L, MatrixB, Dimension);
        
        setMatrixL(L);
        setSteps(stepsList);
        setSolution({ X, Y });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Cholesky Decomposition Method</h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <CholeskyMatrixInput
                    Dimension={Dimension}
                    MatrixA={MatrixA}
                    MatrixB={MatrixB}
                    setDimension={setDimension}
                    handleMatrixAChange={handleMatrixAChange}
                    handleMatrixBChange={handleMatrixBChange}
                    onSolve={solveCholesky}
                    setMatrixA={setMatrixA}
                    setMatrixB={setMatrixB}
                />

                {solution.X.length > 0 && (
                    <Card className="bg-muted">
                        <CardHeader className="pb-4">
                            <CardTitle>Solution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
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
                                <h4 className="text-lg font-medium text-center mb-2">Solution (From L^TX = Y)</h4>
                                <div className="flex justify-center gap-8">
                                    {solution.X.map((value, index) => (
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

export default CholeskyDecompositionMethods;
