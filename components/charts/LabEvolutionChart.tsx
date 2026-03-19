import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const LabEvolutionChart = ({ title, data, unit, minRef, maxRef }: any) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex justify-between">
          {title} <span className="text-xs text-muted-foreground">{unit}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ fontSize: '12px' }} />
              {/* Zone verte pour la plage de référence normale */}
              {(minRef !== undefined || maxRef !== undefined) && (
                <ReferenceArea 
                  y1={minRef !== undefined ? minRef : undefined} 
                  y2={maxRef !== undefined ? maxRef : undefined} 
                  fill="#10b981" fillOpacity={0.1} 
                />
              )}
              
              {/* Lignes en pointillés pour les seuils */}
              {minRef !== undefined && (
                <ReferenceLine y={minRef} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.8} />
              )}
              {maxRef !== undefined && (
                <ReferenceLine y={maxRef} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.8} />
              )}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={2} 
                dot={{ r: 4, fill: "#2563eb" }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
