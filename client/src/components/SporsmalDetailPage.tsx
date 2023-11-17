import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import sporsmalService, { Sporsmal } from "../services/sporsmal-service";
import { Tag } from "../services/tag-service";
import sporsmalTagService from "../services/sporsmalTag-service";
import svarService, { Svar } from "../services/svar-service";
import favorittService, { Favoritt } from "../services/favoritt-service";
import { createHashHistory } from "history";
import SvarList from "./SvarListCard";

const history = createHashHistory();

class SporsmalDetails extends Component<{
	sporsmalid: number
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
		svarService.getAll(this.props.sporsmalid).then((svar: Svar[]) => (this.svarer = svar)); // Reloads the tags on tag creation
	};

	// function for deleting a question using sporsmalserivce

	// function for editing a queastion using sporsmalserivce
	

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
				</Card>
				<Button.Success
					onClick={() =>
						history.push(
							"/sporsmal/" + this.props.sporsmalid + "/rediger"
						)
					}
				>
					Rediger
				</Button.Success>

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
									if (event.keyCode === 13 && !event.shiftKey) {
										svarService
											.create(
												this.svartekst,
												Number(this.sporsmal.sporsmalid),
												0,
												false
											)
											.then(() => {
												// Reloads the Spørsmal
												SporsmalDetails.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
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
										SporsmalDetails.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
										this.svartekst = "";
									});
							}}
						>
							Create Answer
						</Button.Success>
					</Column>
				</Card>
				<SvarList sporsmalid={this.props.sporsmalid} onReply={this.handleReply} />
			</>
		);
	}

	mounted() {
		sporsmalService
			.get(this.props.sporsmalid)
			.then((sporsmal: Sporsmal) => (this.sporsmal = sporsmal))
			.then(() => {
				//Increase points when user enters the page to increase popularity
				const UpdatedQuestion = {
					...this.sporsmal,
					poeng: this.sporsmal.poeng + 1,
				};
				//sporsmalService.update(UpdatedQuestion).then(() => {});
			})
			.catch((error) =>
				Alert.danger("Finner ikke spørsmålet: " + error.message)
			);
		sporsmalTagService
			.getTagForSporsmal(this.props.sporsmalid)
			.then((tags) => (this.tags = tags));

		
	}
}

export default SporsmalDetails;
