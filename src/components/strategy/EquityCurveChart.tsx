"use client";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts";

interface EquityPoint {
    timestamp: string; // ISO string or formatted date
    equity: number;
    // Optionally: trade?: { result: number; type: string };
}

interface Props {
    data: EquityPoint[];
}

// Helper to compute drawdown per point
function computeDrawdown(data: EquityPoint[]) {
    let peak = -Infinity;
    return data.map((point) => {
        peak = Math.max(peak, point.equity);
        const drawdown = peak > 0 ? ((peak - point.equity) / peak) * 100 : 0;
        return { ...point, drawdown: -drawdown };
    });
}

export default function EquityCurveChart({ data }: Props) {
    const curveWithDrawdown = computeDrawdown(data);
    return (
        <div className="h-[300px] w-full rounded-xl bg-slate-900 p-4 shadow-md">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curveWithDrawdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="timestamp" stroke="#ccc" minTickGap={32} />
                    <YAxis stroke="#ccc" />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length > 0) {
                                const point = payload[0].payload;
                                return (
                                    <div className="bg-gray-900 text-white p-2 rounded shadow">
                                        <div><strong>Date:</strong> {point.timestamp}</div>
                                        <div><strong>Equity:</strong> ${point.equity.toFixed(2)}</div>
                                        <div><strong>Drawdown:</strong> {Math.abs(point.drawdown).toFixed(2)}%</div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="drawdown"
                        fill="#FF4D4D"
                        fillOpacity={0.2}
                        stroke="none"
                        isAnimationActive={true}
                        animationDuration={700}
                    />
                    <Line
                        type="monotone"
                        dataKey="equity"
                        stroke="#00FFAB"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={700}
                    />
                    {/*
          // Optional: Trade markers if you have trade data
          {curveWithDrawdown.map((point, idx) =>
            point.trade ? (
              <ReferenceDot
                key={point.timestamp}
                x={point.timestamp}
                y={point.equity}
                r={4}
                fill={point.trade.result >= 0 ? 'lime' : 'red'}
                stroke="white"
                strokeWidth={1}
              />
            ) : null
          )}
          */}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
} 
