import { useState, memo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { type MindMapNodeData } from '../domain/mindmap';


interface MindMapNodeProps {
  node: MindMapNodeData;
  onAddChild: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onUpdateText: (nodeId: string, text: string) => void;
  isRoot?: boolean;
  level?: number;
}

export const MindMapNode = memo(({
  node,
  onAddChild,
  onDelete,
  onUpdateText,
  isRoot = false,
  level = 0,
}: MindMapNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdateText(node.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(node.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="node-container">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="node-wrapper group"
      >
        <div
          className={`node-base ${isRoot ? 'node-root' : 'node-child'}`}
          onClick={() => !isEditing && setIsEditing(true)}
        >
          <div className="node-glow" />

          <div className="node-content">
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="node-input"
                placeholder="テキストを入力"
                autoFocus
              />
            ) : (
              <p className="node-text">
                {node.text}
              </p>
            )}
          </div>

          {/* add button */}
          <div className="node-actions">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node.id);
              }}
              className="btn-action-add"
              title="子ノードを追加"
            >
              <Plus className="icon-md icon-text" />
            </motion.button>

            {/* delete button */}
            {!isRoot && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
                className="btn-action-delete"
                title="削除"
              >
                <Trash2 className="icon-md icon-delete" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Children */}
      {node.children.length > 0 && (
        <div className="children-container">
          {/* Connecting line - vertical */}
          <div className="connection-line-vertical" />

          {/* Children in horizontal row */}
          <div className="children-row">
            {node.children.map((child) => (
              <div key={child.id} className="child-wrapper">
                {/* Vertical connecting line to parent */}
                <div className="connection-line-to-parent" />

                <MindMapNode
                  node={child}
                  onAddChild={onAddChild}
                  onDelete={onDelete}
                  onUpdateText={onUpdateText}
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});