export function createFilterPredicate<T>(keys: (keyof T)[]): (data: T, filter: string) => boolean {
  return (data: T, filter: string): boolean => {
    return keys.some(key => {
      const value = data[key];
      if (Array.isArray(value)) {
        return value.join(', ').toLowerCase().includes(filter);
      } else if (value != null) {
        return value.toString().toLowerCase().includes(filter);
      }
      return false;
    });
  };
}
