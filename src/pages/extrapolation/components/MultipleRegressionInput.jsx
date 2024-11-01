import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { fetchRandomEquation, convertDataToPoints } from '../utils/multipleRegressionUtils';

export const MultipleRegressionInput = ({ 
  K,
  setK,
  findX,
  setFindX,
  pointsAmount,
  setPointsAmount,
  setPoints
}) => {
  const { toast } = useToast();

  const getRandomEquation = async () => {
    try {
      const equation = await fetchRandomEquation();
      const newPoints = convertDataToPoints(equation);
      
      setPoints(newPoints);
      setPointsAmount(5);
      setK(2);
      setFindX([parseFloat(equation.find_x_1), parseFloat(equation.find_x_2)]);
      
      toast({
        title: "Success",
        description: "Random equation loaded successfully",
      });
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
    <div className="space-y-4">
      <div>
        <Label>Number of Variables (k)</Label>
        <Input
          type="number"
          value={K}
          onChange={(e) => setK(parseInt(e.target.value) || 2)}
          min="2"
        />
      </div>

      <div>
        <Label>Points Amount</Label>
        <Input
          type="number"
          value={pointsAmount}
          onChange={(e) => setPointsAmount(parseInt(e.target.value) || 2)}
          min="2"
        />
      </div>

      <div className="space-y-2">
        <Label>Find f(x) where x is:</Label>
        <div className="grid gap-2">
          {findX.map((x, i) => (
            <Input
              key={i}
              type="number"
              value={x}
              onChange={(e) => {
                const newFindX = [...findX];
                newFindX[i] = parseFloat(e.target.value) || 0;
                setFindX(newFindX);
              }}
              placeholder={`x${i + 1}`}
            />
          ))}
        </div>
      </div>

      <Button 
        onClick={getRandomEquation} 
        variant="outline" 
        className="w-full"
      >
        Get Random Equation
      </Button>
    </div>
  );
};