import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const SecantInputForm = ({ 
  equation, 
  x0, 
  x1, 
  onEquationChange, 
  onX0Change, 
  onX1Change, 
  onGetRandom,
  onCalculate 
}) => {
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Input Equation f(x)</Label>
            <Input
              value={equation}
              onChange={(e) => onEquationChange(e.target.value)}
              placeholder="e.g., x^2 - 4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="x0">X₀ (first initial value)</Label>
            <Input
              id="x0"
              type="number"
              value={x0}
              onChange={(e) => onX0Change(e.target.value)}
              placeholder="e.g., 0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="x1">X₁ (second initial value)</Label>
            <Input
              id="x1"
              type="number"
              value={x1}
              onChange={(e) => onX1Change(e.target.value)}
              placeholder="e.g., 1"
            />
          </div>
          <Button 
            onClick={onGetRandom} 
            variant="outline" 
            className="w-full"
          >
            Get Random Equation
          </Button>
          <Button onClick={onCalculate} className="w-full">
            Solve
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};