/**
 * @method isLowerCase Checks if the whole string is lowercase.
 * @method normalise Will make first character of a string uppercase.
 */
export default function normaliseCasing(input: string): string {
  const isLowerCase = (string: string): boolean =>
    string.valueOf().toLowerCase() === string.valueOf();

  const normalise = (string: string): string => {
    return `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;
  };

  if (isLowerCase(input)) {
    return input.toUpperCase();
  }

  return normalise(input.replace(/([a-z])([A-Z])/g, "$1 $2"));
}
