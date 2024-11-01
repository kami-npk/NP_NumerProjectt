import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { fetchRandomEquation, convertDataToPoints } from '../utils/polynomialRegressionUtils';

export const PolynomialRegressionInput = ({ 
  findX, 
  setFindX, 
  order,
  setOrder,
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
      setOrder(2);
      setFindX(parseFloat(equation.find_x_1));
      
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
    <div className="grid gap-4">
      <div>
        <Label>Find f(x) where x is:</Label>
        <Input
          type="number"
          value={findX}
          onChange={(e) => setFindX(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <Label>Order (m)</Label>
        <Input
          type="number"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value) || 2)}
          min="1"
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