import { useState, useRef, useEffect, useContext } from 'react';
import { Tooltip } from 'recharts';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { Empty } from '../components/Empty';
import { LanguageContext } from '../contexts/languageContext';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { getGradientColor, isDarkMode } from '../lib/utils';

// 定义订单数据接口（同时支持中英文字段）
interface OrderData {
  // 中文字段
  订单号?: string;
  包裹号?: string;
  订单标识?: string;
  是否合包?: string;
  合包类型?: string;
  波次号?: string;
  批次号?: string;
  预判产品?: string;
  商品数量?: number;
  包裹状态?: string;
  打包机打包?: string;
  是否取消?: string;
  库存仓库?: string;
  订单来源?: string;
  打包操作人?: string;
  打包完成时间?: string;
  目的地?: string;
  占用时间?: string;
  发货状态?: string;
  是否作废?: string;
  源包裹号?: string;
  包裹取消人?: string;
  包裹取消时间?: string;
  包裹取消原因?: string;
  合包地址?: string;
  一级取消原因?: string;
  二级取消原因?: string;
  取消原因补充?: string;
  包裹标签?: string;
  国家线?: string;
  出库作业园区?: string;
  出库作业子仓?: string;
  订单流入时间?: string;
  波次取消来源?: string;
  包裹系重?: string;
  包裹实重?: string;
  包裹系重_耗材重?: string;
  园区?: string;
  波次生成状态?: string;
  特殊标识?: string;
  计划分配时间?: string;
  时效值?: string;
  双时效值?: string;
  
  // 英文字段
  'Order No.'?: string;
  'Package number'?: string;
  'Order ID'?: string;
  'Consolidate'?: string;
  'package type'?: string;
  'Wave Number'?: string;
  'Batch Number'?: string;
  'Predict product'?: string;
  'Qty'?: number;
  'Package Status'?: string;
  'Pack with a packing machine'?: string;
  'Cancel?'?: string;
  'Inventory warehouse'?: string;
  'Order source'?: string;
  'Packed by'?: string;
  'Packing completion time'?: string;
  'Destination'?: string;
  'Occupied time'?: string;
  'Shipment status'?: string;
  'Void?'?: string;
  'Source package No.'?: string;
  'Package canceled by'?: string;
  'Package canceling time'?: string;
  'Reason for package cancellation'?: string;
  'Consolidation address'?: string;
  'Primary Reason for Cancellation'?: string;
  'Secondary Reason for Cancellation'?: string;
  'Supplementary reason for cancellation'?: string;
  'Package label'?: string;
  'National line'?: string;
  'Outbound park'?: string;
  'Outbound Operation Sub-warehouse'?: string;
  'Order inbounding time'?: string;
  'Wave Cancellation Source'?: string;
  'System weight of package'?: string;
  'Actual package weight'?: string;
  'Package weight+consumables weight'?: string;
  'park'?: string;
  'Wave generation state'?: string;
  'Special Identifier'?: string;
  'schedule allocation time'?: string;
  '时效值（N日达系数）'?: string;
  '双时效值（时效表达日期）'?: string;
}

// 定义员工效率数据接口
interface WorkerEfficiencyData {
  timeSlot: string;
  workerName: string;
  packageCount: number;
  itemCount: number;
}

// 模拟数据生成函数
const generateMockData = (): OrderData[] => {
  const workers = ['张三', '李四', '王五', '赵六', '钱七'];
  const mockData: OrderData[] = [];
  
  // 生成过去24小时的数据
  for (let i = 0; i < 24; i++) {
    const baseTime = new Date();
    baseTime.setHours(baseTime.getHours() - i);
    
    workers.forEach(worker => {
      // 每个员工每小时随机生成5-15个包裹
      const packageCount = Math.floor(Math.random() * 11) + 5;
      
      for (let j = 0; j < packageCount; j++) {
        // 每个包裹随机1-5个商品
        const itemCount = Math.floor(Math.random() * 5) + 1;
        
        mockData.push({
          订单号: `ORD${baseTime.getTime()}-${j}`,
          包裹号: `PKG${baseTime.getTime()}-${j}`,
          订单标识: j % 2 === 0 ? '普通订单' : '加急订单',
          是否合包: j % 3 === 0 ? '是' : '否',
          合包类型: j % 3 === 0 ? '标准合包' : '',
          波次号: `WAVE${Math.floor(Math.random() * 100)}`,
          批次号: `BATCH${Math.floor(Math.random() * 1000)}`,
          预判产品: `产品${Math.floor(Math.random() * 1000)}`,
          商品数量: itemCount,包裹状态: '已完成',
          打包机打包: j % 4 === 0 ? '是' : '否',
          是否取消: '否',
          库存仓库: `仓库${Math.floor(Math.random() * 5) + 1}`,
          订单来源: ['京东', '淘宝', '天猫', '拼多多'][Math.floor(Math.random() * 4)],
          打包操作人: worker,
          打包完成时间: baseTime.toISOString(),
          目的地: `城市${Math.floor(Math.random() * 100)}`,
          占用时间: `${Math.floor(Math.random() * 60) + 30}分钟`,
          发货状态: '已发货',
          是否作废: '否',
          源包裹号: '',
          包裹取消人: '',
          包裹取消时间: '',
          包裹取消原因: '',
          合包地址: '',
          一级取消原因: '',
          二级取消原因: '',
          取消原因补充: '',
          包裹标签: '',
          国家线: '',
          出库作业园区: `园区${Math.floor(Math.random() * 3) + 1}`,
          出库作业子仓: `子仓${Math.floor(Math.random() * 10) + 1}`,
          订单流入时间: new Date(baseTime.getTime() - 3600000).toISOString(),
          波次取消来源: '',
          包裹系重: `${Math.random() * 5 + 0.5}kg`,
          包裹实重: `${Math.random() * 5 + 0.5}kg`,
          包裹系重_耗材重: `${Math.random() * 5.5 + 0.5}kg`,
          园区: `园区${Math.floor(Math.random() * 3) + 1}`,
          波次生成状态: '已生成',
          特殊标识: '',
          计划分配时间: new Date(baseTime.getTime() - 1800000).toISOString(),
          时效值: `${Math.floor(Math.random() * 3) + 1}`,
          双时效值: new Date(baseTime.getTime() + 86400000 * (Math.floor(Math.random() * 3) + 1)).toISOString(),
        });
      }
    });
  }
  
  return mockData;
};

