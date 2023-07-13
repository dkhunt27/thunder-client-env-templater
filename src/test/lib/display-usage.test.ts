import { displayUsage } from '../../lib/display-usage';

describe('lib/display-usage', () => {
  beforeEach(() => {
    expect.hasAssertions();
    global.console.log = jest.fn();
    global.console.error = jest.fn();
  });
  describe('displayUsage', () => {
    test('when called; should display usage', () => {
      displayUsage();
      expect(global.console.log).toHaveBeenCalledTimes(15);
    });
  });
});
