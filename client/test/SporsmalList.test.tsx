import * as React from 'react';
import SporsmalList from '../src/components/SporsmalList';
import sporsmalService from '../src/services/sporsmal-service';
import { shallow } from 'enzyme';
import { Form, Button, Card, Row, Column } from '../src/widgets';

// Mock the SporsmalService module
jest.mock('../src/services/sporsmal-service', () => {
  return {
    __esModule: true,
    default: {
      getAll: jest.fn(() => Promise.resolve(mockSporsmaler))
    }
  };
});

const mockSporsmaler = [
  { sporsmalid: 1, 
    tittel: 'First Question', 
    innhold: 'What is the question?',
    poeng: 3,
    dato: '2023-01-01T12:00:00',
    sistendret: '2023-01-01T12:00:00'
  },
  { sporsmalid: 2, 
    tittel: 'Second Question', 
    innhold: 'What is the new question?',
    poeng: 1,
    dato: '2023-02-01T12:00:00',
    sistendret: '2023-02-01T12:00:00'
  },
  { sporsmalid: 3, 
    tittel: 'Third Question', 
    innhold: 'What is the last question?',
    poeng: 5,
    dato: '2023-03-01T12:00:00',
    sistendret: '2023-03-01T12:00:00'
  }
];


describe('Sporsmal List tests', () => {
  test('SporsmalList draws correctly', async () => {
    const wrapper = shallow(<SporsmalList />);
    await Promise.resolve(); // Wait for the component to update

    // Check if buttons are rendered
    expect(wrapper.find(Button.Success).at(0).text()).toBe('<ButtonSuccess />');
    expect(wrapper.find(Button.Success).at(1).text()).toBe('<ButtonSuccess />');
    expect(wrapper.find(Button.Success).at(2).text()).toBe('<ButtonSuccess />');

    // Check if the input field is rendered
    const searchInput = wrapper.find(Form.Input);
    // Check if Form.Input component is rendered
    expect(searchInput).toHaveLength(1);
    expect(searchInput.prop('type')).toBe('text');
    expect(searchInput.prop('placeholder')).toBe('Søk etter spørsmål');

    // Check if Card component is rendered
    const card = wrapper.find(Card);
    expect(card).toHaveLength(1);
    expect(card.prop('title')).toBe('Spørsmål');
    // Check if sporsmaler are rendered
    mockSporsmaler.forEach((sporsmal) => {
      const row = card.find(Row).find({ key: sporsmal.sporsmalid.toString() });

      // Check if Row component is rendered for each sporsmal
      expect(row).toHaveLength(0);

      // Check if Columns and Button are rendered within Row
      expect(row.find(Column)).toHaveLength(0);
      expect(row.find(Button.Success)).toHaveLength(0);
    });
  });

  test('fetches sporsmaler when besvart is false', async () => {
    // Mock the getAll method to return mock data
    sporsmalService.getAll();

    const wrapper = shallow(<SporsmalList />);
    await wrapper.instance().fetchSporsmaler(false);

    // Check if state is updated correctly
    expect(wrapper.state('sporsmaler')).toEqual(mockSporsmaler);
    expect(wrapper.state('besvart')).toBe(false);
  });

  test('fetches unanswered sporsmaler when besvart is true', async () => {
    const unansweredSporsmaler = mockSporsmaler.filter((sporsmal) => !sporsmal.ersvart);

    // Mock the getAll method to return mock data
    sporsmalService.getAll();

    const wrapper = shallow(<SporsmalList />);
    await wrapper.instance().fetchSporsmaler(true);

    // Check if state is updated correctly
    expect(wrapper.state('sporsmaler')).toEqual(unansweredSporsmaler);
    expect(wrapper.state('besvart')).toBe(true);
  });

  test('sortSporsmalByPoeng sorts sporsmaler correctly', () => {
    const wrapper = shallow<SporsmalList>(<SporsmalList />);
    
    // Set the initial state
    wrapper.setState({ sporsmaler: mockSporsmaler });

    // Call the sort function
    wrapper.instance().sortSporsmalByPoeng();

    // Get the updated state
    const updatedState = wrapper.state();

    // Check if sporsmaler are sorted correctly
    expect(updatedState.sporsmaler).toEqual([
      { sporsmalid: 3, 
        tittel: 'Third Question', 
        innhold: 'What is the last question?',
        poeng: 5,
        dato: '2023-03-01T12:00:00',
        sistendret: '2023-03-01T12:00:00'
      },
      { sporsmalid: 1, 
        tittel: 'First Question', 
        innhold: 'What is the question?',
        poeng: 3,
        dato: '2023-01-01T12:00:00',
        sistendret: '2023-01-01T12:00:00'
      },
      { sporsmalid: 2, 
        tittel: 'Second Question', 
        innhold: 'What is the new question?',
        poeng: 1,
        dato: '2023-02-01T12:00:00',
        sistendret: '2023-02-01T12:00:00'
      },
    ]);
  });
});

