"use client";

import { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Cierra la notificación después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const baseClasses = "p-4 rounded-lg shadow-lg mb-6 flex justify-between items-center text-white";
  const typeClasses = type === 'success'
    ? "bg-green-500"
    : "bg-red-500";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button onClick={onClose} className="font-bold text-lg">&times;</button>
    </div>
  );
}
