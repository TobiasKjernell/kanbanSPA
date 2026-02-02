import { useEffect } from "react";

export const useOutsideClick = (ref:React.RefObject<HTMLDivElement | null>, callback: () => void) => {
  useEffect(() => {
  
    const handleClickOutside = (event:MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(); 
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}