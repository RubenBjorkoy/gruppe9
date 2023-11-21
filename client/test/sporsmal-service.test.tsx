import axios from 'axios';
import SporsmalService, { Sporsmal } from '../src/services/sporsmal-service';
import sporsmalTagService from '../src/services/sporsmalTag-service';

jest.mock('axios');
jest.mock('../src/services/sporsmalTag-service');

describe('SporsmalService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new sporsmal', async () => {
    const mockSporsmal = {
      tittel: 'Test Question',
      innhold: 'Question Contents',
      chosenTags: [1],
      poeng: 0,
    };

    const mockCreatedSporsmal = { sporsmalid: 1, ...mockSporsmal };

    (axios.post as jest.Mock).mockImplementation(() =>
      Promise.resolve({ data: { id: mockCreatedSporsmal.sporsmalid } })
    );

    (sporsmalTagService.create as jest.Mock).mockImplementation(() =>
    Promise.resolve({})
  );

    const result = await SporsmalService.create(
      mockSporsmal.tittel,
      mockSporsmal.innhold,
      mockSporsmal.chosenTags,
      mockSporsmal.poeng
    );

    expect(result).toEqual(mockCreatedSporsmal);
    expect(axios.post).toHaveBeenCalledWith('/sporsmal', {
      tittel: mockSporsmal.tittel,
      innhold: mockSporsmal.innhold,
      poeng: mockSporsmal.poeng,
    });

    expect(sporsmalTagService.create).toHaveBeenCalledWith(
      mockCreatedSporsmal.sporsmalid,
      mockSporsmal.chosenTags[0]
    );
  });

  it('should delete a sporsmal', async () => {
    const mockSporsmalId = 1;


    (axios.delete as jest.Mock).mockResolvedValue({ data: {} });

    const result = await SporsmalService.delete(mockSporsmalId);

    expect(result).toEqual({});
    expect(axios.delete).toHaveBeenCalledWith(`/sporsmal/${mockSporsmalId}`);
  });

  it('should update a sporsmal', async () => {
    const mockSporsmal = {
      sporsmalid: 1,
      tittel: 'Test Question',
      innhold: 'Updated Question Contents',
      chosenTags: [2, 3],
      poeng: 0,
    };

    (axios.put as jest.Mock).mockResolvedValue({ data: mockSporsmal });

    (sporsmalTagService.getTagForSporsmal as jest.Mock).mockResolvedValue([]);

    (sporsmalTagService.delete as jest.Mock).mockResolvedValue({});
    (sporsmalTagService.create as jest.Mock).mockResolvedValue({});

    const result = await SporsmalService.update(mockSporsmal);

    expect(result).toEqual(mockSporsmal);
    expect(axios.put).toHaveBeenCalledWith('/sporsmal', [mockSporsmal, true]);
  });
});
