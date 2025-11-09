import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 计算数值的梯度背景色 - 用于单元格背景渐变
export const getGradientColor = (value: number, min: number, max: number, isDark: boolean = false) => {
  if (value === 0 || min === max) return '';
  
  const ratio = (value - min) / (max - min);
  
  if (isDark) {
    // 深色模式: 使用蓝色调渐变
    // 从浅蓝色到深蓝色的渐变，确保在深色背景下有足够的对比度
    const colorIntensity = Math.floor(50 + ratio * 100); // 从蓝色50到150
    const opacity = Math.floor(20 + ratio * 40); // 从透明度20%到60%
    
    return `bg-blue-${colorIntensity.toString(10)}/${opacity < 10 ? '0.0' + opacity : '0.' + opacity}`;
  } else {
    // 浅色模式: 使用蓝色调渐变
    // 从非常浅的蓝色到深蓝色的渐变
    const colorIntensity = Math.floor(100 + ratio * 100); // 从蓝色100到200
    const opacity = Math.floor(30 + ratio * 60); // 从透明度30%到90%
    
    return `bg-blue-${colorIntensity.toString(10)}/${opacity < 10 ? '0.0' + opacity : '0.' + opacity}`;
  }
};

// 检查是否为深色模式
export const isDarkMode = () => {
  return document.documentElement.classList.contains('dark');
};