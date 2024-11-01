import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const LUMatrixInput = ({ 
  Dimension, 
  setDimension, 
  MatrixA, 
  MatrixB, 
  handleMatrixAChange, 
  handleMatrixBChange 
}) => {
  const { toast } = useToast();

  const getRandomEquation = async () => {
    try {
      const response = await fetch('http://localhost:80/linearalgebra.php');
      const data = await response.json();

      const randomEquations = data.filter(equation => equation.id === 4 || equation.id === 5);
      if (randomEquations.length > 0) {
        const selectedEquation = randomEquations[Math.floor(Math.random() * randomEquations.length)];
        
        const matrixA = [
          [parseFloat(selectedEquation.a11), parseFloat(selectedEquation.a12), parseFloat(selectedEquation.a13)],
          [parseFloat(selectedEquation.a21), parseFloat(selectedEquation.a22), parseFloat(selectedEquation.a23)],
          [parseFloat(selectedEquation.a31), parseFloat(selectedEquation.a32), parseFloat(selectedEquation.a33)],
        ];

        const matrixB = [
          parseFloat(selectedEquation.b1),
          parseFloat(selectedEquation.b2),
          parseFloat(selectedEquation.b3),
        ];

        handleMatrixAChange(matrixA);
        handleMatrixBChange(matrixB);
        setDimension(3);

        toast({
          title: "Success",
          description: "Random equation loaded successfully",
        });
      }
    } catch (error) {
      console.error('Error fetching random equation:', error);
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
          <Button onClick={getRandomEquation}>Get Random Equation</Button>
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
      </CardContent>
    </Card>
  );
};

export default LUMatrixInput;