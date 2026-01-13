import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useLanguage } from "../../contexts/LanguageContext";
import { type YearData } from '../../data/mock';
import { ChevronRight, ChevronDown, FolderOpen, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileDistributionReportProps {
    data: YearData[];
}

export const FileDistributionReport = ({ data }: FileDistributionReportProps) => {
    const { t } = useLanguage();
    const [expandedYears, setExpandedYears] = useState<number[]>([]);

    const toggleYear = (year: number) => {
        setExpandedYears(prev =>
            prev.includes(year)
                ? prev.filter(y => y !== year)
                : [...prev, year]
        );
    };

    // Helper to format straight to MB value number for column
    const toMB = (bytes: number) => (bytes / 1024 / 1024).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // Helper to format straight to GB value number for column
    const toGB = (bytes: number) => (bytes / 1024 / 1024 / 1024).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

    return (
        <Card className="col-span-12 overflow-hidden border-primary/20 bg-background/50 backdrop-blur-xl">
            <CardHeader className="border-b border-border/50 bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    {t('fileDistributionReportTitle')}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-5 md:col-span-4 pl-2">{t('exerciseExtension')}</div>
                        <div className="col-span-3 md:col-span-2 text-right">{t('quantityFiles')}</div>
                        <div className="col-span-4 md:col-span-3 text-right">{t('sizeMB')}</div>
                        <div className="hidden md:block md:col-span-3 text-right">{t('sizeGB')}</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-border/20">
                        {data.map((yearData) => {
                            const isExpanded = expandedYears.includes(yearData.year);

                            return (
                                <div key={yearData.year} className="group">
                                    {/* Parent Row (Year) */}
                                    <div
                                        onClick={() => toggleYear(yearData.year)}
                                        className={`grid grid-cols-12 gap-4 px-6 py-3 cursor-pointer transition-colors hover:bg-muted/30 ${isExpanded ? 'bg-muted/20' : ''}`}
                                    >
                                        <div className="col-span-5 md:col-span-4 flex items-center gap-2 font-medium text-foreground">
                                            <div className={`p-0.5 rounded-md transition-colors ${isExpanded ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>
                                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </div>
                                            <FolderOpen className="h-4 w-4 text-amber-500/80" />
                                            <span>{yearData.year}</span>
                                        </div>
                                        <div className="col-span-3 md:col-span-2 text-right font-mono text-sm text-foreground">
                                            {yearData.fileCount.toLocaleString()}
                                        </div>
                                        <div className="col-span-4 md:col-span-3 text-right font-mono text-sm text-foreground">
                                            {toMB(yearData.totalSize)}
                                        </div>
                                        <div className="hidden md:block md:col-span-3 text-right font-mono text-sm text-foreground">
                                            {toGB(yearData.totalSize)}
                                        </div>
                                    </div>

                                    {/* Children Rows (Distribution) */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-black/5"
                                            >
                                                {yearData.fileTypeDistribution.map((typeStats, index) => (
                                                    <div
                                                        key={`${yearData.year}-${typeStats.type}-${index}`}
                                                        className="grid grid-cols-12 gap-4 px-6 py-2 border-t border-border/10 hover:bg-white/5 transition-colors"
                                                    >
                                                        <div className="col-span-5 md:col-span-4 pl-10 flex items-center gap-3">
                                                            <FileText className="h-3.5 w-3.5 text-blue-400/70" />
                                                            <span className="text-sm font-medium text-muted-foreground">{typeStats.type}</span>
                                                        </div>
                                                        <div className="col-span-3 md:col-span-2 text-right font-mono text-sm text-muted-foreground/80">
                                                            {typeStats.count.toLocaleString()}
                                                        </div>
                                                        <div className="col-span-4 md:col-span-3 text-right font-mono text-sm text-muted-foreground/80">
                                                            {toMB(typeStats.size)}
                                                        </div>
                                                        <div className="hidden md:block md:col-span-3 text-right font-mono text-sm text-muted-foreground/80">
                                                            {toGB(typeStats.size)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                    {/* Summary Footer */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-amber-500/10 border-t border-amber-500/20 text-sm font-bold text-amber-500">
                        <div className="col-span-5 md:col-span-4 pl-2">Total</div>
                        <div className="col-span-3 md:col-span-2 text-right">
                            {data.reduce((acc, y) => acc + y.fileCount, 0).toLocaleString()}
                        </div>
                        <div className="col-span-4 md:col-span-3 text-right">
                            {toMB(data.reduce((acc, y) => acc + y.totalSize, 0))}
                        </div>
                        <div className="hidden md:block md:col-span-3 text-right">
                            {toGB(data.reduce((acc, y) => acc + y.totalSize, 0))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
