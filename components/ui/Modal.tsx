import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Use createPortal to render the modal outside the DOM hierarchy of the parent component
  // This prevents parent transforms/filters from breaking the 'fixed' positioning
  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[4px] transition-all duration-300 animate-in fade-in"
      onClick={onClose} // Close when clicking the overlay
    >
      {/* 
        Modal Content 
        e.stopPropagation() prevents clicks inside the modal from triggering the overlay's onClose 
      */}
      <div 
        className="relative bg-white/85 backdrop-blur-2xl border border-white/60 rounded-[2rem] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 bg-gray-100/50 hover:bg-gray-200/80 rounded-full text-gray-500 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};