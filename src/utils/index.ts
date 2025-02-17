export const uuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
};

export const multiLine2array = (str: string): string[] => {
  return str?.split('\n') || [];
}

export const isValid = (data) => {
  return typeof data !== 'undefined' && data !== null && data !== ''
}

export const stringSplit = (str: string, split: string = ','): string[] => {
  if (!str) return [];
  return str?.split(split) || [];
}