// 处理CSV文件的函数
const processCSV = (content: string): OrderData[] => {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(header => header.trim());
  const data: OrderData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row: any = {};
    
    headers.forEach((header, index) => {
      // 处理数字字段：商品数量或Qty
      if (header === '商品数量' || header === 'Qty') {
        row[header] = parseInt(values[index]) || 0;
      } else {
        row[header] = values[index] || '';
      }
    });
    
    data.push(row);
  }
  
  return data;
};

// 处理XLSX文件的函数
const processXLSX = (buffer: ArrayBuffer): OrderData[] => {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 将工作表转换为JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    if (jsonData.length === 0) return [];
    
    // 处理数据
    const data: OrderData[] = jsonData.map(row => {
      const orderRow: any = {};
      
      // 遍历行中的所有键值对
      Object.keys(row).forEach(key => {
        const trimmedKey = key.trim();
        // 特殊处理数量字段为数字：商品数量或Qty
        if (trimmedKey === '商品数量' || trimmedKey === 'Qty') {
          orderRow[trimmedKey] = parseInt(row[key] as string) || 0;
        } else {
          orderRow[trimmedKey] = row[key] || '';
        }
      });
      
      return orderRow;
    });
    
    return data;
  } catch (error) {
    console.error('XLSX文件解析错误:', error);
    throw new Error('XLSX文件解析失败');
  }
};

// 统计员工效率数据（支持中英文字段）
const calculateEfficiencyData = (orderData: OrderData[]): WorkerEfficiencyData[] => {
  const efficiencyMap = new Map<string, { packageCount: number; itemCount: number }>();
  
  orderData.forEach(order => {
    // 获取打包完成时间（支持中英文字段）
    const completionTime = order.打包完成时间 || order['Packing completion time'];
    if (!completionTime) return; // 如果没有时间数据则跳过
    
    const time = new Date(completionTime);
    // 格式化为小时级别时间槽
    const timeSlot = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')} ${String(time.getHours()).padStart(2, '0')}:00`;
    
    // 获取打包操作人（支持中英文字段）
    const workerName = order.打包操作人 || order['Packed by'] || 'Unknown';
    
    // 获取商品数量（支持中英文字段）
    const itemCount = order.商品数量 || order['Qty'] || 0;
    
    const key = `${timeSlot}_${workerName}`;
    
    if (efficiencyMap.has(key)) {
      const current = efficiencyMap.get(key)!;
      efficiencyMap.set(key, {
        packageCount: current.packageCount + 1,
        itemCount: current.itemCount + itemCount
      });
    } else {
      efficiencyMap.set(key, {
        packageCount: 1,
        itemCount: itemCount
      });
    }
  });
  
  // 转换为数组格式
  const efficiencyData: WorkerEfficiencyData[] = [];
  efficiencyMap.forEach((value, key) => {
    const [timeSlot, workerName] = key.split('_');
    efficiencyData.push({
      timeSlot,
      workerName,
      packageCount: value.packageCount,
      itemCount: value.itemCount
    });
  });
  
  // 按时间槽和员工名排序
  return efficiencyData.sort((a, b) => {
    if (a.timeSlot !== b.timeSlot) {
      return a.timeSlot.localeCompare(b.timeSlot);
    }
    return a.workerName.localeCompare(b.workerName);
  });
};

// 获取所有不重复的员工名
const getUniqueWorkers = (efficiencyData: WorkerEfficiencyData[]): string[] => {
  const workers = new Set<string>();
  efficiencyData.forEach(item => workers.add(item.workerName));
  return Array.from(workers);
};

