import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { fetchRandomEquation } from '../utils/accurateDifferentiationUtils';

export const AccurateDifferentiationForm = ({
  equation,
  x,
  h,
  selectedOrder,
  selectedDirection,
  setEquation,
  setX,
  setH,
  setSelectedOrder,
  setSelectedDirection,
  onCalculate,
  result
}) => {
  const { toast } = useToast();

  const getRandomEquation = async () => {
    try {
      const data = await fetchRandomEquation();
      setEquation(data['f(x)']);
      setX(data.x);
      setH(data.h);
      
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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Order</Label>
            <Select value={selectedOrder} onValueChange={setSelectedOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">First</SelectItem>
                <SelectItem value="2">Second</SelectItem>
                <SelectItem value="3">Third</SelectItem>
                <SelectItem value="4">Fourth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Direction</Label>
            <Select value={selectedDirection} onValueChange={setSelectedDirection}>
              <SelectTrigger>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Forward</SelectItem>
                <SelectItem value="2">Backward</SelectItem>
                <SelectItem value="3">Central</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Input Equation f(x)</Label>
          <Input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="e.g., x^2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Input x</Label>
            <Input
              type="number"
              value={x}
              onChange={(e) => setX(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Input h</Label>
            <Input
              type="number"
              value={h}
              onChange={(e) => setH(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={getRandomEquation} 
          variant="outline" 
          className="w-full"
        >
          Get Random Equation
        </Button>

        <Button onClick={onCalculate} className="w-full">
          Solve
        </Button>

        {result !== null && (
          <div className="text-center font-semibold">
            Result: {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
};