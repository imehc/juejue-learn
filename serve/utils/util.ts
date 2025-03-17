/**
 * 从对象中排除指定的属性，返回一个新对象
 * @param obj 源对象
 * @param keys 要排除的属性数组
 * @returns 不包含指定属性的新对象
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * omit(obj, ['a', 'b']); // { c: 3 }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}
