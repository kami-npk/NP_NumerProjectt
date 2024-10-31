import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const GaussEliminationMethods = () => {
    const [Dimension, setDimension] = useState(3);
    const [MatrixA, setMatrixA] = useState([]);
    const [MatrixB, setMatrixB] = useState([]);
    const [solution, setSolution] = useState([]);
    const [steps, setSteps] = useState([]);
    const [formulas, setFormulas] = useState([]);
    const { toast } = useToast();

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

    const solveAnswer = () => {
        try {
            const matrixA = MatrixA.map(row => row.slice());
            const matrixB = MatrixB.slice();
            const stepsList = [];
            const newFormulas = [];

            // Check if matrices are properly initialized
            if (!matrixA.length || !matrixB.length) {
                throw new Error("Matrices are not properly initialized");
            }

            const addStep = (description, matrix, vector) => {
                stepsList.push({ 
                    description, 
                    matrix: matrix.map(row => row.slice()), 
                    vector: vector.slice() 
                });
            };

            const n = Dimension;

            // Add initial state as first step
            addStep("Initial Matrix", matrixA, matrixB);

            // Gauss Elimination
            for (let k = 0; k < n; k++) {
                if (Math.abs(matrixA[k][k]) < 1e-10) {
                    let pivotFound = false;
                    for (let i = k + 1; i < n; i++) {
                        if (Math.abs(matrixA[i][k]) > 1e-10) {
                            [matrixA[k], matrixA[i]] = [matrixA[i], matrixA[k]];
                            [matrixB[k], matrixB[i]] = [matrixB[i], matrixB[k]];
                            addStep(`Swapped row ${k + 1} with row ${i + 1}`, matrixA, matrixB);
                            pivotFound = true;
                            break;
                        }
                    }
                    if (!pivotFound) {
                        throw new Error("Matrix is singular or nearly singular");
                    }
                }

                for (let i = k + 1; i < n; i++) {
                    const factor = matrixA[i][k] / matrixA[k][k];
                    for (let j = k; j < n; j++) {
                        matrixA[i][j] -= factor * matrixA[k][j];
                    }
                    matrixB[i] -= factor * matrixB[k];
                    addStep(`Eliminated x${k + 1} from row ${i + 1}`, matrixA, matrixB);
                }
            }

            // Back-substitution
            const x = Array(n).fill(0);
            for (let i = n - 1; i >= 0; i--) {
                if (Math.abs(matrixA[i][i]) < 1e-10) {
                    throw new Error("Division by zero encountered");
                }

                let formula = `x${i + 1} = ${matrixB[i].toFixed(4)}`;
                let sum = 0;

                for (let j = i + 1; j < n; j++) {
                    sum += matrixA[i][j] * x[j];
                    formula += ` - ${matrixA[i][j].toFixed(4)}x${j + 1}`;
                }

                x[i] = (matrixB[i] - sum) / matrixA[i][i];
                formula += ` / ${matrixA[i][i].toFixed(4)} = ${x[i].toFixed(4)}`;
                newFormulas.push(formula);
            }

            setSolution(x);
            setSteps(stepsList);
            setFormulas(newFormulas);
            
            toast({
                title: "Success",
                description: "Solution calculated successfully",
            });
        } catch (error) {
            console.error("Error in Gauss Elimination:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to solve the system",
                variant: "destructive",
            });
            
            setSolution([]);
            setSteps([]);
            setFormulas([]);
        }
    };

    const renderMatrix = (step) => (
        <div className="mb-4">
            <h3 className="text-xl font-semibold text-center mb-2">Matrix State</h3>
            <div className="overflow-x-auto">
                <Table className="border border-border w-auto mx-auto">
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="h-8 px-1 w-12"></TableHead>
                            {Array(Dimension).fill().map((_, i) => (
                                <TableHead key={i} className="text-center h-8 px-1 w-16">x{i + 1}</TableHead>
                            ))}
                            <TableHead className="text-center h-8 px-1 w-16">b</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {step.matrix.map((row, i) => (
                            <TableRow key={i} className="border-b border-border">
                                <TableCell className="font-medium text-center h-8 px-1">{i + 1}</TableCell>
                                {row.map((value, j) => (
                                    <TableCell 
                                        key={j} 
                                        className={`text-center h-8 px-1`}
                                    >
                                        {Number.isFinite(value) ? value.toFixed(4) : '0.0000'}
                                    </TableCell>
                                ))}
                                <TableCell className="text-center h-8 px-1">
                                    {Number.isFinite(step.vector[i]) ? step.vector[i].toFixed(4) : '0.0000'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    const fetchRandomEquation = async () => {
        try {
            const response = await fetch("http://localhost:80/linearalgebra.php");
            const data = await response.json();

            // Randomly select an equation
            const randomIndex = Math.floor(Math.random() * data.length);
            const equation = data[randomIndex];

            // Create Matrix A and B from the selected equation
            const matrixA = [
                [parseFloat(equation.a11), parseFloat(equation.a12), parseFloat(equation.a13)],
                [parseFloat(equation.a21), parseFloat(equation.a22), parseFloat(equation.a23)],
                [parseFloat(equation.a31), parseFloat(equation.a32), parseFloat(equation.a33)],
            ];

            const matrixB = [
                parseFloat(equation.b1),
                parseFloat(equation.b2),
                parseFloat(equation.b3),
            ];

            setMatrixA(matrixA);
            setMatrixB(matrixB);
            setDimension(3); // Reset dimension to 3
        } catch (error) {
            console.error("Error fetching random equation:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Gauss Elimination Method</h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
                <Card className="bg-card">
                    <CardHeader className="pb-4">
                        <CardTitle>Matrix Input</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <Label htmlFor="dimension">Matrix Dimension:</Label>
                            <Input
                                id="dimension"
                                type="number"
                                min="2"
                                max="10"
                                value={Dimension}
                                onChange={(e) => setDimension(Number(e.target.value))}
                                className="w-24"
                            />
                        </div>

                        <div className="flex justify-center mb-4">
                            <Button onClick={fetchRandomEquation}>Get Random Equation</Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table className="border border-border w-auto mx-auto">
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="h-8 px-1 w-20"></TableHead>
                                        {Array(Dimension).fill().map((_, i) => (
                                            <TableHead key={i} className="text-center h-8 px-1 w-16">x{i + 1}</TableHead>
                                        ))}
                                        <TableHead className="text-center h-8 px-1 w-16">b</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array(Dimension).fill().map((_, i) => (
                                        <TableRow key={i} className="border-b border-border">
                                            <TableCell className="font-medium h-8 px-1">Row {i + 1}</TableCell>
                                            {Array(Dimension).fill().map((_, j) => (
                                                <TableCell key={j} className="p-0">
                                                    <Input
                                                        type="number"
                                                        value={MatrixA[i] ? MatrixA[i][j] : ''}
                                                        onChange={(e) => handleMatrixAChange(i, j, e.target.value)}
                                                        className="h-8 w-full text-center"
                                                    />
                                                </TableCell>
                                            ))}
                                            <TableCell className="p-0">
                                                <Input
                                                    type="number"
                                                    value={MatrixB[i] ? MatrixB[i] : ''}
                                                    onChange={(e) => handleMatrixBChange(i, e.target.value)}
                                                    className="h-8 w-full text-center"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center mb-4">
                    <Button onClick={solveAnswer}>Solve</Button>
                </div>

                {steps.length > 0 && (
                    <Card className="bg-card">
                        <CardHeader className="pb-4">
                            <CardTitle>Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {steps.map((step, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="text-lg font-semibold">{step.description}</h3>
                                    {renderMatrix(step)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {formulas.length > 0 && (
                    <Card className="bg-card">
                        <CardHeader className="pb-4">
                            <CardTitle>Formulas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {formulas.map((formula, index) => (
                                <div key={index} className="mb-2">
                                    <p>{formula}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {solution.length > 0 && (
                    <Card className="bg-card">
                        <CardHeader className="pb-4">
                            <CardTitle>Solution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-lg font-semibold">x:</h3>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        {solution.map((value, i) => (
                                            <TableCell key={i} className="text-center">{value.toFixed(4)}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default GaussEliminationMethods;
