// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import './angularjs-test';

declare const require: {
    context(
        path: string,
        deep?: boolean,
        filter?: RegExp,
    ): {
        <T>(id: string): T;
        keys(): string[];
    };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

type AsyncFailureKind = 'unhandledrejection' | 'error';

interface AsyncFailure {
    kind: AsyncFailureKind;
    reason: unknown;
    stack?: string;
    specName: string;
}

const asyncFailures: AsyncFailure[] = [];
let activeSpecName = 'unknown spec';
let lastFinishedSpecName = 'unknown spec';

jasmine.getEnv().addReporter({
    specStarted: (result) => {
        activeSpecName = result.fullName;
    },
    specDone: (result) => {
        lastFinishedSpecName = result.fullName;
        activeSpecName = 'unknown spec';
    }
});

const getSpecLabel = (): string => {
    return activeSpecName !== 'unknown spec' ? activeSpecName : lastFinishedSpecName;
};

const formatReason = (reason: unknown): string => {
    if (reason instanceof Error) {
        return reason.message || reason.toString();
    }

    if (typeof reason === 'string') {
        return reason;
    }

    try {
        return JSON.stringify(reason);
    } catch {
        return String(reason);
    }
};

const trackAsyncFailure = (kind: AsyncFailureKind, reason: unknown): void => {
    const stack = reason instanceof Error ? reason.stack : undefined;
    asyncFailures.push({
        kind,
        reason,
        stack,
        specName: getSpecLabel()
    });
};

window.addEventListener('unhandledrejection', (event) => {
    trackAsyncFailure('unhandledrejection', event.reason);
    event.preventDefault();
});

window.addEventListener('error', (event) => {
    trackAsyncFailure('error', event.error ?? event.message);
});

const consumeAsyncFailures = (): AsyncFailure[] => {
    return asyncFailures.splice(0, asyncFailures.length);
};

const buildFailureMessage = (failures: AsyncFailure[]): string => {
    return failures
        .map((failure, index) => {
            const header = `${index + 1}. [${failure.kind}] spec: ${failure.specName}`;
            const reason = `reason: ${formatReason(failure.reason)}`;
            const stack = failure.stack ? `stack: ${failure.stack}` : 'stack: n/a';

            return `${header}\n${reason}\n${stack}`;
        })
        .join('\n\n');
};

afterEach(() => {
    const failures = consumeAsyncFailures();
    if (!failures.length) {
        return;
    }

    fail(`Unhandled async error(s) detected:\n${buildFailureMessage(failures)}`);
});

afterAll(() => {
    const failures = consumeAsyncFailures();
    if (!failures.length) {
        return;
    }

    throw new Error(`Unhandled async error(s) detected in afterAll:\n${buildFailureMessage(failures)}`);
});

// Then we find all the tests.
const unitTestUnderTest = import.meta.webpackContext('./', { recursive: true, regExp: /\.spec\.ts$/ });

const unitTestUnderSrc = import.meta.webpackContext('../../src/', { recursive: true, regExp: /\.spec\.ts$/ });

// And load the modules.
unitTestUnderTest.keys().map(unitTestUnderTest);
unitTestUnderSrc.keys().map(unitTestUnderSrc);
