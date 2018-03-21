export default (size: number): string => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const sizeNumber: string = (size / Math.pow(1024, i)).toFixed(2);
  const sizes: string[] = ["B", "kB", "MB", "GB", "TB"];

  return `${sizeNumber} ${sizes[i]}`;
};
