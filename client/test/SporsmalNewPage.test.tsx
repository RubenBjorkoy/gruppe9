import * as React from 'react';
import SporsmalNew from '../src/components/SporsmalNewPage';
import sporsmalService from '../src/services/sporsmal-service';
import TagsList from '../src/components/TagsListPage';
import tagService from '../src/services/tag-service';
import { shallow } from 'enzyme';
import { Form, Button, Card, Row, Column, Alert } from '../src/widgets';

// Mock the SporsmalService module
jest.mock('../src/services/sporsmal-service', () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn(() => Promise.resolve(mockSporsmal)),
      create: jest.fn(() => Promise.resolve())
    }
  };
});

// Mock the danger function of the Alert component
jest.mock('../src/widgets', () => {
  const originalModule = jest.requireActual('../src/widgets');

  return {
    ...originalModule,
    Alert: {
      ...originalModule.Alert,
      danger: jest.fn((text) => {
        // Implement your mock behavior here if needed
        console.log(`Mocked danger function called with text: ${text}`);
      }),
    },
  };
});

// Mock the tagService
// jest.mock('../src/services/tag-service', () => ({
//   getAll: jest.fn(() => Promise.resolve(mockTag)), // Mock the getAll function to resolve with an empty array
// }));

const mockSporsmal = 
  { sporsmalid: 1, 
    tittel: 'First Question', 
    innhold: 'What is the question?',
    poeng: 3,
    dato: '2023-01-01T12:00:00',
    sistendret: '2023-01-01T12:00:00'
  }

const mockTag = 
{
  tagid: 1,
	navn: 'Simulated',
	forklaring: 'Simulated Tag',
	antall: 1
}
describe('Sporsmal New tests', () => {
  test('SporsmalNew draws correctly', async () => {
    const wrapper = shallow(<SporsmalNew />);
    await Promise.resolve(); // Wait for the component to update

    // Check if Card component is rendered
    const card = wrapper.find(Card);
    expect(card).toHaveLength(1);
    expect(card.prop('title')).toBe('Nytt Spørsmål');
    // Check if sporsmal are rendered

      const row = card.find(Row).find({ key: 1 });
      // Check if Row component is rendered
      expect(row).toHaveLength(0);

      // Check if Columns  rendered within Row
      expect(row.find(Column)).toHaveLength(0);
      wrapper.find(Form.Label);
      expect(row.find(Column)).toHaveLength(0);
      // Check if the input field is rendered
      const sporsmalTittel = wrapper.find(Form.Input);
      // Check if Form.Input component is rendered
      expect(sporsmalTittel).toHaveLength(1);
      expect(sporsmalTittel.prop('type')).toBe('text');

      // Check if Row component is rendered for each sporsmal
      expect(row).toHaveLength(0);

      // Check if Columns  rendered within Row
      expect(row.find(Column)).toHaveLength(0);
      expect(row.find(Column)).toHaveLength(0);
      // Check if the input field is rendered
      const sporsmalTekst = wrapper.find(Form.Textarea);
      // Check if Form.Input component is rendered
      expect(sporsmalTekst).toHaveLength(1);
      expect(sporsmalTekst.prop('type')).toBe('text');
    //   expect(row.find(Button.Success)).toHaveLength(0);

      expect(row).toHaveLength(0);
      expect(row.find(Column)).toHaveLength(0);
      expect(row.find(Column)).toHaveLength(0);

      expect(row).toHaveLength(0);

      // Check if Columns  rendered within Row
      expect(row.find(Column)).toHaveLength(0);
      expect(wrapper.find(Button.Success).text()).toBe('<ButtonSuccess />');


    });
  });

  // describe('TagList component', () => {
  //   it('should load tags', async () => {
  //     // Arrange
  //     const wrapper = shallow(<TagsList />); 
  
  //     // Act: Trigger the handleTagCreated function
  //     await wrapper.instance().handleTagCreated();
  
  //     expect(tagService.getAll).toHaveBeenCalled();
  //     expect(tagService.getAll).toHaveBeenCalledWith(mockTag);
  //   });
  // });
// describe('New sporsmal creation', () => {
//   beforeEach(() => {
//     jest.clearAllMocks(); // Clear mock calls before each test
//   });

//   it('creates a question successfully', async () => {
//     const wrapper = shallow(<SporsmalNew />);
//     wrapper.instance().tittel = 'Test Question';
//     wrapper.instance().innhold = 'Question Contents';
//     wrapper.instance().chosenTags = [mockTag.tagid];
//     wrapper.find(Button.Success).simulate('click');

//     // Assert that sporsmalService.create is called with the correct parameters
//     expect(sporsmalService.create).toHaveBeenCalledWith(
//       'Test Question',
//       'Question Contents',
//       [1],
//       0
//     );

//     // Assert that the component state is reset as expected
//     // expect(wrapper.state('tittel')).toBe('');
//     // expect(wrapper.state('innhold')).toBe('');

//     // Assert that the Alert.danger function is not called (since there are chosen tags)
//     expect(Alert.danger).not.toHaveBeenCalled();
//   });

// //   it('shows an alert if no tags are chosen', async () => {
// //     const wrapper = shallow(<SporsmalNew />);
// //     // Assuming createQuestion is called without setting up chosenTags

// //     wrapper.find(Button.Success).simulate('click');

// //     // Assert that sporsmalService.create is not called
// //     expect(sporsmalService.create).not.toHaveBeenCalled();

// //     // Assert that Alert.danger is called with the correct message
// //     expect(Alert.danger).toHaveBeenCalledWith('Du må velge minst en tag');
// //     wrapper.find('button.btn-close').at(1).simulate('click');
// //   });
//  });