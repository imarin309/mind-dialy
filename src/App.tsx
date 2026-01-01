import { useState } from 'react';
import { MindMapNode} from './components/MindMapNode';
import { Header } from './components/header';
import {type MindMapNodeData} from './domain/mindmap';

export default function App() {
  const [rootNode, setRootNode] = useState<MindMapNodeData>({
    id: 'root',
    text: '',
    children: [],
  });

  
  const addChild = (nodeId: string) => {
    const newNode: MindMapNodeData = {
      id: `node-${Date.now()}-${Math.random()}`,
      text: '',
      children: [],
    };

    const updateNode = (node: MindMapNodeData): MindMapNodeData => {
      if (node.id === nodeId) {
        return {
          ...node,
          children: [...node.children, newNode],
        };
      }
      return {
        ...node,
        children: node.children.map(updateNode),
      };
    };

    setRootNode(updateNode(rootNode));
  };

  const deleteNode = (nodeId: string) => {
    const removeNode = (node: MindMapNodeData): MindMapNodeData => {
      return {
        ...node,
        children: node.children
          .filter((child) => child.id !== nodeId)
          .map(removeNode),
      };
    };

    setRootNode(removeNode(rootNode));
  };

  const updateNodeText = (nodeId: string, text: string) => {
    const updateNode = (node: MindMapNodeData): MindMapNodeData => {
      if (node.id === nodeId) {
        return { ...node, text };
      }
      return {
        ...node,
        children: node.children.map(updateNode),
      };
    };

    setRootNode(updateNode(rootNode));
  };

  const resetMindMap = () => {
    setRootNode({
      id: 'root',
      text: '',
      children: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onReset={resetMindMap} />

      <div className="main-content">
        <div className="main-content-container">
          <div className="mindmap-wrapper">
            <div className="inline-block">
              <MindMapNode
                node={rootNode}
                onAddChild={addChild}
                onDelete={deleteNode}
                onUpdateText={updateNodeText}
                isRoot
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}