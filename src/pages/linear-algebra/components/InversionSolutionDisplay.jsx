import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const InversionSolutionDisplay = ({ inverseMatrix, steps, solutionSteps, MatrixB }) => {
    const renderMatrix = (matrix, title) => (
        <div className="mb-4">
            <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
            <div className="overflow-x-auto">
                <Table className="border border-border w-auto mx-auto">
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="h-8 px-1 w-12"></TableHead>
                            {matrix[0].map((_, i) => (
                                <TableHead key={i} className="text-center h-8 px-1 w-16">
                                    {i < matrix[0].length / 2 ? `x${i + 1}` : `I${i - matrix[0].length / 2 + 1}`}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matrix.map((row, i) => (
                            <TableRow key={i} className="border-b border-border">
                                <TableCell className="font-medium text-center h-8 px-1">{i + 1}</TableCell>
                                {row.map((value, j) => (
                                    <TableCell key={j} className="text-center h-8 px-1">
                                        {value.toFixed(4)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    return (
        <Card className="bg-muted">
            <CardHeader className="pb-4">
                <CardTitle>Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center space-y-1 mb-4">
                    {solutionSteps.map((step, index) => (
                        <p key={index} className="text-lg">{step.step}</p>
                    ))}
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-center">Steps</h3>
                    {steps.map((step, index) => (
                        <div key={index}>
                            <h4 className="text-lg font-medium text-center mb-2">Step {index + 1}: {step.description}</h4>
                            {renderMatrix(step.matrix)}
                        </div>
                    ))}

                    <div className="flex justify-center gap-8 mt-8">
                        <div>
                            <h4 className="text-lg font-medium text-center mb-2">Inverse Matrix (A⁻¹)</h4>
                            {renderMatrix(inverseMatrix, '')}
                        </div>
                        <div>
                            <h4 className="text-lg font-medium text-center mb-2">Matrix B</h4>
                            <Table className="border border-border w-auto mx-auto">
                                <TableBody>
                                    {MatrixB.map((value, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="text-center">{value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InversionSolutionDisplay;