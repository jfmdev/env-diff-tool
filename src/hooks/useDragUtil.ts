import { useState, useRef, useEffect, type DragEventHandler } from 'react';

type UseDragUtilProps = (file: File) => void;

export function useDragUtil(dropCallback: UseDragUtilProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  // Define listeners and base handlers.
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        dragCounter.current++;
        setIsDragging(true);
      }
    };
    const handleDragLeave = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        dragCounter.current--;
        if (dragCounter.current <= 0) {
          setIsDragging(false);
        }
      }
    };

    const resetDrag = () => {
      dragCounter.current = 0;
      setIsDragging(false);
      setDraggingOver(false);
    };

    // CAVEAT: Need to check the "blur" event in case the file is dropped outside the textareas
    // and the browser opens the file in a new tab.
    window.addEventListener('blur', resetDrag);
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', resetDrag);

    return () => {
      window.removeEventListener('blur', resetDrag);
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', resetDrag);
    };
  }, []);

  const onDragOver: DragEventHandler = (evt) => {
    evt.preventDefault();
    setDraggingOver(true);
  };

  const onDragLeave = () => setDraggingOver(false);

  const onDrop: DragEventHandler = (evt) => {
    evt.preventDefault();
    setDraggingOver(false);

    const file = evt.dataTransfer?.files?.[0];
    if (file) dropCallback(file);
  };

  return {
    isDragging,
    draggingOver,
    onDragOver,
    onDragLeave,
    onDrop,
  };
}
