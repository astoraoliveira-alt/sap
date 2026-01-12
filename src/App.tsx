import { useState } from 'react';
import { Header } from './components/layout/Header';
import { AGStatCard, AGBarChart, AGAreaChart, AGSidePanel } from './components/dashboard/AGComponents';
import { MOCK_DATA, TOTAL_SUMMARY, generateFilesForMonth, type YearData, type MonthData, type SapFile } from './data/mock';
import { HardDrive, FileText, Calendar, ArrowLeft, FileCode, Database, Clock, X, File as FileIcon, BarChart as BarChartIcon, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { cn } from './lib/utils';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<YearData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);
  const [selectedFile, setSelectedFile] = useState<SapFile | null>(null);
  const [files, setFiles] = useState<SapFile[]>([]);
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [evolutionChartType, setEvolutionChartType] = useState<'bar' | 'area'>('bar');

  const handleYearClick = (data: any) => {
    const yearData = MOCK_DATA.find(y => y.year === data.year);
    if (yearData) setSelectedYear(yearData);
  };

  const handleMonthClick = (data: any) => {
    if (selectedYear && data) {
      const mId = data.month;
      const mData = selectedYear.months.find(m => m.month === mId);
      if (mData) {
        setSelectedMonth(mData);
        setFiles(generateFilesForMonth(selectedYear.year, mId));
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Header />

      <main className="pt-24 px-8 pb-12 max-w-[1600px] mx-auto space-y-8">

        <AnimatePresence mode="wait">
          {!selectedYear ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AGStatCard
                  title={t('totalYearsAnalyzed')}
                  value={TOTAL_SUMMARY.years.toString()}
                  icon={Calendar}
                  subValue="2021 - 2025"
                />
                <AGStatCard
                  title={t('totalFilesFound')}
                  value={TOTAL_SUMMARY.files.toLocaleString()}
                  icon={FileText}
                  subValue={t('acrossAllTables')}
                />
                <AGStatCard
                  title={t('totalStorage')}
                  value={formatSize(TOTAL_SUMMARY.size)}
                  icon={HardDrive}
                  subValue={t('estimatedConsumption')}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{t('storageEvolution')}</CardTitle>
                      <div className="flex items-center p-1 bg-muted rounded-lg border border-border">
                        <button
                          onClick={() => setEvolutionChartType('bar')}
                          className={cn(
                            "p-2 rounded-md transition-all",
                            evolutionChartType === 'bar' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          )}
                          title="Bar Chart"
                        >
                          <BarChartIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEvolutionChartType('area')}
                          className={cn(
                            "p-2 rounded-md transition-all",
                            evolutionChartType === 'area' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          )}
                          title="Area Chart"
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="pl-0">
                      {evolutionChartType === 'bar' ? (
                        <AGBarChart
                          data={MOCK_DATA}
                          xKey="year"
                          yKey="totalSize"
                          onBarClick={handleYearClick}
                          height={350}
                          title="" // Title handled by outer card
                        />
                      ) : (
                        <AGAreaChart
                          data={MOCK_DATA}
                          xKey="year"
                          yKey="totalSize"
                          height={350}
                          onDotClick={handleYearClick}
                        />
                      )}
                    </CardContent>
                  </Card>
                  <p className="mt-4 text-center text-sm text-muted-foreground">{t('clickYearDrillDown')}</p>
                </div>
                <div className="space-y-4">
                  <Card className="h-full bg-gradient-to-b from-card to-card/50">
                    <CardHeader>
                      <CardTitle>{t('quickInsights')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <h4 className="text-sm font-semibold text-primary mb-1">{t('highGrowth')}</h4>
                        <p className="text-xs text-muted-foreground">{t('highGrowthDesc')}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                        <h4 className="text-sm font-semibold text-foreground mb-1">{t('archiveCandidates')}</h4>
                        <p className="text-xs text-muted-foreground">{t('archiveCandidatesDesc')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="year-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => { setSelectedYear(null); setSelectedMonth(null); }}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> {t('backToOverview')}
                </button>
                <h2 className="text-2xl font-bold">{selectedYear.year} {t('analysis')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AGStatCard title={t('filesYear')} value={selectedYear.fileCount.toLocaleString()} icon={FileText} />
                <AGStatCard title={t('storageYear')} value={formatSize(selectedYear.totalSize)} icon={HardDrive} />
              </div>

              <Card className="p-6">
                <CardHeader className="px-0 pt-0 pb-6 flex flex-row items-center justify-between">
                  <CardTitle>{t('monthlyDistribution')}</CardTitle>
                  <div className="flex items-center p-1 bg-muted rounded-lg border border-border">
                    <button
                      onClick={() => setChartType('area')}
                      className={cn(
                        "p-2 rounded-md transition-all",
                        chartType === 'area' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                      title="Area Chart"
                    >
                      <Activity className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={cn(
                        "p-2 rounded-md transition-all",
                        chartType === 'bar' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                      title="Bar Chart"
                    >
                      <BarChartIcon className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                {chartType === 'area' ? (
                  <AGAreaChart
                    data={selectedYear.months}
                    xKey="monthName"
                    yKey="totalSize"
                    height={300}
                    onDotClick={handleMonthClick}
                  />
                ) : (
                  <AGBarChart
                    data={selectedYear.months}
                    xKey="monthName"
                    yKey="totalSize"
                    height={300}
                    onBarClick={handleMonthClick}
                    title=""
                  />
                )}
                <p className="mt-4 text-center text-sm text-muted-foreground">{t('clickMonthDrillDown')}</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <AGSidePanel
        isOpen={!!selectedMonth}
        onClose={() => setSelectedMonth(null)}
        title={`${selectedMonth?.monthName} ${selectedYear?.year}`}
      >
        <div className="space-y-4">
          {!files.length ? (
            <p className="text-muted-foreground">{t('noFilesFound')}</p>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedFile(file)}
                  className="group p-4 rounded-xl bg-card/50 border border-white/5 hover:border-primary/50 hover:bg-card cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <FileCode className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{file.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{file.sapTable} • {file.sapRecordId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-foreground">{formatSize(file.size)}</p>
                    <p className="text-[10px] text-muted-foreground">{file.type}</p>
                  </div>
                </motion.div>
              ))}
              <div className="text-center py-4">
                <span className="text-xs text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">{t('limitedToTop')}</span>
              </div>
            </div>
          )}
        </div>
      </AGSidePanel>

      {/* File Detail Modal */}
      <AnimatePresence>
        {selectedFile && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedFile(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none"
            >
              <div className="bg-card w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                  <div className="flex items-center gap-3">
                    <FileCode className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-bold text-lg">{selectedFile.name}</h3>
                      <p className="text-xs text-muted-foreground">ID: {selectedFile.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="p-2 hover:bg-white/10 rounded-full">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-0 flex-1 overflow-y-auto">
                  <div className="p-6 grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('fileMetadata')}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-background border border-border">
                          <span className="block text-xs text-muted-foreground mb-1">{t('size')}</span>
                          {formatSize(selectedFile.size)}
                        </div>
                        <div className="p-3 rounded-lg bg-background border border-border">
                          <span className="block text-xs text-muted-foreground mb-1">{t('type')}</span>
                          {selectedFile.type}
                        </div>
                        <div className="col-span-2 p-3 rounded-lg bg-background border border-border">
                          <span className="block text-xs text-muted-foreground mb-1">{t('createdAt')}</span>
                          {new Date(selectedFile.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('sapContext')}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">{t('sourceTable')}</span>
                          </div>
                          <span className="font-mono text-sm">{selectedFile.sapTable}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-400" />
                            <span className="text-sm">{t('retention')}</span>
                          </div>
                          <span className="font-mono text-sm text-green-400">{t('active')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="w-full h-48 rounded-xl bg-black/50 border border-white/5 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                      <FileIcon className="h-8 w-8 opacity-50" />
                      <p className="text-sm">{t('previewUnavailable')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
                  >
                    {t('close')}
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    {t('download')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
