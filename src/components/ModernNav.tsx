import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Upload, Map, LineChart, FileText, Mail, Home, Database, Dna, Moon, Sun } from 'lucide-react';
import FlowingMenu from './FlowingMenu';

interface NavItem {
  label: string;
  items?: { label: string; href?: string; onClick?: () => void; description?: string; icon?: React.ReactNode }[];
  href?: string;
  onClick?: () => void;
}

interface ModernNavProps {
  items: NavItem[];
  isDarkMode: boolean;
  onLogoClick?: () => void;
  currentPage?: string;
  toggleDarkMode: () => void;
}

export default function ModernNav({ items, isDarkMode, onLogoClick, currentPage, toggleDarkMode }: ModernNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Images for FlowingMenu
  const oceanImages = [
    'https://images.unsplash.com/photo-1631001310285-64f0d5f06a21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc2VhJTIwb2NlYW58ZW58MXx8fHwxNzY1MDIyNTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1552923529-07d0889344be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcndhdGVyJTIwbWFyaW5lfGVufDF8fHx8MTc2NTAzODk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1761590699995-fd5f16ff6147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMGJpb2RpdmVyc2l0eXxlbnwxfHx8fDE3NjUwMzg5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1719042575585-e9d866f43210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JhbCUyMHJlZWYlMjB1bmRlcndhdGVyfGVufDF8fHx8MTc2NTAzODk4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ];

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-4xl transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-700' 
        : 'bg-white/90 border-blue-200'
    } backdrop-blur-xl border rounded-2xl shadow-2xl`}>
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            type="button"
            className="flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
          >
            <Dna className={`w-7 h-7 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <span 
              className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Taxaformer
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {items.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.items && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.items ? (
                  <>
                    <button
                      type="button"
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200 hover:text-white'
                          : 'hover:bg-blue-50 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* Dropdown */}
                    {openDropdown === item.label && (
                      <div
                        className={`absolute top-full left-0 mt-2 min-w-[280px] rounded-xl shadow-2xl border transition-all ${
                          isDarkMode
                            ? 'bg-slate-900/95 border-slate-700'
                            : 'bg-white/95 border-blue-200'
                        } backdrop-blur-xl overflow-hidden`}
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="p-3">
                          {item.items.map((subItem, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => {
                                subItem.onClick?.();
                                setOpenDropdown(null);
                              }}
                              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-start gap-3 ${
                                isDarkMode
                                  ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                                  : 'hover:bg-blue-50 text-slate-700 hover:text-slate-900'
                              }`}
                            >
                              {subItem.icon && (
                                <div className={`mt-0.5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                  {subItem.icon}
                                </div>
                              )}
                              <div>
                                <div className="font-medium mb-0.5">{subItem.label}</div>
                                {subItem.description && (
                                  <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                    {subItem.description}
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      isDarkMode
                        ? 'hover:bg-slate-800 text-slate-200 hover:text-white'
                        : 'hover:bg-blue-50 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'hover:bg-slate-800 text-slate-200 hover:text-white'
                  : 'hover:bg-blue-50 text-slate-700 hover:text-slate-900'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-blue-50'
            }`}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full transition-all ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              } ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}></span>
              <span className={`h-0.5 w-full transition-all ${
                isMobileMenuOpen ? 'opacity-0' : ''
              } ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}></span>
              <span className={`h-0.5 w-full transition-all ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              } ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-opacity-20">
            {items.map((item) => (
              <div key={item.label} className="mb-2">
                {item.items ? (
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-blue-50 text-slate-700'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.items.map((subItem, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              subItem.onClick?.();
                              setIsMobileMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                              isDarkMode
                                ? 'hover:bg-slate-800 text-slate-300'
                                : 'hover:bg-blue-50 text-slate-600'
                            }`}
                          >
                            {subItem.icon}
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-blue-50 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'hover:bg-slate-800 text-slate-200'
                  : 'hover:bg-blue-50 text-slate-700'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}