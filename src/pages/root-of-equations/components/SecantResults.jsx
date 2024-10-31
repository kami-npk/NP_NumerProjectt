import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquationGraph } from './EquationGraph';
import { ErrorGraph } from './ErrorGraph';
import { SecantIterationTable } from './SecantIterationTable';

export const SecantResults = ({ result, graphData, errorData, iterations }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center font-semibold">Answer: {result.toPrecision(7)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equation Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <EquationGraph data={graphData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorGraph data={errorData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Iteration Table</CardTitle>
        </CardHeader>
        <CardContent>
          <SecantIterationTable data={iterations} />
        </CardContent>
      </Card>
    </>
  );
};