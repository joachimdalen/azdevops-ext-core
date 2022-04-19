import { mockGetResourceAreaLocation } from '../../__mocks__/azure-devops-extension-sdk';
import { getHostUrl } from '../../core/HostUtils';

describe('HostUtils', () => {
  describe('getHostUrl', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return origin', async () => {
      mockGetResourceAreaLocation.mockResolvedValue('https://dev.azure.com/demoOrg');
      const result = await getHostUrl();

      expect(result).toEqual('https://dev.azure.com');
    });
    it('should return origin with org when given', async () => {
      mockGetResourceAreaLocation.mockResolvedValue('https://dev.azure.com/demoOrg');
      const result = await getHostUrl(undefined, true);

      expect(result).toEqual('https://dev.azure.com/demoOrg');
    });
  });
});
