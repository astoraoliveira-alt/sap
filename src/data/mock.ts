export interface SapFile {
    id: string;
    name: string;
    type: string;
    size: number;
    date: string; // ISO date
    sapTable: string;
    sapRecordId: string;
}

export interface MonthData {
    month: number;
    monthName: string;
    fileCount: number;
    totalSize: number;
}

export interface YearData {
    year: number;
    fileCount: number;
    totalSize: number;
    months: MonthData[];
}

// Helpers
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Generation
const YEARS = [2021, 2022, 2023, 2024, 2025];
const FILE_TYPES = ['PDF', 'PDF', 'PDF', 'JPG', 'XLSX', 'DOCX'];
const SAP_TABLES = ['BKPF', 'BSEG', 'MARA', 'KNA1', 'LFA1'];

export const generateMockData = (): YearData[] => {
    return YEARS.map(year => {
        const months = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const fileCount = getRandomInt(100, 5000);
            const totalSize = fileCount * getRandomInt(50000, 5000000); // 50KB to 5MB avg

            return {
                month,
                monthName: new Date(year, i).toLocaleString('default', { month: 'long' }),
                fileCount,
                totalSize
            };
        });

        const yearlyTotalFiles = months.reduce((acc, curr) => acc + curr.fileCount, 0);
        const yearlyTotalSize = months.reduce((acc, curr) => acc + curr.totalSize, 0);

        return {
            year,
            fileCount: yearlyTotalFiles,
            totalSize: yearlyTotalSize,
            months
        };
    });
};

export const generateFilesForMonth = (year: number, month: number): SapFile[] => {
    // Generate 10-50 files for sample
    const count = getRandomInt(10, 20);
    return Array.from({ length: count }, (_, i) => ({
        id: `${year}-${month}-${i}`,
        name: `INV_${year}${month.toString().padStart(2, '0')}_${getRandomInt(1000, 9999)}.${FILE_TYPES[getRandomInt(0, FILE_TYPES.length - 1)]}`,
        type: FILE_TYPES[getRandomInt(0, FILE_TYPES.length - 1)],
        size: getRandomInt(100000, 10000000),
        date: new Date(year, month - 1, getRandomInt(1, 28)).toISOString(),
        sapTable: SAP_TABLES[getRandomInt(0, SAP_TABLES.length - 1)],
        sapRecordId: `DOC-${getRandomInt(1000000, 9999999)}`
    })).sort((a, b) => b.size - a.size);
};

export const MOCK_DATA = generateMockData();
export const TOTAL_SUMMARY = {
    years: YEARS.length,
    files: MOCK_DATA.reduce((acc, y) => acc + y.fileCount, 0),
    size: MOCK_DATA.reduce((acc, y) => acc + y.totalSize, 0)
};
