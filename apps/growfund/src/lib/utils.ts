import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  const map = new Map<string, string>();
  const normalize = (cls: string) => {
    return cls
      .replace(/\s+/, ' ')
      .split(/\s+/)
      .map((className) => {
        if (className.includes(':gf-')) {
          map.set(className.replace(':gf-', ':'), className);
          return className.replace(':gf-', ':');
        }
        if (className.startsWith('gf-')) {
          map.set(className.replace('gf-', ''), className);
          return className.replace('gf-', '');
        }

        map.set(className, className);

        return className;
      })
      .join(' ');
  };
  const mergedClasses = twMerge(
    clsx(inputs.map((cls) => (typeof cls === 'string' ? normalize(cls) : cls))),
  );

  return mergedClasses
    .replace(/\s+/, ' ')
    .split(/\s+/)
    .map((className) => (map.has(className) ? map.get(className) : className))
    .join(' ');
}

export const shortcodeReplacement = (
  shortcodes: { label: string; value: string }[],
  content: string | null | undefined,
  replacements: Record<string, string | number>,
) => {
  let finalContent = content;

  shortcodes.forEach((shortcode) => {
    const key = shortcode.value.replace(/[{}]/g, '');
    if (replacements[key]) {
      const regex = new RegExp(shortcode.value, 'g');
      finalContent = finalContent?.replace(regex, String(replacements[key]));
    }
  });

  return finalContent ?? '';
};
