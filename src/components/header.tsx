import { RotateCcw, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onReset: () => void;
  onSave: () => void;
}

export function Header({ onReset, onSave }: HeaderProps) {
  return (
    <div className="app-header">
      <div className="app-header-container">
        <div className="flex items-center gap-3">
          <img src="/icons/icon.png" alt="アイコン" className="w-12 h-12" />
          <div>
            <h1 className="app-title">
              mind dialy
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            className="btn-reset"
          >
            <Download className="icon-sm" />
            <span className="hidden md:inline">保存</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="btn-reset"
          >
            <RotateCcw className="icon-sm" />
            <span className="hidden md:inline">リセット</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
