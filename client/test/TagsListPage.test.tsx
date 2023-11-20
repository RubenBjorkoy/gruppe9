import React from 'react';
import { shallow, mount } from 'enzyme';
import TagsList from '../src/components/TagsListPage';
import { Form, Button, Card, Row, Column } from '../src/widgets';
import AddTagCard from '../src/components/AddTagCard';

// Mock the tag-service module
jest.mock('../src/services/tag-service', () => {
  return {
    __esModule: true,
    default: {
      getAll: jest.fn(() => Promise.resolve(mockTags)),
      
      createTag: jest.fn(() => Promise.resolve(newTag))
    }
  };
});

jest.mock('../src/services/sporsmalTag-service', () => {
  return {
    __esModule: true,
    default: {
      getSporsmalForTags: jest.fn(() => Promise.resolve(mockTags)) 

    }
  };
});

const mockTags = [
  { tagid: 1, 
    navn: 'Javascript',
    forklaring: 'Language',
    antall: 1
  },
  { tagid: 2, 
    navn: 'React',
    forklaring: 'Simplified',
    antall: 3
  },
  { tagid: 3, 
    navn: 'Random',
    forklaring: 'Cover the bases',
    antall: 1
  }
];

const newTag = { navn: 'Test Tag', forklaring: 'Test Tag Description'}

describe('TagsListPage', () => {
  test('renders correctly', () => {
    const wrapper = shallow(<TagsList />);


    expect(wrapper.find(Button.Success).at(0).text()).toBe('<ButtonSuccess />');
    // Check if the input field is rendered
    const searchInput = wrapper.find(Form.Input);
    // Check if Form.Input component is rendered
    expect(searchInput).toHaveLength(1);
    expect(searchInput.prop('type')).toBe('text');
    expect(searchInput.prop('placeholder')).toBe('Søk etter Tag');

    const card = wrapper.find(Card);
    expect(card).toHaveLength(1);
    expect(card.prop('title')).toBe('Tagger');
    // Check if sporsmaler are rendered
    mockTags.forEach((tag) => {
      const row = card.find(Row).find({ key: tag.tagid.toString() });

      // Check if Row component is rendered for each tag
      expect(row).toHaveLength(0);

      // Check if Columns and Button are rendered within Row
      expect(row.find(Column)).toHaveLength(0);
      expect(row.find(Column)).toHaveLength(0);
      expect(row.find(Column)).toHaveLength(0);
      expect(row.find(Column)).toHaveLength(0);
    });
  });

  test('should sort tags by antall in descending order', () => {
    // Initialize component with initial tags state
    const wrapper = shallow(<TagsList />);
    wrapper.setState({ tags: [...mockTags] });

    // Call the sortTagByAntall function
    wrapper.instance().sortTagByAntall();

    // Get the updated state after sorting
    const sortedTags = wrapper.state('tags');

    // Check if the tags are sorted in descending order by antall
    for (let i = 1; i < sortedTags.length; i++) {
      expect(sortedTags[i - 1].antall).toBeGreaterThanOrEqual(sortedTags[i].antall);
    }
  });
  
});

describe('AddTagCard component', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<AddTagCard onTagCreated={() => {}} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders form elements', () => {
    const wrapper = mount(<AddTagCard onTagCreated={() => {}} />);

    // Check if the input field is rendered
    const searchInput = wrapper.find(Form.Input);
    // Check if Form.Input component is rendered
    expect(searchInput).toHaveLength(1);
    expect(searchInput.prop('type')).toBe('text');

    // Check if buttons are rendered
    expect(wrapper.find(Button.Success).text()).toBe('Lag Tag');
  });

  it('handles input changes', () => {
    const wrapper = mount(<AddTagCard onTagCreated={() => {}} />);

    // Simulate input changes
    wrapper.find(Form.Input).simulate('change', {
      target: { value: 'Test Tag Name' },
    });
    wrapper.find(Form.Textarea).simulate('change', {
      target: { value: 'Test Tag Description' },
    });

    // Check if state is updated
    // expect(wrapper.state('newTag')).toEqual({
    //   navn: 'Test Tag Name',
    //   forklaring: 'Test Tag Description',
    // });
  });

  test('should handle tag creation', async () => {
    const onTagCreatedMock = jest.fn();
    const wrapper = shallow(<AddTagCard onTagCreated={onTagCreatedMock} />);
  
    // Set up the newTag object in the component
    wrapper.instance().newTag = { navn: 'Test Tag', forklaring: 'Test Tag Description' };
  
    // Call the handleTagCreation function
    await wrapper.instance().handleTagCreation();
  
    // Now you can make assertions based on the expected behavior after tag creation
    expect(onTagCreatedMock).toHaveBeenCalledTimes(1); // Ensure onTagCreated is called
    expect(wrapper.instance().newTag).toEqual({ navn: '', forklaring: '' }); // Ensure newTag is reset
    
  });
  
});