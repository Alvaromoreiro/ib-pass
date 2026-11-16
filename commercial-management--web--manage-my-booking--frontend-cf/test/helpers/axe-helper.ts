import * as axe from 'axe-core';

export async function checkA11y(
    element: HTMLElement,
    options?: axe.RunOptions
): Promise<axe.AxeResults> {
    return axe.run(element, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'best-practice'] },
        ...options
    });
}

export const axeMatchers: jasmine.CustomMatcherFactories = {
    toHaveNoA11yViolations(): jasmine.CustomMatcher {
        return {
            compare(actual: axe.AxeResults): jasmine.CustomMatcherResult {
                const violations = actual.violations;
                const pass = violations.length === 0;
                const message = pass
                    ? 'Expected accessibility violations but found none.'
                    : `Found ${violations.length} a11y violation(s):\n` +
                      violations.map(v =>
                          `  [${v.impact}] ${v.id}: ${v.description}\n` +
                          `    Help: ${v.helpUrl}\n` +
                          v.nodes.map(n => `    - ${n.html}`).join('\n')
                      ).join('\n');
                return { pass, message };
            }
        };
    }
};