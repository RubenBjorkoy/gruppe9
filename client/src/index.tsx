import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { Card, Row, Column, Form, Button } from './widgets';
import sporsmalService, { Sporsmal } from './sporsmal-service';

class SporsmalList extends Component {
  sporsmaler: Sporsmal[] = [];

  render() {
    return (
      <Card title="Spørsmål">
        {this.sporsmaler.map((sporsmal) => (
          <Row key={sporsmal.sporsmalid}>
            <Column width={1}>{sporsmal.sporsmalid}</Column> 
            <Column width={1}>{sporsmal.tittel}</Column>
            <Column width={1}>{sporsmal.innhold}</Column>
            <Column width={1}>{sporsmal.poeng}</Column>
            {/* <Column width={1}>{sporsmal.dato}</Column>
            <Column width={1}>{sporsmal.sistendret}</Column> */}
          </Row>
        ))}
      </Card>
    );
  }

  mounted() {
    sporsmalService.getAll().then((sporsmaler) => (this.sporsmaler = sporsmaler));
  }
}


class SporsmalNew extends Component {

  tittel = '';
  innhold = '';
  poeng = 0;
  // dato = Date();
  // sistendret = Date();


  render() {
    return (
      <Card title="Nytt Spørsmål">
        <Row>
          <Column width={1}>
            <Form.Label>Spørsmål Tittel:</Form.Label>
          </Column>
          <Column width={4}>
            <Form.Input
              type="text"
              value={this.tittel}
              onChange={(event) => (this.tittel = event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Row>
          <Column width={1}>
            <Form.Label>Spørsmål:</Form.Label>
          </Column>
          <Column width={4}>
            <Form.Input
              type="text"
              value={this.innhold}
              onChange={(event) => (this.innhold = event.currentTarget.value)}
            />
          </Column>

        </Row>
        <Column width={1}>
          <Button.Success
          onClick={() => {
            this.poeng = 0;
            sporsmalService.create(this.tittel, this.innhold, this.poeng).then(() => {
              // Reloads the Spørsmal
              SporsmalList.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
              this.tittel = '';
              this.innhold = '';
            });
          }}
        >
          Create
        </Button.Success>
          </Column>
      </Card>
      
    );
  }
}

let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <>
      <SporsmalList />
      <SporsmalNew />
    </>,
  );