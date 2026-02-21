"use client";

import { motion } from "framer-motion";

export function PixelClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="cloud cloud-1"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="cloud cloud-2"
        animate={{ x: [0, -25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="cloud cloud-3"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="cloud cloud-4"
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
