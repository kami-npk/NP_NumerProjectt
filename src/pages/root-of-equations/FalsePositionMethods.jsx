import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FalsePositionMethods = () => {
  const [equation, setEquation] = useState("x^2 - 4");
  const [xl, setXL] = useState("0");
  const [xr, setXR] = useState("3");
  const [result, setResult] = useState(null);
  const [iterations, setIterations] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [errorData, setErrorData] = useState([]);

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

  const calculateFalsePosition = (e) => {
    e.preventDefault();
    let xm, fXm, fXr, fXl, ea;
    let iter = 0;
    const MAX_ITER = 50;
    const EPSILON = 0.000001;
    const newIterations = [];
    const newErrorData = [];
    let xlNum = parseFloat(xl);
    let xrNum = parseFloat(xr);

    do {
      fXl = evaluate(equation, { x: xlNum });
      fXr = evaluate(equation, { x: xrNum });
      xm = ((xlNum * fXr) - (xrNum * fXl)) / (fXr - fXl);
      fXm = evaluate(equation, { x: xm });

      iter++;
      if (fXm * fXr > 0) {
        ea = error(xrNum, xm);
        newIterations.push({ iteration: iter, xl: xlNum, xm, xr: xrNum, error: ea });
        newErrorData.push({ iteration: iter, error: ea });
        xrNum = xm;
      } else if (fXm * fXr < 0) {
        ea = error(xlNum, xm);
        newIterations.push({ iteration: iter, xl: xlNum, xm, xr: xrNum, error: ea });
        newErrorData.push({ iteration: iter, error: ea });
        xlNum = xm;
      }
    } while (ea > EPSILON && iter < MAX_ITER);

    setResult(xm);
    setIterations(newIterations);
    setErrorData(newErrorData);

    // Generate equation graph data
    const graphData = [];
    const step = (parseFloat(xr) - parseFloat(xl)) / 100;
    for (let x = parseFloat(xl); x <= parseFloat(xr); x += step) {
      graphData.push({
        x: x,
        y: evaluate(equation, { x: x })
      });
    }
    setGraphData(graphData);
  };

  const EquationGraph = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={graphData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" name="f(x)" />
      </LineChart>
    </ResponsiveContainer>
  );

  const ErrorGraph = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={errorData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="iteration" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="error" stroke="#82ca9d" name="Error (%)" />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">False-position Method</h1>
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={calculateFalsePosition} className="space-y-4">
            <div>
              <Label htmlFor="equation">Equation f(x)</Label>
              <Input
                id="equation"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="e.g., x^2 - 4"
              />
            </div>
            <div>
              <Label htmlFor="xl">XL</Label>
              <Input
                id="xl"
                type="number"
                value={xl}
                onChange={(e) => setXL(e.target.value)}
                placeholder="e.g., 0"
              />
            </div>
            <div>
              <Label htmlFor="xr">XR</Label>
              <Input
                id="xr"
                type="number"
                value={xr}
                onChange={(e) => setXR(e.target.value)}
                placeholder="e.g., 3"
              />
            </div>
            <Button type="submit">Solve</Button>
          </form>
        </CardContent>
      </Card>

      {result !== null && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Root approximation: {result.toPrecision(7)}</p>
          </CardContent>
        </Card>
      )}

      {graphData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Equation Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <EquationGraph />
          </CardContent>
        </Card>
      )}

      {errorData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Error Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorGraph />
          </CardContent>
        </Card>
      )}

      {iterations.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Iteration Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Iteration</TableHead>
                  <TableHead>XL</TableHead>
                  <TableHead>XM</TableHead>
                  <TableHead>XR</TableHead>
                  <TableHead>Error (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {iterations.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.iteration}</TableCell>
                    <TableCell>{row.xl.toPrecision(7)}</TableCell>
                    <TableCell>{row.xm.toPrecision(7)}</TableCell>
                    <TableCell>{row.xr.toPrecision(7)}</TableCell>
                    <TableCell>{row.error.toPrecision(7)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FalsePositionMethods;