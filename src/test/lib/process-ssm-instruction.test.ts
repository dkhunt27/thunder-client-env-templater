import { SSMClient } from '@aws-sdk/client-ssm';
import { processSsmInstruction } from '../../lib/process-ssm-instruction';

jest.mock('@aws-sdk/client-ssm');

describe('lib/process-ssm-instruction', () => {
  let mockSend: jest.Mock;
  beforeEach(() => {
    expect.hasAssertions();
    global.console.log = jest.fn();
    global.console.error = jest.fn();

    mockSend = jest.fn();
    (SSMClient as jest.Mock).mockImplementation(() => {
      return {
        send: mockSend,
      };
    });
  });
  describe('processSsmInstruction', () => {
    test('when has ssm instruction, should return ssm param value', async () => {
      mockSend.mockResolvedValue({
        Parameter: { Value: 'someSsmValue' },
      });
      await expect(
        processSsmInstruction({
          envVarValue: 'ssm:someSsmKey:true',
          ssmConfig: {},
        }),
      ).resolves.toEqual('someSsmValue');
    });
    test('when does not have ssm instruction, should return error', async () => {
      await expect(
        processSsmInstruction({
          envVarValue: 'someSsmKey',
          ssmConfig: {},
        }),
      ).rejects.toThrow(
        'processSsmInstruction envVarValue not in expected format',
      );
    });
  });
});
