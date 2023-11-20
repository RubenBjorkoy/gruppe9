import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import { Svar } from "../services/svar-service";
import favorittService, { Favoritt } from "../services/favoritt-service";
import { createHashHistory } from "history";
import sporsmalService, { Sporsmal } from "../services/sporsmal-service";

const history = createHashHistory();

class FavoriteList extends Component {
	favoritter: Svar[] = [];

	render() {
		return (
			<Card title="Favoritter">
				<Row>
					<Column width={5}>Svar</Column>
					<Column width={1}>SvarID</Column>
					<Column width={1}>Poeng</Column>
				</Row>
				{this.favoritter.map((favoritt) => (
					<Row key={favoritt.svarid}>
						<Column width={5}>{favoritt.svartekst}</Column>
						<Column width={1}>{favoritt.svarid}</Column>
						<Column width={1}>{favoritt.poeng}</Column>
						{/* <Column width={1}>{favoritt.sistendret}</Column> */}
					</Row>
				))}
			</Card>
		);
	}

	mounted() {
		favorittService
			.getAll()
			.then((favoritter: Svar[]) => (this.favoritter = favoritter));
	}
}

export default FavoriteList;
