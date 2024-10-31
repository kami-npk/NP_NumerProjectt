import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchEquation } from '@/utils/api';
import { useToast } from "@/components/ui/use-toast";

export const SharedInputForm = ({ 
  title,
  equation,
  onEquationChange,
  onCalculate,
  children,
  result 
}) => {
  const { toast } = useToast();

  const handleFetchEquation = async () => {
    try {
      const data = await fetchEquation();
      if (data && data.equation) {
        onEquationChange(data.equation);
        toast({
          title: "Success",
          description: "Equation fetched successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch equation",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="equation">Input Equation f(x)</Label>
            <div className="flex gap-2">
              <Input
                id="equation"
                value={equation}
                onChange={(e) => onEquationChange(e.target.value)}
                placeholder="e.g., x^2 - 4"
              />
              <Button 
                variant="outline"
                onClick={handleFetchEquation}
              >
                Get Equation
              </Button>
            </div>
          </div>
          {children}
          <Button onClick={onCalculate} className="w-full">Solve</Button>
          {result !== null && (
            <div className="text-center mt-4">
              <p className="font-semibold">Answer: {result.toPrecision(7)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};