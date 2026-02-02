import { useEffect } from "react";

/**
 * A custom hook that detects clicks outside a referenced element.
 * Useful for closing dropdowns, modals, or popups when clicking outside.
 *
 * @param ref - React ref object pointing to the element to monitor
 * @param callback - Function to execute when a click outside the element is detected
 *
 * @example
 * ```tsx
 * const MyDropdown = () => {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const dropdownRef = useRef<HTMLDivElement>(null);
 *
 *   useOutsideClick(dropdownRef, () => setIsOpen(false));
 *
 *   return (
 *     <div ref={dropdownRef}>
 *       <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && <ul>...</ul>}
 *     </div>
 *   );
 * };
 * ```
 */
export const useOutsideClick = (ref: React.RefObject<HTMLDivElement | null>, callback: () => void)  => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};