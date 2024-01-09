export function removeUndefinedFields(data: any) {
  for (const key in data) {
    if (typeof data[key] === "object" && data[key] !== null) {
      removeUndefinedFields(data[key]);
      // If all child properties are undefined, remove the parent property
      if (Object.values(data[key]).every((val) => val === undefined)) {
        delete data[key];
      }
    } else if (data[key] === undefined) {
      delete data[key];
    }
  }
}
