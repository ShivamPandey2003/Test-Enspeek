import React, { useState, useEffect } from 'react';

interface TypewriterDescriptionProps {
  descriptions: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export const TypewriterDescription: React.FC<TypewriterDescriptionProps> = ({
  descriptions,
  typingSpeed = 50,
  pauseDuration = 2000,
  className = '',
}) => {
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!descriptions.length) return;

    const currentDescription = descriptions[currentDescriptionIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentDescription.length) {
          setCurrentText(currentDescription.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentDescriptionIndex((prev) => (prev + 1) % descriptions.length);
        }
      }
    }, isDeleting ? typingSpeed / 2 : typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentDescriptionIndex, descriptions, typingSpeed, pauseDuration]);

  return (
    <div className={`${className}`}>
      <span className="">Ask Enspeek to </span>
      <span>{currentText}</span>
    </div>
  );
};