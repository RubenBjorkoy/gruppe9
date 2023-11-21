import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Button, Alert } from "../widgets";
import svarService, { Svar } from "../services/svar-service";
import { createHashHistory } from "history";
import SvarList from "./SvarListCard";
import CommentCard from "./CommentCard";

const history = createHashHistory();

class SvarReplyCard extends Component<{
	sporsmalid: number;
	svar: Svar;
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
		});
	};

	handleDelete = (svar: Svar) => {
		svarService.delete(svar).then(() => {
			Alert.success("Svar slettet");
			SvarList.instance()?.mounted();
			CommentCard.instance()?.mounted();
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
							<Button.Light
								onClick={() =>
									this.handleVoting(svar, this.props.sporsmalid, 1)
								}
							>
								Stem Opp
							</Button.Light>
						</Column>
						<Column width={1}>
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
							<Button.Success
								onClick={() =>
									history.push(
										`/edit/${this.props.svar.sporsmalid}/${this.props.svar.svarid}`
									)
								}
							>
								Rediger
							</Button.Success>
						</Column>
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
