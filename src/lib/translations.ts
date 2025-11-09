import { Translation } from '../contexts/languageContext';

// 翻译文件
export const translations: Translation = {
  // 页面标题
  'app.title': {
    en: 'Packaging Worker Efficiency Monitoring System',
    zh: '打包员工效率监控系统'
  },
  
  // 导航
  'nav.lastUpdated': {
    en: 'Last updated: ',
    zh: '最后更新: '
  },
  
  // 数据导入
  'data.import': {
    en: 'Data Import',
    zh: '数据导入'
  },
  'data.uploadCsv': {
    en: 'Click to upload CSV or XLSX format order data file',
    zh: '点击上传CSV或XLSX格式的订单数据文件'
  },
  'data.fileInfo': {
    en: 'Contains order number, package number, packer, completion time, item count, etc.',
    zh: '包含订单号、包裹号、打包操作人、打包完成时间、商品数量等信息'
  },
  'data.loading': {
    en: 'Processing data...',
    zh: '正在处理数据...'
  },
  'data.loaded': {
    en: 'Loaded {count} records',
    zh: '已加载 {count} 条数据'
  },
  
  // 数据筛选
  'filter.title': {
    en: 'Data Filter',
    zh: '数据筛选'
  },
  'filter.selectWorkers': {
    en: 'Select Workers',
    zh: '选择员工'
  },
  'filter.selectTime': {
    en: 'Select Time Period',
    zh: '选择时间段'
  },
  'filter.workersSelected': {
    en: '{count} workers selected',
    zh: '{count} 位员工已选择'
  },
  'filter.selectWorkersPlaceholder': {
    en: 'Select workers...',
    zh: '选择员工...'
  },
  'filter.searchWorkers': {
    en: 'Search workers...',
    zh: '搜索员工...'
  },
  'filter.selectAll': {
    en: 'Select All',
    zh: '全选'
  },
  'filter.clear': {
    en: 'Clear',
    zh: '清除'
  },
  
  // 总览数据卡片
  'overview.totalOrders': {
    en: 'Total Orders',
    zh: '总订单数'
  },
  'overview.totalItems': {
    en: 'Total Items',
    zh: '总件数'
  },
  'overview.avgItemsPerOrder': {
    en: 'Avg. Items Per Order',
    zh: '单均件数'
  },
  'overview.avgPackagesPerHour': {
    en: 'Avg. Packages Per Hour',
    zh: '每小时平均包裹数'
  },
  'overview.avgItemsPerHour': {
    en: 'Avg. Items Per Hour',
    zh: '每小时平均商品数'
  },
  
  // 员工效率单小时表
  'hourlyTable.title': {
    en: 'Worker Efficiency Hourly Table',
    zh: '员工效率单小时表'
  },
  'hourlyTable.exportImage': {
    en: 'Export Image (with key metrics)',
    zh: '导出图片(含关键指标)'
  },
  'hourlyTable.showPackages': {
    en: 'Show Package Count',
    zh: '显示包裹数量'
  },
  'hourlyTable.showItems': {
    en: 'Show Item Count',
    zh: '显示商品数量'
  },
  'hourlyTable.serialNumber': {
    en: 'Serial',
    zh: '序号'
  },
  'hourlyTable.workerName': {
    en: 'Worker Name',
    zh: '员工姓名'
  },
  'hourlyTable.total': {
    en: 'Total',
    zh: '总计'
  },
  
  // 员工效率汇总表
  'summaryTable.title': {
    en: 'Worker Efficiency Summary Table',
    zh: '员工效率汇总表'
  },
  'summaryTable.exportImage': {
    en: 'Export Image',
    zh: '导出图片'
  },
  'summaryTable.rank': {
    en: 'Rank',
    zh: '排名'
  },
  'summaryTable.totalPackages': {
    en: 'Total Packages',
    zh: '总包裹数'
  },
  'summaryTable.totalItems': {
    en: 'Total Items',
    zh: '总商品数'
  },
  'summaryTable.avgPackagesPerHour': {
    en: 'Avg. Packages Per Hour',
    zh: '每小时平均包裹数'
  },
  'summaryTable.avgItemsPerHour': {
    en: 'Avg. Items Per Hour',
    zh: '每小时平均商品数'
  },
  
  // 空状态
  'empty.title': {
    en: 'Empty',
    zh: 'Empty'
  },
  'empty.message': {
    en: 'Please upload order data file to start monitoring worker efficiency',
    zh: '请上传订单数据文件开始监控员工效率'
  },
  
  // 页脚
  'footer.copyright': {
    en: 'Packaging Worker Efficiency Monitoring System &copy; {year}',
    zh: '打包员工效率监控系统 &copy; {year}'
  },
  'footer.description': {
    en: 'Helping you efficiently manage and monitor worker productivity',
    zh: '帮助您高效管理和监控员工工作效率'
  },
  
  // 按钮和操作
  'button.export': {
    en: 'Export Image',
    zh: '导出图片'
  },
  'button.download': {
    en: 'Download',
    zh: '导出'
  },
  
  // 通知消息
  'notification.exportSuccess': {
    en: 'Successfully exported {fileName} image',
    zh: '成功导出{fileName}图片'
  },
  'notification.exportError': {
    en: 'Failed to export image, please try again',
    zh: '导出图片失败，请重试'
  },
  'notification.containerNotFound': {
    en: 'Cannot find table container',
    zh: '无法找到表格容器'
  },
  'notification.importSuccess': {
    en: 'Successfully imported {count} order records',
    zh: '成功导入 {count} 条订单数据'
  },
  'notification.importError': {
    en: 'Failed to parse {type} file, please check file format',
    zh: '{type}文件解析失败，请检查文件格式'
  },
  'notification.readError': {
    en: 'Failed to read file',
    zh: '文件读取失败'
  },
  'notification.comingSoon': {
    en: 'Coming soon',
    zh: 'Coming soon'
  },
  
  // 语言切换
  'language.en': {
    en: 'English',
    zh: '英文'
  },
  'language.zh': {
    en: 'Chinese',
    zh: '中文'
  }
};