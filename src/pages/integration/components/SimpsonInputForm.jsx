import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { fetchRandomEquation } from '../utils/integrationUtils';

export const SimpsonInputForm = ({ 
  equation,
  a,
  b,
  n,
  onEquationChange,
  onAChange,
  onBChange,
  onNChange,
  onCalculate
}) => {
  const { toast } = useToast();

  const getRandomEquation = async () => {
    try {
      const data = await fetchRandomEquation();
      
      onEquationChange(data['f(x)']);
      onAChange(data.a);
      onBChange(data.b);
      onNChange(data.n);
      
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
    <form onSubmit={(e) => { e.preventDefault(); onCalculate(); }} className="space-y-4">
      <div>
        <Label htmlFor="equation">Equation f(x)</Label>
        <Input
          id="equation"
          value={equation}
          onChange={(e) => onEquationChange(e.target.value)}
          placeholder="e.g., x^2"
        />
      </div>
      <div>
        <Label htmlFor="a">Left bound (a)</Label>
        <Input
          id="a"
          type="number"
          value={a}
          onChange={(e) => onAChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="b">Right bound (b)</Label>
        <Input
          id="b"
          type="number"
          value={b}
          onChange={(e) => onBChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="n">Number of segments (n)</Label>
        <Input
          id="n"
          type="number"
          value={n}
          onChange={(e) => onNChange(e.target.value)}
        />
      </div>
      <Button 
        type="button"
        onClick={getRandomEquation} 
        variant="outline" 
        className="w-full"
      >
        Get Random Equation
      </Button>
      <Button type="submit" className="w-full">Calculate</Button>
    </form>
  );
};