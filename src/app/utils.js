export const trace = (x) => {
  console.log(x);
  return x;
}

export const traceTag = tag => x => {
  console.log(tag, x);
  return x;
}