import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button } from './widgets';
import taskService, { Task } from './task-service';

class TaskList extends Component {
  tasks: Task[] = [];

  render() {
    return (
      <Card title="Tasks">
        {this.tasks.map((task) => (
          <Row key={task.id}>
            <Column width={1}>{task.id}</Column> 
            <Column width={1}>{task.title}</Column>
            <Column width={1}>
              <Form.Checkbox
                checked={task.done}
                onChange={(event) => {
                  task.done = event.currentTarget.checked;
                  taskService.put(task.id).then(() => {
                    TaskList.instance()?.mounted();
                  });
                }}>
              </Form.Checkbox>
             
              </Column>
          </Row>
        ))}
      </Card>
    );
  }

  mounted() {
    taskService.getAll().then((tasks) => (this.tasks = tasks));
  }
}

class TaskNew extends Component {
  title = '';
  id = '';

  render() {
    return (
      <Card title="New task / Delete task">
        <Row>
          <Column width={1}>
            <Form.Label>Title:</Form.Label>
          </Column>
          <Column width={1}>
            <Form.Input
              type="text"
              value={this.title}
              onChange={(event) => (this.title = event.currentTarget.value)}
            />
          </Column>
          <Column width={1}>
          <Button.Success
          onClick={() => {
            taskService.create(this.title).then(() => {
              // Reloads the tasks in the Tasks component
              TaskList.instance()?.mounted(); // .? meaning: call TaskList.instance().mounted() if TaskList.instance() does not return null
              this.title = '';
            });
          }}
        >
          Create
        </Button.Success>
          </Column>
        </Row>
        <Row>
          <Column width={1}>
            <Form.Label>Task Id:</Form.Label>
          </Column>
          <Column width={1}>
            <Form.Input
              type="number"
              value={this.id}
              onChange={(event) => (this.id = event.currentTarget.value)}
            />
          </Column>
          <Column width={1}>
          <Button.Danger
          onClick={() => {
            taskService.delete(this.id).then(() => {
              TaskList.instance()?.mounted(); 
              this.id='';
            });
          }}
        >
          Delete
        </Button.Danger>
          </Column>
        </Row>


      </Card>
      
    );
  }
}



let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <>
      <TaskList />
      <TaskNew />
    </>,
  );
