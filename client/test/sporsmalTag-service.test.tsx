import axios from 'axios';
import SporsmalTagService from '../src/services/sporsmalTag-service';

jest.mock('axios');

describe('SporsmalTagService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get tags for a sporsmal', async () => {
    const mockSporsmalId = 1;
    const mockTags = [{ tagid: 1, navn: 'Tag1', forklaring: 'Description1' }];

    (axios.get as jest.Mock).mockResolvedValue({ data: mockTags });

    const result = await SporsmalTagService.getTagForSporsmal(mockSporsmalId);

    expect(result).toEqual(mockTags);
    expect(axios.get).toHaveBeenCalledWith(`/sporsmal/${mockSporsmalId}/tags`);
  });

  it('should get sporsmal for a tag', async () => {
    const mockTagId = 1;
    const mockSporsmal = [{ sporsmalid: 1, tittel: 'Test Question', innhold: 'Question Contents' }];

    // Mocking the Axios get method
    (axios.get as jest.Mock).mockResolvedValue({ data: mockSporsmal });

    const result = await SporsmalTagService.getSporsmalForTags(mockTagId);

    expect(result).toEqual(mockSporsmal);
    expect(axios.get).toHaveBeenCalledWith(`/tag/${mockTagId}/sporsmal`);
  });

  it('should create a new sporsmalTag', async () => {
    const mockSporsmalId = 1;
    const mockTagId = 1;
    const mockCreatedSporsmalTag = { sporsmalid: mockSporsmalId, tagid: mockTagId };

    (axios.post as jest.Mock).mockResolvedValue({ data: mockCreatedSporsmalTag });

    const result = await SporsmalTagService.create(mockSporsmalId, mockTagId);

    expect(result).toEqual(mockCreatedSporsmalTag);
    expect(axios.post).toHaveBeenCalledWith('/sporsmalTag/', {
      sporsmalid: mockSporsmalId,
      tagid: mockTagId,
    });
  });

  it('should delete a sporsmalTag', async () => {
    const mockSporsmalId = 1;
    const mockTagId = 1;

    (axios.delete as jest.Mock).mockResolvedValue({ data: 1 });

    const result = await SporsmalTagService.delete(mockSporsmalId, mockTagId);

    expect(result).toEqual(1);
    expect(axios.delete).toHaveBeenCalledWith(`/sporsmalTag/${mockSporsmalId}/${mockTagId}`);
  });
});
