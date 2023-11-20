import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import svarService, { Svar } from "../services/svar-service";
import { createHashHistory } from "history";
import SvarCard from "./SvarCard";

const history = createHashHistory();

class SvarReplyCard extends Component<{
	sporsmalid: number;
	svar: Svar;
	//onReply: () => void;
}> {
	svarsvarer: Svar[] = [];

	handleVoting = (svar: Svar, sporsmalid: number, increment: number) => {
		const updatedSvar = {
			...svar,
			poeng: svar.poeng + increment,
		};
		svarService.update(updatedSvar, sporsmalid, false).then(() => {
			svar = updatedSvar;
			Alert.success("Vurdering gitt");
			SvarCard.instance()?.mounted();
		});
	};

	handleDelete = (svar: Svar) => {
		svarService.delete(svar).then(() => {
			SvarCard.instance()?.mounted();
			Alert.success("Svar slettet");
		});
	};

	render() {
		const svar = this.props.svar;
		return (
			<Card title={"Kommentar"} key={svar.svarid}>
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
								{new Date(svar.dato)
									.toLocaleString()
									.toString()
									.replace(",", " ")}
							</Column>
						</Row>
						<Row>
							<Column width={4}>Sist Endret:</Column>
							<Column>
								{new Date(svar.sistendret)
									.toLocaleString()
									.toString()
									.replace(",", " ")}
							</Column>
						</Row>
					</Column>
					<Column>
						<Column width={1}>
							{/*Upvote button*/}
							<Button.Light
								onClick={() =>
									this.handleVoting(svar, this.props.sporsmalid, 1)
								}
							>
								Stem Opp
							</Button.Light>
						</Column>
						<Column width={1}>
							{/*Downvote button*/}
							<Button.Light
								onClick={() =>
									this.handleVoting(svar, this.props.sporsmalid, -1)
								}
							>
								Stem Ned
							</Button.Light>
						</Column>
					</Column>
				</Row>
				{
					<Row>
						<Column>
							<Button.Danger
								onClick={() => {
									this.handleDelete(this.props.svar);
								}}
							>
								Slett
							</Button.Danger>
						</Column>
					</Row>
				}
			</Card>
		);
	}

	mounted() {}
}

export default SvarReplyCard;
