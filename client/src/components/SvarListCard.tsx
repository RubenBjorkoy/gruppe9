import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import svarService, { Svar } from "../services/svar-service";
import favorittService, { Favoritt } from "../services/favoritt-service";
import { createHashHistory } from "history";

const history = createHashHistory();

class SvarList extends Component<{
	sporsmalid: number;
	onReply: () => void;
}> {
	svartekst: string = "";
	reply: string = "";
	favoriteList: number[] = [];
	svarer: Svar[] = [];

	handleVoting = (svar: Svar, sporsmalid: number, increment: number) => {
		const updatedSvar = {
			...svar,
			poeng: svar.poeng + increment,
		};
		svarService.update(updatedSvar, sporsmalid, false).then(() => {
			Alert.success("Vurdering gitt");
		});
	};

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

	handleReply = (svar: Svar) => {
		svarService
			.create(this.reply, this.props.sporsmalid, 0, true, svar.svarid)
			.then(() => {
				this.reply = "";
				this.props.onReply();
				SvarList.instance()?.mounted();
			});
	};
	render() {
		return (
			<Card title="Svarene">
				{this.svarer.map((svar) => {
					return (
						<Card title={"SvarID " + svar.svarid} key={svar.svarid}>
							<Row>
								<Column>
									<Row>
										<Column width={4}>Svar:</Column>
										<Column>{svar.svartekst}</Column>
									</Row>
									<Row>
										<Column width={4}>Poeng:</Column>
										<Column>{svar.poeng}</Column>
									</Row>
									<Row>
										<Column width={4}>Dato:</Column>
										<Column>
											{svar.dato.toString().replace("T", " ").substring(0, 19)}
										</Column>
									</Row>
									<Row>
										<Column width={4}>Sist Endret:</Column>
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
									{/*Favorite button*/}
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
									<Column width={1}>
										{/*Upvote button*/}
										<Button.Light
											small={true}
											onClick={() =>
												this.handleVoting(svar, this.props.sporsmalid, 1)
											}
										>
											<span style={{ fontSize: "40px" }}>
												&#11205; {/*Unicode for arrow up*/}
											</span>
										</Button.Light>
									</Column>
									<Column width={1}>
										{/*Downvote button*/}
										<Button.Light
											small={true}
											onClick={() =>
												this.handleVoting(svar, this.props.sporsmalid, -1)
											}
										>
											<span style={{ fontSize: "40px" }}>
												&#11206; {/*Unicode for arrow down*/}
											</span>
										</Button.Light>
									</Column>
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
															Number(this.props.sporsmalid),
															0,
															true,
															svar.svarid
														)
														.then(() => {
															// Reloads the Spørsmal
															this.handleReply(svar);
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
											this.handleReply(svar);
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
		);
	}

	mounted() {
		svarService
			.getAll(this.props.sporsmalid)
			.then((svarer) => (this.svarer = svarer));

		favorittService
			.getAll()
			.then(
				(favoriteList) =>
					(this.favoriteList = favoriteList.map((x) => x.svarid!))
			);
	}
}

export default SvarList;