// 获取时间范围
const getTimeRange = (efficiencyData: WorkerEfficiencyData[]): string[] => {
  const timeSlots = new Set<string>();
  efficiencyData.forEach(item => timeSlots.add(item.timeSlot));
  return Array.from(timeSlots).sort();
};

// 计算总览数据
const calculateSummaryData = (efficiencyData: WorkerEfficiencyData[]) => {const workerStats = new Map<string, { totalPackages: number; totalItems: number; avgPackagesPerHour: number; avgItemsPerHour: number }>();
  
  // 按员工分组统计
  efficiencyData.forEach(item => {
    if (workerStats.has(item.workerName)) {
      const stats = workerStats.get(item.workerName)!;
      stats.totalPackages += item.packageCount;
      stats.totalItems += item.itemCount;
    } else {
      workerStats.set(item.workerName, {
        totalPackages: item.packageCount,
        totalItems: item.itemCount,
        avgPackagesPerHour: 0, // 先设为0，后面计算
        avgItemsPerHour: 0     // 先设为0，后面计算
      });
    }
  });
  
  // 计算每小时平均值
  const uniqueHours = new Set(efficiencyData.map(item => item.timeSlot)).size;
  workerStats.forEach(stats => {
    stats.avgPackagesPerHour = Number((stats.totalPackages / Math.max(uniqueHours, 1)).toFixed(1));
    stats.avgItemsPerHour = Number((stats.totalItems / Math.max(uniqueHours, 1)).toFixed(1));
  });
  
  // 转换为数组并排序
  const summaryData = Array.from(workerStats.entries()).map(([name, stats]) => ({
    name,
    ...stats
  }));
  
  // 按总包裹数排序
  return summaryData.sort((a, b) => b.totalPackages - a.totalPackages);
};

// 这两个函数已从@/lib/utils导入，请勿在文件中重新定义

