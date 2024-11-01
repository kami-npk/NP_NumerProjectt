import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { fetchRandomEquation, convertDataToPoints } from '../utils/regressionUtils';

export const LinearRegressionInput = ({ 
  findX, 
  setFindX, 
  pointsAmount, 
  setPointsAmount,
  setPoints,
  handlePointChange,
  calculateRegression
}) => {
  const { toast } = useToast();

  const getRandomEquation = async () => {
    try {
      const equation = await fetchRandomEquation();
      const newPoints = convertDataToPoints(equation);
      
      setPoints(newPoints);
      setPointsAmount(5);
      setFindX(parseFloat(equation.find_x));
      
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
      <div className="space-y-2">
        <Label>Find f(x) where x is:</Label>
        <Input
          type="number"
          value={findX}
          onChange={(e) => setFindX(parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Points Amount:</Label>
        <Input
          type="number"
          value={pointsAmount}
          onChange={(e) => {
            const amount = parseInt(e.target.value);
            setPointsAmount(amount);
          }}
          min="2"
        />
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