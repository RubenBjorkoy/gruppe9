import * as React from 'react';
import { Alert, Card, Row, Column, Button, NavBar, Form } from '../src/widgets';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';


describe('Form Components', () => {
  it('renders FormLabel correctly', () => {
    const wrapper = shallow(<Form.Label>Test Label</Form.Label>);
    expect(wrapper.find('label').text()).toBe('Test Label');
  });

  it('renders FormInput correctly', () => {
    const onChangeMock = jest.fn();
    const wrapper = shallow(
      <Form.Input type="text" value="Test Value" onChange={onChangeMock} />
    );
    expect(wrapper.find('input').prop('type')).toBe('text');
    expect(wrapper.find('input').prop('value')).toBe('Test Value');

    // Simulate a change event
    wrapper.find('input').simulate('change', { target: { value: 'New Value' } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  it('renders FormTextarea correctly', () => {
    const onChangeMock = jest.fn();
    const wrapper = shallow(
      <Form.Textarea value="Test Value" onChange={onChangeMock} />
    );
    expect(wrapper.find('textarea').prop('value')).toBe('Test Value');

    // Simulate a change event
    wrapper.find('textarea').simulate('change', { target: { value: 'New Value' } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  it('renders FormCheckbox correctly', () => {
    const onChangeMock = jest.fn();
    const wrapper = shallow(
      <Form.Checkbox checked={true} onChange={onChangeMock} />
    );
    expect(wrapper.find('input').prop('type')).toBe('checkbox');
    expect(wrapper.find('input').prop('checked')).toBe(true);

    // Simulate a change event
    wrapper.find('input').simulate('change', { target: { checked: false } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  it('renders FormSelect correctly', () => {
    const onChangeMock = jest.fn();
    const wrapper = shallow(
      <Form.Select value="Option1" onChange={onChangeMock}>
        <option value="Option1">Option 1</option>
        <option value="Option2">Option 2</option>
      </Form.Select>
    );
    expect(wrapper.find('select').prop('value')).toBe('Option1');

    // Simulate a change event
    wrapper.find('select').simulate('change', { target: { value: 'Option2' } });
    expect(onChangeMock).toHaveBeenCalled();
  });
});

describe('NavBar Component', () => {
  it('renders correctly with default props', () => {
    const wrapper = shallow(
      <MemoryRouter>
        <NavBar brand="Test Brand">
          <NavBar.Link to="/link1">Link 1</NavBar.Link>
          <NavBar.Link to="/link2">Link 2</NavBar.Link>
        </NavBar>
      </MemoryRouter>
    );

    // Check if the NavBar structure is rendered correctly
    expect(wrapper.find('NavBar')).toHaveLength(1);

    // Check if the brand is rendered correctly
    expect(wrapper.find('NavBar').prop('brand')).toEqual('Test Brand');

    // Check if NavBarLinks are rendered correctly
    const navBarLinks = wrapper.find('NavBarLink');
    expect(navBarLinks).toHaveLength(2);

    // Check if NavBarLinks have the correct "to" props and text content
    const expectedLinks = [
      { to: '/link1', text: 'Link 1' },
      { to: '/link2', text: 'Link 2' },
    ];

    expectedLinks.forEach((link, index) => {
      expect(navBarLinks.at(index).prop('to')).toEqual(link.to);
      expect(navBarLinks.at(index).children().text()).toEqual(link.text);
    });
  });
});

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(<Button.Success onClick={onClickMock}>Click me</Button.Success>);

    // Check if the button structure is rendered correctly
    expect(wrapper.find('button.btn.btn-success')).toHaveLength(1);

    // Check if onClick is triggered when the button is clicked
    wrapper.simulate('click');
    expect(onClickMock).toHaveBeenCalled();

    // Check if the child text is rendered correctly
    expect(wrapper.contains('Click me')).toBe(true);
  });

  it('renders correctly with small prop', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(
      <Button.Success small onClick={onClickMock}>
        Click me
      </Button.Success>
    );

    // Check if the button structure is rendered correctly with small styles
    expect(wrapper.find('button.btn.btn-success')).toHaveLength(1);
    expect(wrapper.prop('style')).toHaveProperty('padding', '5px 5px');
    expect(wrapper.prop('style')).toHaveProperty('fontSize', '16px');
    expect(wrapper.prop('style')).toHaveProperty('lineHeight', '0.7');

    // Check if onClick is triggered when the button is clicked
    wrapper.simulate('click');
    expect(onClickMock).toHaveBeenCalled();

    // Check if the child text is rendered correctly
    expect(wrapper.contains('Click me')).toBe(true);
  });

  it('renders correctly with default props', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(<Button.Danger onClick={onClickMock}>Click me</Button.Danger>);

    // Check if the button structure is rendered correctly
    expect(wrapper.find('button.btn.btn-danger')).toHaveLength(1);

    // Check if onClick is triggered when the button is clicked
    wrapper.simulate('click');
    expect(onClickMock).toHaveBeenCalled();

    // Check if the child text is rendered correctly
    expect(wrapper.contains('Click me')).toBe(true);
  });

  it('renders correctly with small prop', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(
      <Button.Danger small onClick={onClickMock}>
        Click me
      </Button.Danger>
    );

    // Check if the button structure is rendered correctly with small styles
    expect(wrapper.find('button.btn.btn-danger')).toHaveLength(1);
    expect(wrapper.prop('style')).toHaveProperty('padding', '5px 5px');
    expect(wrapper.prop('style')).toHaveProperty('fontSize', '16px');
    expect(wrapper.prop('style')).toHaveProperty('lineHeight', '0.7');

    // Check if onClick is triggered when the button is clicked
    wrapper.simulate('click');
    expect(onClickMock).toHaveBeenCalled();

    // Check if the child text is rendered correctly
    expect(wrapper.contains('Click me')).toBe(true);
  });

  it('renders correctly with default props', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(<Button.Light onClick={onClickMock}>Click me</Button.Light>);

    // Check if the button structure is rendered correctly
    expect(wrapper.find('button.btn.btn-light')).toHaveLength(1);

    // Check if onClick is triggered when the button is clicked
    wrapper.simulate('click');
    expect(onClickMock).toHaveBeenCalled();

    // Check if the child text is rendered correctly
    expect(wrapper.contains('Click me')).toBe(true);
  });

  it('renders correctly with small prop', () => {
    const onClickMock = jest.fn();
    const wrapper = shallow(
      <Button.Light small onClick={onClickMock}>
        Click me
      </Button.Light>
    );

    // Check if the button structure is rendered correctly with small styles
    expect(wrapper.find('button.btn.btn-light')).toHaveLength(1);
    expect(wrapper.prop('style')).toHaveProperty('padding', '5px 5px');
    expect(wrapper.prop('style')).toHaveProperty('fontSize', '16px');
    expect(wrapper.prop('style')).toHaveProperty('lineHeight', '0.7');

    // Check if onClick is triggered when the button is clicked
    wrapper.simulate('click');
    expect(onClickMock).toHaveBeenCalled();

    // Check if the child text is rendered correctly
    expect(wrapper.contains('Click me')).toBe(true);
  });

});

describe('Column Component', () => {
  it('renders correctly with width and children', () => {
    const wrapper = shallow(
      <Column width={3}>
        <div>Child 1</div>
      </Column>
    );

    // Check if the column structure is rendered correctly
    expect(wrapper.find('.col-3')).toHaveLength(1);

    // Check if children are rendered correctly
    expect(wrapper.find('div')).toHaveLength(3); // One for col, one for float-start
    expect(wrapper.contains('Child 1')).toBe(true);
  });

  it('renders correctly without width and with children', () => {
    const wrapper = shallow(
      <Column>
        <div>Child 1</div>
      </Column>
    );

    // Check if the column structure is rendered correctly
    expect(wrapper.find('.col')).toHaveLength(1);

    // Check if children are rendered correctly
    expect(wrapper.find('div')).toHaveLength(3); // One for col, one for float-start
    expect(wrapper.contains('Child 1')).toBe(true);
  });

  it('renders correctly with right alignment', () => {
    const wrapper = shallow(
      <Column width={2} right>
        <div>Child 1</div>
      </Column>
    );

    // Check if the column structure is rendered correctly
    expect(wrapper.find('.col-2')).toHaveLength(1);
    expect(wrapper.find('.float-end')).toHaveLength(1);

    // Check if children are rendered correctly
    expect(wrapper.find('div')).toHaveLength(3); // One for col, one for float-end
    expect(wrapper.contains('Child 1')).toBe(true);
  });
});

describe('Row Component', () => {
  it('renders correctly with children', () => {
    const wrapper = shallow(
      <Row>
        <div>Child 1</div>
        <div>Child 2</div>
      </Row>
    );

    // Check if the row structure is rendered correctly
    expect(wrapper.find('.row')).toHaveLength(1);
    expect(wrapper.find('.row').prop('style')).toEqual({ marginBottom: '10px' });

    // Check if children are rendered correctly
    expect(wrapper.find('div')).toHaveLength(3);
    expect(wrapper.contains('Child 1')).toBe(true);
    expect(wrapper.contains('Child 2')).toBe(true);
  });

  it('renders correctly without children', () => {
    const wrapper = shallow(<Row />);

    // Check if the row structure is rendered correctly
    expect(wrapper.find('.row')).toHaveLength(1);
    expect(wrapper.find('.row').prop('style')).toEqual({ marginBottom: '10px' });

    // Check if there are no children
    expect(wrapper.find('div')).toHaveLength(1);
  });
});

describe('Card Component', () => {
  it('renders correctly with title', () => {
    const title = 'Test Card Title';
    const wrapper = shallow(<Card title={title}>Test Card Content</Card>);

    // Check if the card structure is rendered correctly
    expect(wrapper.find('.card')).toHaveLength(1);
    expect(wrapper.find('.card-body')).toHaveLength(1);
    expect(wrapper.find('.card-title').text()).toBe(title);
    expect(wrapper.find('.card-text').text()).toBe('Test Card Content');
  });

  it('renders correctly without title', () => {
    const wrapper = shallow(<Card>Test Card Content</Card>);

    // Check if the card structure is rendered correctly
    expect(wrapper.find('.card')).toHaveLength(1);
    expect(wrapper.find('.card-body')).toHaveLength(1);
    expect(wrapper.find('.card-title')).toHaveLength(1); // Title should not be present
    expect(wrapper.find('.card-text').text()).toBe('Test Card Content');
  });
});

describe('Alert tests', () => {
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    
    Alert.success('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });
  
  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    
    Alert.info('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });

  test('Close alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.warning('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').simulate('click');

      expect(wrapper.matchesElement(<div></div>)).toEqual(true);

      done();
    });
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    
    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });

  test('Open 3 alert messages, and close the second alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test1');
    Alert.danger('test2');
    Alert.danger('test3');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test1
              <button />
            </div>
            <div>
              test2
              <button />
            </div>
            <div>
              test3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').at(1).simulate('click');

      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test1
              <button />
            </div>
            <div>
              test3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });
});
