/**
 * Input validation utilities for forms and API requests
 */

import { ValidationError } from './errors';

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[]
): void {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      errors[field] = `${field} is required`;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number
): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * Validate post content
 */
export interface PostValidationRules {
  title?: { min: number; max: number };
  content: { min: number; max: number };
}

export function validatePostContent(
  title: string | undefined,
  content: string,
  rules: PostValidationRules = {
    title: { min: 1, max: 280 },
    content: { min: 1, max: 10000 },
  }
): void {
  const errors: Record<string, string> = {};

  if (title !== undefined && rules.title) {
    if (!validateLength(title, rules.title.min, rules.title.max)) {
      errors.title = `Title must be between ${rules.title.min} and ${rules.title.max} characters`;
    }
  }

  if (!validateLength(content, rules.content.min, rules.content.max)) {
    errors.content = `Content must be between ${rules.content.min} and ${rules.content.max} characters`;
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Post validation failed', errors);
  }
}

/**
 * Validate array of platforms
 */
export function validatePlatforms(
  platforms: unknown
): platforms is string[] {
  if (!Array.isArray(platforms)) {
    return false;
  }

  const validPlatforms = [
    'instagram',
    'tiktok',
    'youtube',
    'twitter',
    'linkedin',
    'facebook',
    'pinterest',
  ];

  return platforms.every(
    (p) => typeof p === 'string' && validPlatforms.includes(p)
  );
}
