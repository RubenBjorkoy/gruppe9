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
	besvart: boolean;
}

class SporsmalList extends Component<{}, SporsmalListState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			sporsmaler: [],
			searchQuery: "",
			besvart: false,
		};
	}

	fetchSporsmaler = (besvart: boolean) => {
		sporsmalService.getAll().then((sporsmaler) => {
			if (!besvart) {
				this.setState({ sporsmaler, besvart });
			} else {
				const unansweredSporsmaler = sporsmaler.filter(
					(sporsmal) => !sporsmal.ersvart
				);
				this.setState({ sporsmaler: unansweredSporsmaler, besvart });
			}
		});
	};

	sortSporsmalByPoeng = () => {
		this.setState((prevState) => {
			const sortedSporsmaler = [...prevState.sporsmaler].sort(
				(a, b) => b.poeng - a.poeng
			);
			return { sporsmaler: sortedSporsmaler };
		});
	};

	sortSporsmalByEditedDate = () => {
		this.setState((prevState) => {
			//Sorts by timestamp of last edited date
			const sortedSporsmaler = [...prevState.sporsmaler].sort((a, b) => {
				const Adate = new Date(a.sistendret).getTime();
				const Bdate = new Date(b.sistendret).getTime();
				return Bdate - Adate;
			});
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
				<Row>
					<Column width={2}>
						<Button.Success onClick={() => this.fetchSporsmaler(false)}>
							Vis Alle Spørsmål
						</Button.Success>
					</Column>
					<Column width={2}>
						<Button.Success onClick={() => this.fetchSporsmaler(true)}>
							Vis Ubesvarte Spørsmål
						</Button.Success>
					</Column>
					<Column width={2}>
						<Button.Success onClick={this.sortSporsmalByPoeng}>
							Sorter etter Antall Visninger
						</Button.Success>
					</Column>
					<Column width={2}>
						<Button.Success onClick={this.sortSporsmalByEditedDate}>
							Sorter etter Sist Endret
						</Button.Success>
					</Column>
				</Row>
				<p></p>

				<Form.Input
					type="text"
					value={searchQuery}
					onChange={this.handleSearchChange}
					placeholder="Søk etter spørsmål"
				/>
				<p></p>
				<Card title="Spørsmål">
					{filteredSporsmaler.map((sporsmal) => (
						<Row key={sporsmal.sporsmalid}>
							<Column width={1}>{sporsmal.sporsmalid}</Column>
							<Column width={1}>{sporsmal.tittel}</Column>
							<Column width={1}>{sporsmal.innhold}</Column>
							<Column width={1}>{sporsmal.poeng}</Column>
							<Column width={2}>
								{new Date(sporsmal.dato)
									.toLocaleString()
									.toString()
									.replace(",", " ")}
							</Column>
							<Column width={2}>
								{new Date(sporsmal.sistendret)
									.toLocaleString()
									.toString()
									.replace(",", " ")}
							</Column>
							<Column width={1}>
								<Button.Success
									onClick={() =>
										history.push("/sporsmal/" + sporsmal.sporsmalid)
									}
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
			.then((sporsmaler) => this.setState({ sporsmaler }));
	}
}

export default SporsmalList;
