import * as React from "react";
import { ReactNode, ChangeEvent } from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import sporsmalService, { Sporsmal } from "../services/sporsmal-service";
import { createHashHistory } from "history";

const history = createHashHistory();

interface SporsmalListState {
	sporsmaler: Sporsmal[];
	searchQuery: string;
}

class SporsmalList extends Component <{}, SporsmalListState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			sporsmaler: [],
			searchQuery: '',
		}
	}
	// sporsmaler: Sporsmal[] = [];

	sortSporsmalByPoeng = () => {
		this.setState((prevState) => {
    const sortedSporsmaler = [...prevState.sporsmaler].sort((a, b) => b.poeng - a.poeng);
    return { sporsmaler: sortedSporsmaler };
		});
	};

	handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

	render() {
		const { sporsmaler, searchQuery } = this.state;

		const filteredSporsmaler = sporsmaler.filter((sporsmal) =>
			sporsmal.tittel.toLowerCase().includes(searchQuery.toLowerCase())
		);

		return (
			<>
			<Button.Success
				onClick={this.sortSporsmalByPoeng}
			>
				Sorter etter Antall Visninger
			</Button.Success>

			<Form.Input
          type="text"
          value={searchQuery}
          onChange={this.handleSearchChange}
          placeholder="Søk etter spørsmål"
        />
				
			<Card title="Spørsmål">
				{filteredSporsmaler.map((sporsmal) => (
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
			</>
		);
	}

	componentDidMount() {
		sporsmalService
			.getAll()
			.then((sporsmaler) => (this.setState({ sporsmaler })));
	}
}

export default SporsmalList;