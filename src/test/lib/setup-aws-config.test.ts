import { setupAwsConfig } from '../../lib/setup-aws-config';

describe('lib/setup-aws-config', () => {
  beforeEach(() => {
    expect.hasAssertions();
    global.console.log = jest.fn();
    global.console.error = jest.fn();
  });
  describe('setupAwsConfig', () => {
    test('when region specified; should create config', () => {
      const actual = setupAwsConfig({ region: 'someRegion' });
      expect(actual).toMatchObject({
        region: 'someRegion',
      });
    });
  });
});
