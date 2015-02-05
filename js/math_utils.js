function clamp ( min, max, c) {
  min = min === null ? -Infinity : min;
  max = max === null ? Infinity : max;
  return Math.max( min, Math.min(max,c) );
}

