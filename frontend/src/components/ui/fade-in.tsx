'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export function FadeIn({ children, delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
