import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const CholeskyMatrixInput = ({ 
    Dimension, 
    MatrixA, 
    MatrixB, 
    setDimension, 
    handleMatrixAChange, 
    handleMatrixBChange, 
    onSolve,
    setMatrixA,
    setMatrixB
}) => {
    const { toast } = useToast();

    const fetchRandomEquation = async () => {
        try {
            const response = await fetch("http://localhost:80/linearalgebra.php");
            const data = await response.json();

            const randomIndex = Math.floor(Math.random() * data.length);
            const equation = data[randomIndex];

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
            setDimension(3);

            toast({
                title: "Success",
                description: "Random equation loaded successfully",
            });
        } catch (error) {
            console.error("Error fetching random equation:", error);
            toast({
                title: "Error",
                description: "Failed to fetch random equation",
                variant: "destructive",
            });
        }
    };

    return (
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
                                                value={MatrixA[i]?.[j] || ''}
                                                onChange={(e) => handleMatrixAChange(i, j, e.target.value)}
                                                className="border-0 h-8 text-center w-16"
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell className="p-0">
                                        <Input
                                            type="number"
                                            value={MatrixB[i] || ''}
                                            onChange={(e) => handleMatrixBChange(i, e.target.value)}
                                            className="border-0 h-8 text-center w-16"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-center mt-4">
                    <Button onClick={onSolve}>Solve</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CholeskyMatrixInput;