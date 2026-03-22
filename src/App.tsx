/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Divide, Equal, Minus, Plus, X } from 'lucide-react';

type Operator = '+' | '-' | '*' | '/' | null;

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: Operator) => {
    const current = parseFloat(display);
    
    if (prevValue === null) {
      setPrevValue(current);
    } else if (operator) {
      const result = calculate(prevValue, current, operator);
      setPrevValue(result);
      setDisplay(String(result));
    }
    
    setOperator(op);
    setIsNewNumber(true);
    setEquation(`${current} ${op === '*' ? '×' : op === '/' ? '÷' : op}`);
  };

  const calculate = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevValue === null || !operator) return;
    
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operator);
    
    setDisplay(String(result));
    setEquation('');
    setPrevValue(null);
    setOperator(null);
    setIsNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperator(null);
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setIsNewNumber(false);
    }
  };

  const Button = ({ 
    children, 
    onClick, 
    className = '', 
    variant = 'number' 
  }: { 
    children: React.ReactNode, 
    onClick: () => void, 
    className?: string,
    variant?: 'number' | 'operator' | 'utility' | 'equals'
  }) => {
    const variants = {
      number: 'bg-zinc-800 text-white hover:bg-zinc-700',
      operator: 'bg-zinc-700 text-orange-400 hover:bg-zinc-600',
      utility: 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600',
      equals: 'bg-orange-500 text-white hover:bg-orange-400'
    };

    return (
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onClick}
        className={`h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-medium transition-colors shadow-lg ${variants[variant]} ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black w-full max-w-[320px] rounded-[40px] overflow-hidden border border-zinc-800 shadow-2xl"
      >
        {/* Display Area */}
        <div className="p-8 pt-12 flex flex-col items-end justify-end min-h-[200px]">
          <div className="text-zinc-500 text-sm h-6 mb-1 font-mono tracking-wider">
            {equation}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={display}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-white text-5xl font-light tracking-tighter truncate w-full text-right"
            >
              {display}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Keypad */}
        <div className="p-6 grid grid-cols-4 gap-3 bg-zinc-900/50 rounded-t-[32px]">
          <Button onClick={handleClear} variant="utility">AC</Button>
          <Button onClick={handleBackspace} variant="utility">
            <Delete size={20} />
          </Button>
          <Button onClick={() => handleOperator('/')} variant="operator">
            <Divide size={20} />
          </Button>
          <Button onClick={() => handleOperator('*')} variant="operator">
            <X size={20} />
          </Button>

          <Button onClick={() => handleNumber('7')}>7</Button>
          <Button onClick={() => handleNumber('8')}>8</Button>
          <Button onClick={() => handleNumber('9')}>9</Button>
          <Button onClick={() => handleOperator('-')} variant="operator">
            <Minus size={20} />
          </Button>

          <Button onClick={() => handleNumber('4')}>4</Button>
          <Button onClick={() => handleNumber('5')}>5</Button>
          <Button onClick={() => handleNumber('6')}>6</Button>
          <Button onClick={() => handleOperator('+')} variant="operator">
            <Plus size={20} />
          </Button>

          <Button onClick={() => handleNumber('1')}>1</Button>
          <Button onClick={() => handleNumber('2')}>2</Button>
          <Button onClick={() => handleNumber('3')}>3</Button>
          <Button onClick={handleEquals} variant="equals" className="row-span-2 h-[140px]">
            <Equal size={24} />
          </Button>

          <Button onClick={() => handleNumber('0')} className="col-span-2 w-full">0</Button>
          <Button onClick={handleDecimal}>.</Button>
        </div>
        
        {/* Android Navigation Bar Indicator */}
        <div className="flex justify-center pb-2 pt-1">
          <div className="w-24 h-1 bg-zinc-800 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
