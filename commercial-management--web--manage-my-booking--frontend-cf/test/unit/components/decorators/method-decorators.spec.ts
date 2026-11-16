import { PromiseTimeout } from '@src/components/decorators/method-decorators';

describe('PromiseTimeout Decorator', () => {
  class TestClass {
    @PromiseTimeout(100, 'TIMEOUT')
    async fastMethod() {
      return 'ok';
    }

    @PromiseTimeout(100, 'TIMEOUT')
    async slowMethod() {
      return new Promise((resolve) => setTimeout(() => resolve('late'), 200));
    }

    @PromiseTimeout(50, 'CUSTOM_ERROR')
    async customErrorMethod() {
      return new Promise((resolve) => setTimeout(() => resolve('late'), 100));
    }

    @PromiseTimeout(100, 'TIMEOUT')
    async rejectMethod() {
      return Promise.reject('REJECTED_ERROR');
    }
  }

  let instance: TestClass;

  beforeEach(() => {
    instance = new TestClass();
  });

  it('resolve promise before timeout', async () => {
    await expectAsync(instance.fastMethod()).toBeResolvedTo('ok');
  });

  it('Reject promise when is slow', async () => {
    await expectAsync(instance.slowMethod()).toBeRejectedWith('TIMEOUT');
  });

  it('Reject promise with customeErrorMethod when is slow', async () => {
    await expectAsync(instance.customErrorMethod()).toBeRejectedWith('CUSTOM_ERROR');
  });

  it('propage error when promise is rejected', async () => {
    await expectAsync(instance.rejectMethod()).toBeRejectedWith('REJECTED_ERROR');
  });
});
