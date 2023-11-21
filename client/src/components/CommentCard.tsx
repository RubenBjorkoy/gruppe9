import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, Alert } from "../widgets";
import sporsmalService, { Sporsmal } from "../services/sporsmal-service";
import { Tag } from "../services/tag-service";
import svarService, { Svar } from "../services/svar-service";
import { createHashHistory } from "history";
import SvarReply from "./SvarReply";

const history = createHashHistory();

class CommentCard extends Component<{
	sporsmalid: number;
}> {
	kommentarer: Svar[] = [];
	kommentartekst = "";

	handleReply = () => {
		svarService
			.create(this.kommentartekst, Number(this.props.sporsmalid), 0, true)
			.then(() => {
				// Laster inn Spørsmål på nytt
				CommentCard.instance()?.mounted();
				this.kommentartekst = "";
			});
	};

	render() {
		return (
			<Card title="Kommentarerer">
				<Row>
					<Column width={10}>
						<Form.Input
							type="text"
							value={this.kommentartekst}
							style={{ width: "80vw" }}
							onChange={(event) => {
								this.kommentartekst = event.currentTarget.value;
							}}
							onKeyDown={(event: any) => {
								//Bruk returtast i tillegg til knapp
								if (event.keyCode === 13) {
									this.handleReply();
								}
							}}
						/>
					</Column>
					<Column width={1}>
						<Button.Success
							onClick={() => {
								this.handleReply();
							}}
						>
							Kommentar
						</Button.Success>
					</Column>
				</Row>

				{this.kommentarer.length > 0 &&
					this.kommentarer.map((svar) => (
						<SvarReply
							key={svar.svarid}
							svar={svar}
							sporsmalid={this.props.sporsmalid}
						/>
					))}
			</Card>
		);
	}

	mounted() {
		const getAllPromise = svarService.getAll(this.props.sporsmalid);
		if (getAllPromise) {
			getAllPromise.then((svar: Svar[]) => {
				this.kommentarer = svar.filter((svar) => svar.ersvar);
				this.kommentarer = this.kommentarer.filter(
					(kommentar) => kommentar.svarsvarid == null
				);
			});
		}
	}
}

export default CommentCard;
