import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LagrangeSolutionDisplay = ({ equation, answerEquation }) => {
  if (!equation && !answerEquation) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solution</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] rounded-md border border-border">
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-4">Interpolation Equations</h3>
              <div className="space-y-4 text-xs overflow-x-auto pr-4" dangerouslySetInnerHTML={{ __html: equation }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Final Result</h3>
              <div className="text-xs overflow-x-auto pr-4" dangerouslySetInnerHTML={{ __html: answerEquation }} />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};