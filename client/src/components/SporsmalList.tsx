import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import sporsmalService, { Sporsmal } from "../services/sporsmal-service";
import { createHashHistory } from "history";

const history = createHashHistory();

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
						<Column width={2}>
							{sporsmal.dato?.toString().replace("T", " ").substring(0, 19)}
						</Column>
						<Column width={2}>
							{sporsmal.sistendret
								?.toString()
								.replace("T", " ")
								.substring(0, 19)}
						</Column>
						<Column width={1}>
							<Button.Success
								onClick={() => history.push("/sporsmal/" + sporsmal.sporsmalid)}
							>
								Til Spørsmål
							</Button.Success>
						</Column>
					</Row>
				))}
			</Card>
		);
	}

	mounted() {
		sporsmalService
			.getAll()
			.then((sporsmaler) => (this.sporsmaler = sporsmaler));
	}
}

export default SporsmalList;
