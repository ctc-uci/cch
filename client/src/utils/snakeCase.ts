function toSnakeCase(obj: { [key: string]: any }): { [key: string]: any } {
    const snakeCased: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      snakeCased[snakeKey] = value;
    }
    return snakeCased;
}

export default toSnakeCase;
