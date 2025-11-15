import {
  validateRequired,
  validateEmail,
  validateURL,
  sanitizeInput,
  validateLength,
  validatePostContent,
  validatePlatforms,
} from '@/app/lib/validation';
import { ValidationError } from '@/app/lib/errors';

describe('Validation Utilities', () => {
  describe('validateRequired', () => {
    it('should pass when all required fields are present', () => {
      const data = { email: 'test@example.com', password: 'password123' };
      expect(() => validateRequired(data, ['email', 'password'])).not.toThrow();
    });

    it('should throw ValidationError when required field is missing', () => {
      const data = { email: 'test@example.com' };
      expect(() => validateRequired(data, ['email', 'password'])).toThrow(ValidationError);
    });

    it('should throw ValidationError when required field is empty string', () => {
      const data = { email: '', password: 'password123' };
      expect(() => validateRequired(data, ['email', 'password'])).toThrow(ValidationError);
    });

    it('should throw ValidationError when required field is null', () => {
      const data = { email: null, password: 'password123' };
      expect(() => validateRequired(data, ['email', 'password'])).toThrow(ValidationError);
    });

    it('should include field names in error', () => {
      const data = { email: '' };
      try {
        validateRequired(data, ['email', 'password']);
      } catch (error) {
        if (error instanceof ValidationError) {
          expect(error.fields).toBeDefined();
          expect(error.fields?.email).toContain('required');
          expect(error.fields?.password).toContain('required');
        }
      }
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validateURL', () => {
    it('should return true for valid URL', () => {
      expect(validateURL('https://example.com')).toBe(true);
      expect(validateURL('http://example.com/path')).toBe(true);
      expect(validateURL('https://sub.example.com/path?query=1')).toBe(true);
    });

    it('should return false for invalid URL', () => {
      expect(validateURL('invalid')).toBe(false);
      expect(validateURL('not a url')).toBe(false);
      expect(validateURL('example.com')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should escape quotes and apostrophes', () => {
      expect(sanitizeInput('Hello "World" & \'Friends\'')).toBe(
        'Hello &quot;World&quot; &amp; &#x27;Friends&#x27;'
      );
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('validateLength', () => {
    it('should return true when length is within range', () => {
      expect(validateLength('hello', 1, 10)).toBe(true);
      expect(validateLength('test', 4, 4)).toBe(true);
    });

    it('should return false when length is too short', () => {
      expect(validateLength('hi', 3, 10)).toBe(false);
    });

    it('should return false when length is too long', () => {
      expect(validateLength('hello world', 1, 5)).toBe(false);
    });
  });

  describe('validatePostContent', () => {
    it('should pass for valid post content', () => {
      expect(() => validatePostContent('Title', 'Content goes here')).not.toThrow();
    });

    it('should pass when title is undefined', () => {
      expect(() => validatePostContent(undefined, 'Content goes here')).not.toThrow();
    });

    it('should throw when content is empty', () => {
      expect(() => validatePostContent('Title', '')).toThrow(ValidationError);
    });

    it('should throw when title is too long', () => {
      const longTitle = 'a'.repeat(300);
      expect(() => validatePostContent(longTitle, 'Content')).toThrow(ValidationError);
    });

    it('should throw when content is too long', () => {
      const longContent = 'a'.repeat(10001);
      expect(() => validatePostContent('Title', longContent)).toThrow(ValidationError);
    });

    it('should use custom validation rules', () => {
      const customRules = {
        title: { min: 5, max: 50 },
        content: { min: 10, max: 100 },
      };

      expect(() =>
        validatePostContent('Hi', 'Short', customRules)
      ).toThrow(ValidationError);
    });
  });

  describe('validatePlatforms', () => {
    it('should return true for valid platforms array', () => {
      expect(validatePlatforms(['instagram', 'twitter'])).toBe(true);
      expect(validatePlatforms(['facebook', 'linkedin', 'youtube'])).toBe(true);
    });

    it('should return false for invalid platform name', () => {
      expect(validatePlatforms(['instagram', 'invalid'])).toBe(false);
    });

    it('should return false for non-array input', () => {
      expect(validatePlatforms('instagram')).toBe(false);
      expect(validatePlatforms({ platform: 'instagram' })).toBe(false);
    });

    it('should return false for array with non-string values', () => {
      expect(validatePlatforms(['instagram', 123])).toBe(false);
    });

    it('should return true for all valid platforms', () => {
      const allPlatforms = [
        'instagram',
        'tiktok',
        'youtube',
        'twitter',
        'linkedin',
        'facebook',
        'pinterest',
      ];
      expect(validatePlatforms(allPlatforms)).toBe(true);
    });
  });
});
