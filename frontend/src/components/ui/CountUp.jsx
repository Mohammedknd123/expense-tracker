import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

const CountUp = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: duration,
      onUpdate: (value) => setDisplayValue(value),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value, duration]);

  return (
    <span>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
};

export default CountUp;
