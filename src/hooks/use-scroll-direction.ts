import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = 0;

    const updateScrollDirection = () => {
      // Find the scrollable container. In our layout, it's the right-side div.
      // Since it has overflow-y-auto, we can find it by class or just listen to the closest parent if we can.
      // But for simplicity, we'll listen to the window or find the specific container.
      const container = document.querySelector(".overflow-y-auto");
      if (!container) return;

      const scrollY = container.scrollTop;
      const direction = scrollY > lastScrollY ? "down" : "up";
      
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }
      
      setIsAtTop(scrollY < 10);
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    const container = document.querySelector(".overflow-y-auto");
    if (container) {
      container.addEventListener("scroll", updateScrollDirection);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollDirection);
      }
    };
  }, [scrollDirection]);

  return { scrollDirection, isAtTop };
}
