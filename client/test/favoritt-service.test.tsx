import FavorittService, { Favoritt } from '../src/services/favoritt-service';
import axios from 'axios';

jest.mock('axios');

describe('FavorittService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch favoritter', async () => {
    const mockFavoritter: Favoritt[] = [
      { favorittid: 1, svarid: 1 },
      { favorittid: 2, svarid: 2 },
    ];

    axios.get.mockResolvedValue({ data: mockFavoritter });

    const result = await FavorittService.getAll();

    expect(result).toEqual(mockFavoritter);
    expect(axios.get).toHaveBeenCalledWith('/favoritt');
  });

  it('should create a new favoritt', async () => {
    const mockSvarId = 1;
    const mockCreatedFavoritt: Favoritt = { favorittid: 3, svarid: 1 };

    axios.post.mockResolvedValue({ data: { favoritt: mockCreatedFavoritt } });

    const result = await FavorittService.create(mockSvarId);

    // Adjust the expectation based on your actual implementation
    expect(result.favoritt.favorittid).toEqual(mockCreatedFavoritt.favorittid);
    expect(result.favoritt.svarid).toEqual(mockCreatedFavoritt.svarid);
    expect(axios.post).toHaveBeenCalledWith('/favoritt/1');
  });

  it('should delete a favoritt', async () => {
    const mockSvarId = 1;
    const mockDeletedFavoritt: Favoritt = { favorittid: 1, svarid: mockSvarId };

    axios.delete.mockResolvedValue({ data: mockDeletedFavoritt });

    const result = await FavorittService.delete(mockSvarId);

    expect(result).toEqual(mockDeletedFavoritt);
    expect(axios.delete).toHaveBeenCalledWith('/favoritt/1');
  });
});
