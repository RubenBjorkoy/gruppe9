import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, Alert } from "../widgets";
import sporsmalService, { Sporsmal } from "../services/sporsmal-service";
import { Tag } from "../services/tag-service";
import sporsmalTagService from "../services/sporsmalTag-service";
import svarService, { Svar } from "../services/svar-service";
import { createHashHistory } from "history";
import SvarList from "./SvarListCard";
//import SvarReply from "./SvarReply";
import CommentCard from "./commentCard";

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
	kommentartekst = "";
	svartekst = "";
	svarer: Svar[] = [];
	svarListe: Svar[] = [];
	kommentarer: Svar[] = [];

	handleReply = () => {
		svarService
			.getAll(this.props.match.params.sporsmalid)
			.then((svar: Svar[]) => (this.svarer = svar));
	};

	handleDelete = () => {
		sporsmalService.delete(this.props.match.params.sporsmalid).then(() => {
			Alert.success("Spørsmål slettet");
			history.push("/");
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
							{new Date(this.sporsmal.dato)
								.toLocaleString()
								.toString()
								.replace(",", " ")}
						</Column>
					</Row>
					<Row>
						<Column width={2}>Sist Endret:</Column>
						<Column>
							{new Date(this.sporsmal.sistendret)
								.toLocaleString()
								.toString()
								.replace(",", " ")}
						</Column>
					</Row>
					<Row>
						<Column width={2}>Godkjent Svar:</Column>
						<Column>
							{
								this.svarListe.find((svar) => {
									return svar.svarid === this.sporsmal.bestsvarid;
								})?.svartekst // Vis text til bestsvar dersom det finnes.
							}
						</Column>
					</Row>
					<Row>
						<Column width={2}>Tagger:</Column>
						<Column>
							{this.tags.map((tag) => {
								return (
									<Row key={"Tag:" + tag.tagid}>
										<Column width={5}>{tag.navn}</Column>
									</Row>
								);
							})}
						</Column>
					</Row>

					<Button.Success
						onClick={() => history.push(`/rediger/${this.sporsmal.sporsmalid}`)}
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
					<CommentCard sporsmalid={this.props.match.params.sporsmalid} />
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
												// Laster inn Spørsmål på nytt
												SvarList.instance()?.mounted();
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
										SvarList.instance()?.mounted();
										this.svartekst = "";
									});
							}}
						>
							Lag Svar
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
				// Øker poeng for Spørsmål med lasting av side
				const updatedPoeng = sporsmal.poeng + 1;
				const updatedSporsmal: Sporsmal = { ...sporsmal, poeng: updatedPoeng };

				// Oppdatere spørsmål med nytt poeng
				sporsmalService.update(updatedSporsmal, false).then(() => {
					this.sporsmal = updatedSporsmal;
				});
			})
			.catch((error) =>
				Alert.danger("Finner ikke spørsmålet: " + error.message)
			);

		sporsmalTagService
			.getTagForSporsmal(this.props.match.params.sporsmalid)
			.then((tags: Tag[]) => {
				this.tags = tags;
			}); // Hent alle tagene for spørsmålet

		const getAllPromise = svarService.getAll(
			this.props.match.params.sporsmalid
		);
		if (getAllPromise) {
			getAllPromise.then((svar: Svar[]) => {
				this.svarListe = svar;
				this.kommentarer = svar.filter((svar) => svar.ersvar);
				this.kommentarer = this.kommentarer.filter(
					(kommentar) => kommentar.svarsvarid == null
				);
			});
		}
	}
}

export default SporsmalDetails;
