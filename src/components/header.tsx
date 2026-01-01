import { RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <div className="app-header">
      <div className="app-header-container">
        <div className="flex items-center gap-3">
          {/* TODO: アイコンを設定 */}
          <div>
            <h1 className="app-title">
              マインドマップ
            </h1>
          </div>
        </div>

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
  );
}
