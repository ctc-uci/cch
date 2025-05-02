function camelToSnakeCase(obj: Record<string, any>): Record<string, any> {
  const toSnakeCase = (str: string) =>
    str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  const convert = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map((item) => convert(item));
    } else if (data !== null && typeof data === "object") {
      return Object.keys(data).reduce((acc, key) => {
        const snakeKey = toSnakeCase(key);
        acc[snakeKey] = convert(data[key]);
        return acc;
      }, {} as Record<string, any>);
    }
    return data;
  };

  return convert(obj);
}

export { camelToSnakeCase };
