import { createContext, useState, ReactNode } from 'react';

// 定义语言类型
export type Language = 'en' | 'zh';

// 定义翻译类型
export interface Translation {
  [key: string]: {
    en: string;
    zh: string;
  };
}

// 定义语言上下文类型
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// 创建语言上下文
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key
});

// 语言提供器组件的属性类型
interface LanguageProviderProps {
  children: ReactNode;
  translations: Translation;
}

// 语言提供器组件
export const LanguageProvider = ({ children, translations }: LanguageProviderProps) => {
  // 默认语言为英文
  const [language, setLanguage] = useState<Language>('en');

  // 翻译函数，支持参数替换
  const t = (key: string, params: Record<string, string | number> = {}): string => {
    // 查找翻译
    const translation = translations[key];
    
    // 如果找不到翻译，返回键名
    if (!translation) return key;
    
    // 获取当前语言的翻译文本
    let text = translation[language];
    
    // 替换参数
    Object.keys(params).forEach(paramKey => {
      const placeholder = `{${paramKey}}`;
      text = text.replace(placeholder, String(params[paramKey]));
    });
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};