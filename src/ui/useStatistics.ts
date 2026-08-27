import { useEffect, useState } from "react";

export function useStatistics(dataPointCount: number): Statistics[] {
  const [value, setValue] = useState<Statistics[]>([]);
  useEffect(() => {
    const unsubscribe = window.electron.subscribeStatistics((stats) => {
      setValue((prev) => {
        const newValue = [...prev, stats];
        if (newValue.length > dataPointCount) {
          newValue.shift();
        }
        return newValue;
      });
    });
    return unsubscribe;
  }, [dataPointCount]);
  return value;
}
