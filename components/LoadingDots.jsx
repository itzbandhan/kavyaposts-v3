import { useState, useEffect } from "react";

const LoadingDots = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Update the dots every second
    const interval = setInterval(() => {
      setDots((prev) => {
        // Cycle between 1, 2, or 3 dots
        if (prev === "...") {
          return ".";
        }
        return prev + ".";
      });
    }, 1000); // 1 second interval

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <div className="text-xl font-semibold">
      Loading{dots}
      <span className="italic"> Posts📄 </span>
    </div>
  );
};

export default LoadingDots;
