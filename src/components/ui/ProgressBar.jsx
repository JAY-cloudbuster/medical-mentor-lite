import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, color = 'primary' }) => {
  return (
    <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`bg-${color} h-2.5 rounded-full`}
        style={{ boxShadow: `0 0 10px var(--color-${color})` }}
      />
    </div>
  );
};

export default ProgressBar;
