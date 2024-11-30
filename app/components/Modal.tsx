import { useFetcher } from "@remix-run/react";
import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const fetcher = useFetcher();

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={(e) => {
          if(e.target === e.currentTarget) onClose();
        }}>
          <div className="bg-dark p-6 rounded shadow-lg w-1/3">
            {children}
          </div>
        </div>
    );
}