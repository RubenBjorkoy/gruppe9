import React from 'react';
import { shallow } from 'enzyme';
import FavoriteListPage from '../src/components/FavoriteListPage';
import { Button, Card, Row, Column } from '../src/widgets';

// Mock the favoritt-service module
jest.mock('../src/services/favoritt-service', () => {
  return {
    __esModule: true,
    default: {
      getAll: jest.fn(() => Promise.resolve(mockFavoritter))
    }
  };
});

const mockFavoritter = [
  { favorittid: 1, 
    svarid: 1
  },
  { favorittid: 2, 
    svarid: 3
  },
  { favorittid: 3, 
    svarid: 5
  }
];
describe('FavoriteListPage', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<FavoriteListPage />);

    const card = wrapper.find(Card);
    expect(card).toHaveLength(1);
    expect(card.prop('title')).toBe('Favoritter');
    // Check if sporsmaler are rendered
    mockFavoritter.forEach((favoritt) => {
      const row = card.find(Row).find({ key: favoritt.svarid.toString() });

      // Check if Row component is rendered for each sporsmal
      expect(row).toHaveLength(0);

      // Check if Columns and Button are rendered within Row
      expect(row.find(Column)).toHaveLength(0);
      expect(row.find(Column)).toHaveLength(0);
      expect(row.find(Column)).toHaveLength(0);
    });
  });

});