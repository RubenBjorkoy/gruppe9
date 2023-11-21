import axios from 'axios';
import TagService from '../src/services/tag-service';

// Mock Axios
jest.mock('axios');

describe('TagService', () => {
  const mockTags = [
    { tagid: 1, navn: 'Tag1', forklaring: 'Description1' },
    { tagid: 2, navn: 'Tag2', forklaring: 'Description2' },
  ];

  jest.spyOn(axios, 'get');

  (axios.post as jest.Mock).mockImplementation(() =>
  Promise.resolve({ data: { tag: mockTags[0] } })
  );
  it('should get all tags', async () => {

    (axios.get as jest.Mock).mockImplementation(() =>
    Promise.resolve({ data: mockTags })
    );

    const tags = await TagService.getAll();


    expect(tags).toEqual(mockTags);
    expect(axios.get).toHaveBeenCalledWith('/tag');
  });

  it('should get a specific tag by id', async () => {

    const specificTag = mockTags[0];

    (axios.get as jest.Mock).mockImplementation(() =>
    Promise.resolve({ data: specificTag })
    );


    const tag = await TagService.getTag(1);


    expect(tag).toEqual(specificTag);
    expect(axios.get).toHaveBeenCalledWith('/tag/1');
  });

  it('should create a new tag', async () => {

    const newTag = { navn: 'NewTag', forklaring: 'NewDescription' };
    const createdTag = { tagid: 2, ...newTag }; // Assume a new tag with tagid: 2
  
    (axios.post as jest.Mock).mockImplementation(() =>
    Promise.resolve({ data: { tag: createdTag } })
    );
    
    const result = await TagService.createTag(newTag.navn, newTag.forklaring);
  
    expect(result).toEqual({ tag: createdTag });
    expect(axios.post).toHaveBeenCalledWith('/tag', newTag);
  });
  
});
