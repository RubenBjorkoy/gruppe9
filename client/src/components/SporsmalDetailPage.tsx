import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import sporsmalService, { Sporsmal } from "../services/sporsmal-service";
import { Tag } from "../services/tag-service";
import sporsmalTagService from "../services/sporsmalTag-service";
import svarService, { Svar } from "../services/svar-service";
import favorittService, { Favoritt } from "../services/favoritt-service";
import { createHashHistory } from "history";

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

	svarer: Svar[] = [];
	tags: Tag[] = [{ tagid: 0, navn: "", forklaring: "", antall: 0 }];
	svartekst = "";
	reply: string = "";
	favoriteList: number[] = [];

	handleFavoriting = (svar: Svar) => {
		if (this.favoriteList.includes(svar.svarid!)) {
			favorittService.delete(svar.svarid!).then(() => {
				Alert.success("Favoritt fjernet");
			});
		} else {
			favorittService.create(svar.svarid!).then(() => {
				Alert.success("Favoritt lagt til");
			});
		}
		favorittService.getAll().then((favoriteList) => {
			this.favoriteList = favoriteList.map((x) => x.svarid!);
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
				</Card>
				<Button.Success
					onClick={() =>
						history.push(
							"/sporsmal/" + this.props.match.params.sporsmalid + "/rediger"
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
				<Card title="Svarene">
					{this.svarer.map((svar) => {
						return (
							<Card title={"SvarID " + svar.svarid} key={svar.svarid}>
								<Row>
									<Column>
										<Row>
											<Column width={2}>Svar:</Column>
											<Column>{svar.svartekst}</Column>
										</Row>
										<Row>
											<Column width={2}>Poeng:</Column>
											<Column>{svar.poeng}</Column>
										</Row>
										<Row>
											<Column width={2}>Dato:</Column>
											<Column>
												{svar.dato
													.toString()
													.replace("T", " ")
													.substring(0, 19)}
											</Column>
										</Row>
										<Row>
											<Column width={2}>Sist Endret:</Column>
											<Column>
												{svar.sistendret
													.toLocaleString()
													.toString()
													.replace("T", " ")
													.substring(0, 19)}
											</Column>
										</Row>
									</Column>
									<Column>
										<Button.Light
											onClick={() => {
												this.handleFavoriting(svar);
											}}
										>
											{
												//Checks if the answer is in the favorite list
												this.favoriteList.includes(svar.svarid!)
													? "Remove Favorite"
													: "Favorite"
											}
										</Button.Light>
									</Column>
								</Row>
								<Card title="Reply">
									<Row>
										<Column width={10}>
											<Form.Input
												type="text"
												value={this.reply}
												style={{ width: "80vw" }}
												onChange={(event) => {
													this.reply = event.currentTarget.value;
												}}
												onKeyDown={(event: any) => {
													//submits on enter key
													if (event.keyCode === 13 && !event.shiftKey) {
														svarService
															.create(
																this.reply,
																Number(this.sporsmal.sporsmalid),
																0,
																true,
																svar.svarid
															)
															.then(() => {
																// Reloads the Spørsmal
																SporsmalDetails.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
																this.reply = "";
															});
													}
												}}
											/>
										</Column>
									</Row>
									<Column width={2}>
										<Button.Success
											onClick={() => {
												svarService
													.create(
														this.reply,
														Number(this.sporsmal.sporsmalid),
														0,
														true,
														svar.svarid
													)
													.then(() => {
														// Reloads the Spørsmal
														SporsmalDetails.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
														this.svartekst = "";
													});
											}}
										>
											Reply
										</Button.Success>
									</Column>
								</Card>
							</Card>
						);
					})}
				</Card>
			</>
		);
	}

	mounted() {
		sporsmalService
			.get(this.props.match.params.sporsmalid)
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
			.getTagForSporsmal(this.props.match.params.sporsmalid)
			.then((tags) => (this.tags = tags));

		svarService
			.getAll(this.props.match.params.sporsmalid)
			.then((svarer) => (this.svarer = svarer));

		favorittService
			.getAll()
			.then(
				(favoriteList) =>
					(this.favoriteList = favoriteList.map((x) => x.svarid!))
			);
	}
}

export default SporsmalDetails;
