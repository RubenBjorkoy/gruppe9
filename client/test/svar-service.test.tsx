import SvarService, { Svar } from '../src/services/svar-service';
import axios, { AxiosRequestConfig } from 'axios';

jest.mock('axios');

describe('SvarService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get a specific answer', async () => {
    const mockSporsmalId = 1;
    const mockSvarId = 2;
    const mockSvar: Svar = {
      svarid: mockSvarId,
      svartekst: 'Test Answer',
      poeng: 5,
      sporsmalid: mockSporsmalId,
      erbest: true,
      dato: new Date(),
      sistendret: new Date(),
      ersvar: false,
      svarsvarid: null,
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: mockSvar });

    const result = await SvarService.get(mockSporsmalId, mockSvarId);

    expect(result).toEqual(mockSvar);
    expect(axios.get).toHaveBeenCalledWith(`/sporsmal/${mockSporsmalId}/svar/${mockSvarId}`);
  });

  it('should get all answers for a question', async () => {
    const mockSporsmalId = 1;
    const mockSvarList: Svar[] = [
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: mockSvarList });

    const result = await SvarService.getAll(mockSporsmalId);

    expect(result).toEqual(mockSvarList);
    expect(axios.get).toHaveBeenCalledWith(`/sporsmal/${mockSporsmalId}/svar`);
  });

  it('should create a new answer', async () => {
    const mockSporsmalId = 1;
    const newAnswer: Partial<Svar> = {
      svartekst: 'New Answer',
      poeng: 3,
      sporsmalid: mockSporsmalId,
      ersvar: false,
      svarsvarid: null,
    };
    const mockCreatedAnswer: Partial<Svar> = {
      svarid: 2,
      ...newAnswer,
      dato: new Date(),
      sistendret: new Date(),
    };

    // Mocking the Axios post method
    (axios.post as jest.Mock).mockResolvedValue({ data: { svar: mockCreatedAnswer } });

    const result = await SvarService.create(
      newAnswer.svartekst!,
      newAnswer.sporsmalid!,
      newAnswer.poeng!,
      newAnswer.ersvar!,
      newAnswer.svarsvarid!
    );

    // Adjust the expectation based on your actual implementation
    expect(result).toEqual({ svar: mockCreatedAnswer });
    expect(axios.post).toHaveBeenCalledWith(`/sporsmal/${mockSporsmalId}/svar`, {
      svartekst: newAnswer.svartekst!,
      poeng: newAnswer.poeng!,
      sporsmalid: newAnswer.sporsmalid!,
      ersvar: newAnswer.ersvar!,
      svarsvarid: newAnswer.svarsvarid || null,
    });
  });

  it('should delete an answer', async () => {
    const mockSporsmalId = 1;
    const mockSvar: Svar = {
      svarid: 2,
      svartekst: 'Test Answer',
      poeng: 5,
      sporsmalid: mockSporsmalId,
      erbest: true,
      dato: new Date(),
      sistendret: new Date(),
      ersvar: false,
      svarsvarid: null,
    };

    (axios.delete as jest.Mock).mockResolvedValue({ data: mockSvar });

    const result = await SvarService.delete(mockSvar);

    expect(result).toEqual(mockSvar);
    expect(axios.delete).toHaveBeenCalledWith(`/sporsmal/${mockSporsmalId}/svar/${mockSvar.svarid}`);
  });

  it('should update an answer', async () => {
    const mockSporsmalId = 1;
    const mockSvar: Svar = {
      svarid: 2,
      svartekst: 'Test Answer',
      poeng: 5,
      sporsmalid: mockSporsmalId,
      erbest: true,
      dato: new Date(),
      sistendret: new Date(),
      ersvar: false,
      svarsvarid: null,
    };

    (axios.put as jest.Mock).mockResolvedValue({ data: mockSvar });

    const result = await SvarService.update(mockSvar, mockSporsmalId);


    expect(result).toEqual(mockSvar);
    expect(axios.put).toHaveBeenCalledWith(`/sporsmal/${mockSporsmalId}/svar`, [mockSvar, true]);
  
  });

});
