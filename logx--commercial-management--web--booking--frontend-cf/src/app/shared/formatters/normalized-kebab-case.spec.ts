// normalized-kebab-case.spec.ts

import { normalizedKebabCase } from '@src/app/shared/formatters/normalized-kebab-case';

describe('normalizedKebabCase', () => {

  it('should return empty string for empty or falsy values', () => {
    expect(normalizedKebabCase('')).toBe('');
    expect(normalizedKebabCase(null as unknown as string)).toBe('');
    expect(normalizedKebabCase(undefined as unknown as string)).toBe('');
  });

  it('should trim spaces', () => {
    expect(normalizedKebabCase('  hello world  ')).toBe('hello-world');
  });

  it('should convert spaces and separators into kebab-case', () => {
    expect(normalizedKebabCase('hello world test')).toBe('hello-world-test');
    expect(normalizedKebabCase('hello_world_test')).toBe('hello-world-test');
    expect(normalizedKebabCase('hello--world')).toBe('hello-world');
  });

  it('should handle camelCase correctly', () => {
    expect(normalizedKebabCase('myValueTest')).toBe('my-value-test');
  });

  it('should handle PascalCase correctly', () => {
    expect(normalizedKebabCase('MyValueTest')).toBe('my-value-test');
  });

  it('should split acronyms correctly', () => {
    expect(normalizedKebabCase('XMLParser')).toBe('xml-parser');
    expect(normalizedKebabCase('parseHTTPResponse')).toBe('parse-http-response');
  });

  it('should normalize diacritics', () => {
    expect(normalizedKebabCase('áéíóú ñ')).toBe('aeiou-n');
    expect(normalizedKebabCase('Crème Brûlée')).toBe('creme-brulee');
  });


  it('should remove non-alphanumeric characters', () => {
    expect(normalizedKebabCase('hello@world!test')).toBe('hello-world-test');
  });

  it('should remove leading and trailing dashes', () => {
    expect(normalizedKebabCase('---hello world---')).toBe('hello-world');
  });

  it('should collapse multiple separators into a single dash', () => {
    expect(normalizedKebabCase('hello   world')).toBe('hello-world');
    expect(normalizedKebabCase('hello---world')).toBe('hello-world');
  });

  it('should support numbers', () => {
    expect(normalizedKebabCase('version 2 update')).toBe('version-2-update');
    expect(normalizedKebabCase('test123Value')).toBe('test123-value');
  });

  it('should handle complex mixed input', () => {
    expect(normalizedKebabCase('  MyXMLParser_v2.0-Test  '))
      .toBe('my-xml-parser-v2-0-test');
  });

});
