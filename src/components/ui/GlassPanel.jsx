import React from 'react';
import { motion } from 'framer-motion';

const GlassPanel = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`glass-panel ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
