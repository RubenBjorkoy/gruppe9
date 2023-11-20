import axios from 'axios';
import TagService from '../src/services/tag-service';

// Mock Axios
jest.mock('axios');

describe('TagService', () => {
  // Mock data
  const mockTags = [
    { tagid: 1, navn: 'Tag1', forklaring: 'Description1' },
    { tagid: 2, navn: 'Tag2', forklaring: 'Description2' },
  ];

  // Mock Axios get method
  jest.spyOn(axios, 'get');

  // Mock Axios post method
  axios.post.mockResolvedValue({ data: { tag: mockTags[0] } });

  it('should get all tags', async () => {
    // Arrange
    axios.get.mockResolvedValue({ data: mockTags });

    // Act
    const tags = await TagService.getAll();

    // Assert
    expect(tags).toEqual(mockTags);
    expect(axios.get).toHaveBeenCalledWith('/tag');
  });

  it('should get a specific tag by id', async () => {
    // Arrange
    const specificTag = mockTags[0];
    axios.get.mockResolvedValue({ data: specificTag });

    // Act
    const tag = await TagService.getTag(1);

    // Assert
    expect(tag).toEqual(specificTag);
    expect(axios.get).toHaveBeenCalledWith('/tag/1');
  });

  it('should create a new tag', async () => {
    // Arrange
    const newTag = { navn: 'NewTag', forklaring: 'NewDescription' };
    const createdTag = { tagid: 2, ...newTag }; // Assume a new tag with tagid: 2
  
    axios.post.mockResolvedValue({ data: { tag: createdTag } });
  
    // Act
    const result = await TagService.createTag(newTag.navn, newTag.forklaring);
  
    // Assert
    expect(result).toEqual({ tag: createdTag });
    expect(axios.post).toHaveBeenCalledWith('/tag', newTag);
  });
  
});
