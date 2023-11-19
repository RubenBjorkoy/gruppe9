import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import sporsmalService, { Sporsmal } from "../services/sporsmal-service";
import { Tag } from "../services/tag-service";
import sporsmalTagService from "../services/sporsmalTag-service";
import svarService, { Svar } from "../services/svar-service";
import { createHashHistory } from "history";
import SvarList from "./SvarListCard";

const history = createHashHistory();

class SporsmalDetails extends Component<{
	match: { params: { sporsmalid: number } };
}> {
	sporsmal: Sporsmal = {
		sporsmalid: 0,
		tittel: "",
		innhold: "",
		poeng: 0,
		dato: new Date(),
		sistendret: new Date(),
		bestsvarid: 0,
		ersvart: false,
	};

	tags: Tag[] = [{ tagid: 0, navn: "", forklaring: "", antall: 0 }];
	svartekst = "";
	svarer: Svar[] = [];

	handleReply = () => {
		svarService
			.getAll(this.props.match.params.sporsmalid)
			.then((svar: Svar[]) => (this.svarer = svar));
	};

	handleDelete = () => {
		sporsmalService.delete(this.props.match.params.sporsmalid).then(() => {
			Alert.success("Spørsmål slettet");
			history.push("/sporsmal");
		});
	};

	handleEdit = () => {
		sporsmalService.update(this.sporsmal).then(() => {
			Alert.success("Spørsmål endret");
		});
	};

	render() {
		return (
			<>
				<Card title="Spørsmål">
					<Row>
						<Column width={2}>Tittel:</Column>
						<Column>{this.sporsmal.tittel}</Column>
					</Row>
					<Row>
						<Column width={2}>Spørsmål:</Column>
						<Column>{this.sporsmal.innhold}</Column>
					</Row>
					<Row>
						<Column width={2}>Poeng:</Column>
						<Column>{this.sporsmal.poeng}</Column>
					</Row>
					<Row>
						<Column width={2}>Dato:</Column>
						<Column>
							{this.sporsmal.dato.toString().replace("T", " ").substring(0, 19)}
						</Column>
					</Row>
					<Row>
						<Column width={2}>Sist Endret:</Column>
						<Column>
							{this.sporsmal.sistendret
								.toString()
								.replace("T", " ")
								.substring(0, 19)}
						</Column>
					</Row>
					<Row>
						<Column width={2}>Godkjent Svar:</Column>
						<Column>
							{/* <Form.Checkbox checked={this.sporsmal.ersvart} onChange={() => {}} /> */}
						</Column>
					</Row>
					<Row>
						<Column width={2}>Tagger:</Column>
						<Column>
							{this.tags.map((tag) => {
								return (
									<>
										<Row key={tag.tagid}>
											<Column width={5}>{tag.navn}</Column>
										</Row>
									</>
								);
							})}
						</Column>
					</Row>

					<Button.Success
						onClick={() => {
							this.handleEdit();
						}}
					>
						Rediger
					</Button.Success>
					<Button.Danger
						onClick={() => {
							this.handleDelete();
						}}
					>
						Slett
					</Button.Danger>
				</Card>

				<Card title="Nytt Svar">
					<Row>
						<Column width={10}>
							<Form.Input
								type="text"
								value={this.svartekst}
								style={{ width: "80vw" }}
								onChange={(event) => {
									this.svartekst = event.currentTarget.value;
								}}
								onKeyDown={(event: any) => {
									//submits on enter key
									if (event.keyCode === 13) {
										svarService
											.create(
												this.svartekst,
												Number(this.sporsmal.sporsmalid),
												0,
												false
											)
											.then(() => {
												// Reloads the Spørsmal
												SvarList.instance()?.mounted(); // .? meaning: call SvarList.instance().mounted() if SvarList.instance() does not return null
												this.svartekst = "";
											});
									}
								}}
							/>
						</Column>
					</Row>
					<Column width={1}>
						<Button.Success
							onClick={() => {
								svarService
									.create(
										this.svartekst,
										Number(this.sporsmal.sporsmalid),
										0,
										false
									)
									.then(() => {
										// Reloads the Spørsmal
										SvarList.instance()?.mounted(); // .? meaning: call SvarList.instance().mounted() if SvarList.instance() does not return null
										this.svartekst = "";
									});
							}}
						>
							Create Answer
						</Button.Success>
					</Column>
				</Card>
				<SvarList
					sporsmalid={this.props.match.params.sporsmalid}
					onReply={this.handleReply}
				/>
			</>
		);
	}

	mounted() {
		sporsmalService
			.get(this.props.match.params.sporsmalid)
			.then((sporsmal: Sporsmal) => {
				// Increment poeng by 1
				const updatedPoeng = sporsmal.poeng + 1;
				const updatedSporsmal: Sporsmal = { ...sporsmal, poeng: updatedPoeng };

				// Update the sporsmal with the incremented poeng
				sporsmalService.update(updatedSporsmal, false).then(() => {
					// Set the sporsmal in the component state
					this.sporsmal = updatedSporsmal;

					// Increase points when user enters the page to increase popularity
				});
			})
			.catch((error) =>
				Alert.danger("Finner ikke spørsmålet: " + error.message)
			);

		sporsmalTagService
			.getTagForSporsmal(this.props.match.params.sporsmalid)

		// Increase points when user enters the page to increase popularity
	}
}

export default SporsmalDetails;
