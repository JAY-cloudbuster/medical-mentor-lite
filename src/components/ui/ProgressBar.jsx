import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, color = 'indigo' }) => {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-indigo-500 h-2.5 rounded-full"
      />
    </div>
  );
};

export default ProgressBar;