export default function Home() {
  const { language, setLanguage, t } = useContext(LanguageContext);
  
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<WorkerEfficiencyData[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'packageCount' | 'itemCount'>('packageCount');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hourlySortConfig, setHourlySortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' | null }>({
    key: '',
    direction: null
  });
  const [summarySortConfig, setSummarySortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' | null }>({
    key: '',
    direction: null
  });
  const [sortValuesRange, setSortValuesRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0
  });
  const [showWorkerDropdown, setShowWorkerDropdown] = useState<boolean>(false);
  const [workerSearchTerm, setWorkerSearchTerm] = useState<string>('');
  
  // 为两个表格容器创建ref
  const hourlyTableContainerRef = useRef<HTMLDivElement>(null);
  const summaryTableContainerRef = useRef<HTMLDivElement>(null);
  // 为包含关键指标和单小时表的容器创建ref
  const hourlyReportContainerRef = useRef<HTMLDivElement>(null);
  
  // 导出图片的函数
  const exportTableAsImage = async (containerRef: React.RefObject<HTMLDivElement>, fileName: string) => {
    if (!containerRef.current) {
      toast.error('无法找到表格容器');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 配置html2canvas选项
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 增加清晰度
        logging: false,
        useCORS: true,
        windowWidth: containerRef.current.scrollWidth,
        windowHeight: containerRef.current.scrollHeight
      });
      
      // 将canvas转换为图片并下载
      const link = document.createElement('a');
      link.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success(t('notification.exportSuccess', { fileName }));
    } catch (error) {
      console.error('导出图片失败:', error);
      toast.error(t('notification.exportError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // 加载模拟数据
  useEffect(() => {
    const mockData = generateMockData();
    setOrderData(mockData);
    const efficiency = calculateEfficiencyData(mockData);
    setEfficiencyData(efficiency);
    
    const workers = getUniqueWorkers(efficiency);
    const timeRange = getTimeRange(efficiency);
    
    setSelectedWorkers(workers);
    setSelectedTimeRange(timeRange);
  }, []);
  
  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    const reader = new FileReader();
    
    // 根据文件类型选择不同的读取方法
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const processedData = processXLSX(buffer);
          setOrderData(processedData);
          
          const efficiency = calculateEfficiencyData(processedData);
          setEfficiencyData(efficiency);
          
          const workers = getUniqueWorkers(efficiency);
          const timeRange = getTimeRange(efficiency);
          
          setSelectedWorkers(workers);
          setSelectedTimeRange(timeRange);
          
          toast.success(t('notification.importSuccess', { count: processedData.length }));
        } catch (error) {
          toast.error(t('notification.importError', { type: 'XLSX' }));
          console.error('XLSX文件解析错误:', error);
        } finally {
          setIsLoading(false);
          // 重置文件输入
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      
      reader.onerror = () => {
        toast.error(t('notification.readError'));
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
      reader.readAsArrayBuffer(file);
    } else {
      // 处理CSV文件
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const processedData = processCSV(content);
          setOrderData(processedData);
          
          const efficiency = calculateEfficiencyData(processedData);
          setEfficiencyData(efficiency);
          
          const workers = getUniqueWorkers(efficiency);
          const timeRange = getTimeRange(efficiency);
          
          setSelectedWorkers(workers);
          setSelectedTimeRange(timeRange);
          
          toast.success(t('notification.importSuccess', { count: processedData.length }));
        } catch (error) {
          toast.error(t('notification.importError', { type: 'CSV' }));
          console.error('CSV文件解析错误:', error);
        } finally {
          setIsLoading(false);
          // 重置文件输入
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      
      reader.onerror = () => {
        toast.error(t('notification.readError'));
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
      reader.readAsText(file);
    }
  };
  
  // 切换员工筛选
  const toggleWorker = (worker: string) => {
    setSelectedWorkers(prev => {
      if (prev.includes(worker)) {
        return prev.filter(w => w !== worker);
      } else {
        return [...prev, worker];
      }
    });
  };
  
  // 切换时间筛选
  const toggleTimeSlot = (timeSlot: string) => {
    setSelectedTimeRange(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(t => t !== timeSlot);
      } else {
        return [...prev, timeSlot].sort();
      }
    });
  };
  
  // 处理员工效率单小时表的排序功能
  const handleHourlySort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    if (hourlySortConfig.key === key && hourlySortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (hourlySortConfig.key === key && hourlySortConfig.direction === 'descending') {
      direction = null;
    }
    
    setHourlySortConfig({ key, direction });
    
    // 当点击排序时，计算该列的值范围，用于背景色渐变
    if (direction !== null) {
      // 创建员工与值的映射
      const workerValues = new Map<string, number>();
      
      selectedWorkers.forEach(workerName => {
        let value = 0;
        
        if (key === 'total') {
          // 计算总计值
          selectedTimeRange.forEach(timeSlot => {
            const dataPoint = filteredEfficiencyData.find(
              item => item.workerName === workerName && item.timeSlot === timeSlot
            );
            value += dataPoint ? dataPoint[chartType] : 0;
          });
        } else {
          // 计算特定时间段的值
          const dataPoint = filteredEfficiencyData.find(
            item => item.workerName === workerName && item.timeSlot === key
          );
          value = dataPoint ? dataPoint[chartType] : 0;
        }
        
        workerValues.set(workerName, value);
      });
      
      // 计算最小值和最大值
      const values = Array.from(workerValues.values()).filter(v => v > 0);
      if (values.length > 0) {
        setSortValuesRange({
          min: Math.min(...values),
          max: Math.max(...values)
        });
      }
    }
  };

  // 处理员工效率汇总表的排序功能
  const handleSummarySort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    if (summarySortConfig.key === key && summarySortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (summarySortConfig.key === key && summarySortConfig.direction === 'descending') {
      direction = null;
    }
    setSummarySortConfig({ key, direction });
  };
  
  // 筛选数据
  const filteredEfficiencyData = efficiencyData.filter(
    item => selectedWorkers.includes(item.workerName) && selectedTimeRange.includes(item.timeSlot)
  );
  
  // 获取所有员工和时间槽
  const allWorkers = getUniqueWorkers(efficiencyData);
  const allTimeSlots = getTimeRange(efficiencyData);
  
  // 计算总览数据
  const summaryData = calculateSummaryData(filteredEfficiencyData);
  
  // 检查是否有数据
  const hasData = orderData.length > 0;
  
  // 点击页面其他地方关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 确保点击的不是下拉菜单或其内部元素
      if (showWorkerDropdown && !target.closest('.group')) {
        setShowWorkerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWorkerDropdown]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 页面标题 */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <i className="fa-solid fa-boxes-stacked mr-2 text-blue-600 dark:text-blue-400"></i>
            {t('app.title')}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-slate-600 dark:text-slate-300 text-sm">
              {t('nav.lastUpdated')}{new Date().toLocaleString(language === 'en' ? 'en-US' : 'zh-CN')}
            </span>
          </div>
          {/* 语言切换按钮 */}
          <div className="relative">
            <button 
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750"
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            >
              {language === 'en' ? (
                <>
                  <i className="fa-solid fa-globe mr-1"></i>
                  <span>{t('language.en')}</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-globe mr-1"></i>
                  <span>{t('language.zh')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* 文件上传区域 */}
        <section className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <i className="fa-solid fa-upload mr-2 text-blue-600 dark:text-blue-400"></i>
              {t('data.import')}
            </h2>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".csv,.xlsx,.xls" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                  <p className="mt-4 text-slate-600 dark:text-slate-300">{t('data.loading')}</p>
                </div>
              ) : (
                <>
                   <div className="flex justify-center space-x-4">
                     <i className="fa-solid fa-file-csv text-5xl text-slate-400 dark:text-slate-500 mb-4"></i>
                     <i className="fa-solid fa-file-excel text-5xl text-slate-400 dark:text-slate-500 mb-4"></i>
                   </div>
                   <p className="text-slate-600 dark:text-slate-300 mb-2">{t('data.uploadCsv')}</p>
                   <p className="text-slate-400 dark:text-slate-500 text-sm">{t('data.fileInfo')}</p>
                  {hasData && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg inline-block">
                      <i className="fa-solid fa-check-circle mr-1"></i> {t('data.loaded', { count: orderData.length })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
        
        {hasData ? (
          <>
            {/* 筛选器区域 */}
            <section className="mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                  <i className="fa-solid fa-filter mr-2 text-blue-600 dark:text-blue-400"></i>
                  {t('filter.title')}
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 员工筛选 - 下拉菜单样式 */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-3">{t('filter.selectWorkers')}</h3>
                    <div className="relative">
                      <div className="group">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all hover:border-blue-300 dark:hover:border-blue-500"
                          onClick={() => setShowWorkerDropdown(!showWorkerDropdown)}
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {selectedWorkers.length > 0 
                              ? t('filter.workersSelected', { count: selectedWorkers.length }) 
                              : t('filter.selectWorkersPlaceholder')}
                          </span>
                          <i className={`fa-solid fa-chevron-down ml-2 text-xs text-slate-500 dark:text-slate-400 transition-transform ${showWorkerDropdown ? 'transform rotate-180' : ''}`}></i>
                        </button>
                        
                        {showWorkerDropdown && (
                          <div className="absolute z-20 mt-2 w-full rounded-lg bg-white dark:bg-slate-700 shadow-lg border border-slate-200 dark:border-slate-600 overflow-hidden max-h-60 overflow-y-auto">
                            {/* 搜索框 */}
                            <div className="p-3 border-b border-slate-200 dark:border-slate-600">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder={t('filter.searchWorkers')}
                                  value={workerSearchTerm}
                                  onChange={(e) => setWorkerSearchTerm(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-slate-800 dark:text-white text-sm"
                                />
                                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                              </div>
                            </div>
                            
                            {/* 员工列表 */}
                            <div className="divide-y divide-slate-200 dark:divide-slate-600">
                              {allWorkers
                                .filter(worker => worker.toLowerCase().includes(workerSearchTerm.toLowerCase()))
                                .map(worker => (
                                  <div
                                    key={worker}
                                    className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors ${
                                      selectedWorkers.includes(worker) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                    onClick={() => toggleWorker(worker)}
                                  >
                                    <div className="flex items-center">
                                      {selectedWorkers.includes(worker) ? (
                                        <i className="fa-solid fa-check-circle text-blue-600 dark:text-blue-400 mr-2"></i>
                                      ) : (
                                        <i className="fa-regular fa-circle text-slate-300 dark:text-slate-500 mr-2"></i>
                                      )}
                                      <span className="text-sm text-slate-800 dark:text-slate-200">{worker}</span>
                                    </div>
                                    {selectedWorkers.includes(worker) && (
                                      <i className="fa-solid fa-check text-xs text-blue-600 dark:text-blue-400"></i>
                                    )}
                                  </div>
                                ))}
                            </div>
                            
                            {/* 全选/清除按钮 */}
                            <div className="p-3 border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 flex justify-between">
                              <button
                                type="button"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium focus:outline-none"
                                onClick={() => setSelectedWorkers([...allWorkers])}
                              >
                                {t('filter.selectAll')}
                              </button>
                              <button
                                type="button"
                                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium focus:outline-none"
                                onClick={() => setSelectedWorkers([])}
                              >
                                {t('filter.clear')}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 时间筛选 */}
                  <div>
                    <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-3">{t('filter.selectTime')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTimeSlots.slice(-12).map(timeSlot => (
                        <button
                          key={timeSlot}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedTimeRange.includes(timeSlot) 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                          } transition-colors`}
                          onClick={() => toggleTimeSlot(timeSlot)}
                        >
                          {timeSlot.split(' ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </section>
            
                {/* 总览数据和员工效率单小时表合并区域 */}
                <section className="mb-8 relative z-0" ref={hourlyReportContainerRef}>
                 <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
                  {/* 总览数据卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-750 dark:to-slate-800 rounded-xl shadow-sm p-5 border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('overview.totalOrders')}</p>
                          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{orderData.length}</h3>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                          <i className="fa-solid fa-file-invoice text-blue-600 dark:text-blue-400 text-xl"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-750 dark:to-slate-800 rounded-xl shadow-sm p-5 border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('overview.totalItems')}</p>
                           <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                              {orderData.reduce((sum, order) => sum + (order.商品数量 || order['Qty'] || 0), 0)}
                            </h3>
                          </div>
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                          <i className="fa-solid fa-box text-red-600 dark:text-red-400 text-xl"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-750 dark:to-slate-800 rounded-xl shadow-sm p-5 border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('overview.avgItemsPerOrder')}</p>
                          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                            {orderData.length > 0 
                               ? (orderData.reduce((sum, order) => sum + (order.商品数量 || order['Qty'] || 0), 0) / orderData.length).toFixed(1) 
                              : 0}
                          </h3>
                        </div>
                        <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-lg">
                          <i className="fa-solid fa-calculator text-teal-600 dark:text-teal-400 text-xl"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-750 dark:to-slate-800 rounded-xl shadow-sm p-5 border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('overview.avgPackagesPerHour')}</p>
                          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                            {orderData.length > 0 ? Math.round(orderData.length / Math.max(allTimeSlots.length, 1)) : 0}
                          </h3>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                          <i className="fa-solid fa-chart-line text-purple-600 dark:text-purple-400 text-xl"></i>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-750 dark:to-slate-800 rounded-xl shadow-sm p-5 border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('overview.avgItemsPerHour')}</p>
                          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                            {orderData.length > 0 
                               ? Math.round(orderData.reduce((sum, order) => sum + (order.商品数量 || order['Qty'] || 0), 0) / Math.max(allTimeSlots.length, 1)) 
                              : 0}
                          </h3>
                        </div>
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                          <i className="fa-solid fa-chart-bar text-indigo-600 dark:text-indigo-400 text-xl"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                   {/* 员工效率单小时表 */}
                   <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
                       <i className="fa-solid fa-clock mr-2 text-blue-600 dark:text-blue-400"></i>
                       {t('hourlyTable.title')}
                     </h2>
                      <button
                        onClick={() => exportTableAsImage(hourlyReportContainerRef, '员工效率单小时表')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <i className="fa-solid fa-download mr-2"></i>
                        {t('hourlyTable.exportImage')}
                      </button>
                   </div>
                   
                   {/* 选择显示类型：包裹数量或商品数量 */}
                   <div className="mb-4 flex justify-end">
                     <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                       <button
                         className={`px-4 py-2 rounded-md text-sm font-medium ${
                           chartType === 'packageCount'
                             ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                             : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                         } transition-colors`}
                         onClick={() => setChartType('packageCount')}
                       >
                         {t('hourlyTable.showPackages')}
                       </button>
                       <button
                         className={`px-4 py-2 rounded-md text-sm font-medium ${
                           chartType === 'itemCount'
                             ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                             : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                         } transition-colors`}
                         onClick={() => setChartType('itemCount')}
                       >
                         {t('hourlyTable.showItems')}
                       </button>
                     </div>
                   </div>
                   
                     <div className="overflow-x-auto" ref={hourlyTableContainerRef}>
                     <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                       <thead className="bg-slate-50 dark:bg-slate-750">
                          <tr>
                            <th scope="col" className="px-2 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-750 z-10 border-r border-slate-200 dark:border-slate-700">
                              {t('hourlyTable.serialNumber')}
                            </th>
                             <th scope="col" className="w-[80px] px-2 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider sticky left-8 bg-slate-50 dark:bg-slate-750 z-10 border-r border-slate-200 dark:border-slate-700">
                               {t('hourlyTable.workerName')}
                             </th>
                           {selectedTimeRange.map(timeSlot => (
                             <th 
                               key={timeSlot} 
                               scope="col" 
                              className="px-2 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              onClick={() => handleHourlySort(timeSlot)}
                            >
                              <div className="flex items-center justify-center space-x-1">
                                <span>{timeSlot.split(' ')[1]}</span>
                                {hourlySortConfig.key === timeSlot && (
                                  <i className={`fa-solid text-xs ${
                                    hourlySortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down'
                                  }`}></i>
                                 )}
                               </div>
                             </th>
                           ))}
                           <th 
                             scope="col" 
                            className="px-2 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider sticky right-0 bg-slate-50 dark:bg-slate-750 z-10 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => handleHourlySort('total')}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              <span>{t('hourlyTable.total')}</span>
                              {hourlySortConfig.key === 'total' && (
                                <i className={`fa-solid text-xs ${
                                  hourlySortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down'
                                }`}></i>
                             )}
                           </div>
                         </th>
                         </tr>
                       </thead>
                       <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                         {/* 为每位员工创建一行并应用排序 */}
                         {(() => {
                           // 计算每个员工的总计值并准备排序
                           const workersWithTotals = selectedWorkers.map(workerName => {
                             let total = 0;
                             const timeSlotValues = new Map<string, number>();
                             
                             // 计算每个时间段的值和总计
                             selectedTimeRange.forEach(timeSlot => {
                               const dataPoint = filteredEfficiencyData.find(
                                 item => item.workerName === workerName && item.timeSlot === timeSlot
                               );
                               const value = dataPoint ? dataPoint[chartType] : 0;
                               timeSlotValues.set(timeSlot, value);
                               total += value;
                             });
                             
                             return {
                               workerName,
                               total,
                               timeSlotValues
                             };
                           });
                           
                           // 应用排序
                           if (hourlySortConfig.direction !== null) {
                             workersWithTotals.sort((a, b) => {
                               // 如果排序键是'total'，则按总计排序
                               if (hourlySortConfig.key === 'total') {
                                 return hourlySortConfig.direction === 'ascending' ? a.total - b.total : b.total - a.total;
                               }
                               // 否则按指定时间段的值排序
                               const aValue = a.timeSlotValues.get(hourlySortConfig.key) || 0;
                               const bValue = b.timeSlotValues.get(hourlySortConfig.key) || 0;
                               return hourlySortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
                             });
                           }
                           
                           // 计算当前排序列的数值范围，用于色阶
                           let minValue = Infinity;
                           let maxValue = -Infinity;
                           
                           if (hourlySortConfig.direction !== null) {
                             // 找出当前排序列的最小和最大值
                             workersWithTotals.forEach(worker => {
                               const value = hourlySortConfig.key === 'total' 
                                 ? worker.total 
                                 : (worker.timeSlotValues.get(hourlySortConfig.key) || 0);
                               
                               if (value < minValue) minValue = value;
                               if (value > maxValue) maxValue = value;
                             });
                           }
                           
                           // 使用新的 sortValuesRange 状态或回退到本地计算的 minValue/maxValue
                           const effectiveMinValue = sortValuesRange.min !== 0 || sortValuesRange.max !== 0 
                             ? sortValuesRange.min 
                             : minValue;
                           const effectiveMaxValue = sortValuesRange.min !== 0 || sortValuesRange.max !== 0 
                             ? sortValuesRange.max 
                             : maxValue;
                           
                           // 渲染排序后的员工数据
                           return workersWithTotals.map(({ workerName, timeSlotValues, total }, index) => (
                             <tr key={workerName} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                                <td className="px-2 py-2 whitespace-nowrap sticky left-0 bg-white dark:bg-slate-800 z-0 border-r border-slate-200 dark:border-slate-700">
                                  <div className="font-medium text-slate-500 dark:text-slate-400 text-sm text-center">{index + 1}</div>
                                </td>
                                 <td className="w-[80px] px-2 py-2 whitespace-nowrap sticky left-8 bg-white dark:bg-slate-800 z-0 border-r border-slate-200 dark:border-slate-700">
                                   <div className="font-medium text-slate-800 dark:text-white text-sm">{workerName}</div>
                                 </td>
                               
                               {/* 为每个时间段创建一个单元格 */}
                               {selectedTimeRange.map(timeSlot => {
                                 const value = timeSlotValues.get(timeSlot) || 0;
                                 
                                 // 判断是否是当前排序列，如果是则应用背景色渐变
                                 const isSortedColumn = hourlySortConfig.direction !== null && hourlySortConfig.key === timeSlot;
                                 
                                 // 计算背景色 - 应用到整个单元格
                                 const bgColorClass = isSortedColumn && value > 0 && effectiveMinValue !== effectiveMaxValue
                                   ? getGradientColor(value, effectiveMinValue, effectiveMaxValue, isDarkMode())
                                   : '';
                                 
                                 return (
                                   <td key={`${workerName}-${timeSlot}`} className={`px-2 py-2 whitespace-nowrap text-center ${bgColorClass} transition-colors`}>
                                     <div className={`text-sm ${
                                       value > 0 ? 'font-medium text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                                     }`}>
                                       {value}
                                     </div>
                                   </td>
                                 );
                               })}
                               
                                {/* 总计列 */}
                                <td className={`px-2 py-2 whitespace-nowrap text-center sticky right-0 bg-white dark:bg-slate-800 z-0 border-l border-slate-200 dark:border-slate-700 ${
                                  hourlySortConfig.direction !== null && hourlySortConfig.key === 'total' && total > 0 && effectiveMinValue !== effectiveMaxValue
                                    ? getGradientColor(total, effectiveMinValue, effectiveMaxValue, isDarkMode())
                                    : ''
                                } transition-colors`}>
                                  <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">{total}</div>
                                </td>
                             </tr>
                           ));
                         })()}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </section>
             
             {/* 员工效率汇总表 */}
             <section className="mb-8">
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
                     <i className="fa-solid fa-table mr-2 text-blue-600 dark:text-blue-400"></i>
                     {t('summaryTable.title')}
                   </h2>
                   <button
                     onClick={() => exportTableAsImage(summaryTableContainerRef, '员工效率汇总表')}
                     className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                   >
                     <i className="fa-solid fa-download mr-2"></i>
                     {t('summaryTable.exportImage')}
                   </button>
                 </div>
                 <div className="overflow-x-auto" ref={summaryTableContainerRef}>
                   <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                     <thead className="bg-slate-50 dark:bg-slate-750">
                        <tr>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                             <div className="flex items-center space-x-1">
                               <span>{t('summaryTable.rank')}</span>
                               {summarySortConfig.key === 'rank' && (
                                 <i className={`fa-solid text-xs ${
                                   summarySortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down'
                                 }`}></i>
                               )}
                             </div>
                           </th>
                           <th 
                             scope="col" 
                             className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                             onClick={() => handleSummarySort('name')}
                           >
                             <div className="flex items-center space-x-1">
                               <span>{t('hourlyTable.workerName')}</span>
                               {summarySortConfig.key === 'name' && (
                                 <i className={`fa-solid text-xs ${
                                   summarySortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down'
                                 }`}></i>
                               )}
                             </div>
                           </th>
                           <th 
                             scope="col" 
                             className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                             onClick={() => handleSummarySort('totalPackages')}
                           >
                             <div className="flex items-center space-x-1">
                               <span>{t('summaryTable.totalPackages')}</span>
                               {summarySortConfig.key === 'totalPackages' && (
                                 <i className={`fa-solid text-xs ${
                                   summarySortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down'
                                 }`}></i>
                               )}
                             </div>
                           </th>
                           <th 
                             scope="col" 
                             className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                             onClick={() => handleSummarySort('totalItems')}
                           >
                             <div className="flex items-center space-x-1">
                               <span>{t('summaryTable.totalItems')}</span>
                               {summarySortConfig.key === 'totalItems' && (
                                 <i className={`fa-solid text-xs ${
                                   summarySortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down'
                                 }`}></i>
                               )}
                             </div>
                           </th>
                           <th 
                             scope="col" 
                             className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                             onClick={() => handleSummarySort('avgPackagesPerHour')}
                           >
                             <div className="flex items-center space-x-1">
                               <span>{t('summaryTable.avgPackagesPerHour')}</span>
                               {summarySortConfig.key === 'avgPackagesPerHour' && (
                                 <i className={`fa-solid text-xs ${
                                   summarySortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down'
                                 }`}></i>
                               )}
                             </div>
                           </th>
                           <th 
                             scope="col" 
                             className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                             onClick={() => handleSummarySort('avgItemsPerHour')}
                           >
                             <div className="flex items-center space-x-1">
                               <span>{t('summaryTable.avgItemsPerHour')}</span>
                               {summarySortConfig.key === 'avgItemsPerHour' && (
                                 <i className={`fa-solid text-xs ${
                                   summarySortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down'
                                 }`}></i>
                               )}
                             </div>
                           </th>
                         </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {(() => {
                          // 应用排序到汇总数据
                          const sortedSummaryData = [...summaryData];
                          
                          if (summarySortConfig.direction !== null) {
                            sortedSummaryData.sort((a, b) => {
                              if (summarySortConfig.key === 'name') {
                                // 按姓名排序（字符串比较）
                                const nameCompare = a.name.localeCompare(b.name);
                                return summarySortConfig.direction === 'ascending' ? nameCompare : -nameCompare;
                              } else if (summarySortConfig.key === 'totalPackages') {
                                // 按总包裹数排序
                                return summarySortConfig.direction === 'ascending' 
                                  ? a.totalPackages - b.totalPackages 
                                  : b.totalPackages - a.totalPackages;
                              } else if (summarySortConfig.key === 'totalItems') {
                                // 按总商品数排序
                                return summarySortConfig.direction === 'ascending' 
                                  ? a.totalItems - b.totalItems 
                                  : b.totalItems - a.totalItems;
                              } else if (summarySortConfig.key === 'avgPackagesPerHour') {
                                // 按每小时平均包裹数排序
                                return summarySortConfig.direction === 'ascending' 
                                  ? a.avgPackagesPerHour - b.avgPackagesPerHour 
                                  : b.avgPackagesPerHour - a.avgPackagesPerHour;
                              } else if (summarySortConfig.key === 'avgItemsPerHour') {
                                // 按每小时平均商品数排序
                                return summarySortConfig.direction === 'ascending' 
                                  ? a.avgItemsPerHour - b.avgItemsPerHour 
                                  : b.avgItemsPerHour - a.avgItemsPerHour;
                              }
                              // 默认按原始顺序
                              return 0;
                            });
                          }
                          
                          // 渲染排序后的数据
                          return sortedSummaryData.map((worker, index) => (
                            <tr 
                              key={worker.name}
                              className={cn(
                                "hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors",
                                // 当没有排序或按总包裹数排序时，保留前三名的特殊样式
                                (!summarySortConfig.key || summarySortConfig.key === 'totalPackages') && 
                                  summarySortConfig.direction !== 'ascending' && (
                                    index === 0 ? "bg-amber-50 dark:bg-amber-900/10" : 
                                    index === 1 ? "bg-slate-50 dark:bg-slate-750" : 
                                    index === 2 ? "bg-orange-50 dark:bg-orange-900/10" : ""
                                  )
                              )}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                    // 当没有排序或按总包裹数排序时，保留前三名的特殊样式
                                    (!summarySortConfig.key || summarySortConfig.key === 'totalPackages') && 
                                      summarySortConfig.direction !== 'ascending' ? (
                                        index === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                                        index === 1 ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' : 
                                        index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                      ) : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  }`}>
                                    {index + 1}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-slate-800 dark:text-white">{worker.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-slate-800 dark:text-white font-medium">{worker.totalPackages}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-slate-600 dark:text-slate-300">{worker.totalItems}</div>
                              </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                 <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                   worker.avgPackagesPerHour > 15 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                   worker.avgPackagesPerHour > 10 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                   'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                                 }`}>
                                   {worker.avgPackagesPerHour}
                                 </div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                 <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                   worker.avgItemsPerHour > 40 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                   worker.avgItemsPerHour > 20 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                   'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                                 }`}>
                                   {worker.avgItemsPerHour}
                                 </div>
                               </td>
                            </tr>
                          ));
                        })()}
                     </tbody>
                   </table>
                 </div>
               </div>
             </section>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Empty />
            <p className="text-slate-500 dark:text-slate-400 mt-4">{t('empty.message')}</p>
          </div>
        )}
      </main>
      
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
           <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <p className="mt-1">{t('footer.description')}</p>
        </div>
      </footer>
    </div>
  );
}