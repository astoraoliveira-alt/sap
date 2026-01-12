import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";
import { type LucideIcon, ArrowRight } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
    LabelList,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// --- AG-StatCard ---
interface AGStatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    subValue?: string;
    onClick?: () => void;
    isActive?: boolean;
}

export const AGStatCard = ({ title, value, icon: Icon, subValue, onClick, isActive }: AGStatCardProps) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <Card
            onClick={onClick}
            className={cn(
                "cursor-pointer group relative overflow-hidden",
                isActive ? "border-primary/50 bg-primary/10" : "hover:border-primary/20"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-wider">
                    {title}
                </CardTitle>
                <Icon className={cn("h-4 w-4 text-muted-foreground transition-all duration-300", isActive ? "text-primary" : "group-hover:text-primary group-hover:scale-110")} />
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-light tracking-tight">{value}</div>
                {subValue && <p className="text-xs text-muted-foreground mt-1 font-mono">{subValue}</p>}
            </CardContent>
        </Card>
    </motion.div>
);

// --- AG-BarChart ---
interface AGBarChartProps {
    data: any[];
    xKey: string;
    yKey: string;
    height?: number;
    onBarClick?: (data: any) => void;
    activeKey?: string | number;
    barColor?: string;
    title?: string;
}

const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    const formattedValue = (typeof value === 'number')
        ? (value / 1024 / 1024).toFixed(1) + ' MB'
        : value;

    return (
        <text
            x={x + width / 2}
            y={y}
            dy={-6}
            fill="hsl(var(--foreground))"
            fontSize={11}
            fontWeight={500}
            textAnchor="middle"
        >
            {formattedValue}
        </text>
    );
};

export const AGBarChart = ({ data, xKey, yKey, height = 300, onBarClick, activeKey }: AGBarChartProps) => {
    return (
        <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        </linearGradient>
                        <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.6} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis
                        dataKey={xKey}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1024).toFixed(0)} MB`}
                    />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))'
                        }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => [`${(value / 1024).toFixed(2)} MB`, 'Size']}
                    />
                    <Bar
                        dataKey={yKey}
                        radius={[4, 4, 0, 0]}
                        onClick={onBarClick ? (data: any) => onBarClick(data) : undefined}
                        cursor={onBarClick ? 'pointer' : 'default'}
                    >
                        <LabelList dataKey={yKey} content={renderCustomBarLabel} />
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry[xKey] === activeKey ? "url(#barGradientActive)" : "url(#barGradient)"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- AG-AreaChart ---
const renderCustomAreaLabel = (props: any) => {
    const { x, y, value } = props;
    const formattedValue = (typeof value === 'number')
        ? (value / 1024 / 1024).toFixed(1) + ' MB'
        : value;

    return (
        <text
            x={x}
            y={y}
            dy={-10}
            fill="hsl(var(--foreground))"
            fontSize={11}
            fontWeight={500}
            textAnchor="middle"
        >
            {formattedValue}
        </text>
    );
};

export const AGAreaChart = ({ data, xKey, yKey, height = 250, onDotClick }: any) => {
    return (
        <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis
                        dataKey={xKey}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1024 / 1024).toFixed(0)} MB`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => [(value / 1024 / 1024).toFixed(2) + ' MB', 'Total Size']}
                    />
                    <Area
                        type="monotone"
                        dataKey={yKey}
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorSize)"
                        strokeWidth={2}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--foreground))", cursor: 'pointer', onClick: (props: any) => onDotClick && onDotClick(props.payload) }}
                    >
                        <LabelList dataKey={yKey} content={renderCustomAreaLabel} />
                    </Area>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- AG-SidePanel ---
export const AGSidePanel = ({ isOpen, onClose, title, children }: any) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-card border-l border-border z-50 shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
