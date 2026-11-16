export function requiredCypressEnv(name: string): string {
  const value: unknown = Cypress.env(name);
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing required Cypress environment variable: CYPRESS_${name}`);
  }
  return value;
}
