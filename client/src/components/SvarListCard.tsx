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

interface SvarListState {
	svarer: Svar[];
}

class SvarList extends Component<{
	sporsmalid: number,
    onReply: () => void
}, SvarListState> 
{
    svartekst: string = "";
	reply: string = "";
	favoriteList: number[] = [];
	svarer: Svar[] = [];
	
	handleVoting = (svar: Svar, sporsmalid: number, increment: number) => {
        const updatedSvar = {
            ...svar,
            poeng: svar.poeng + increment
        }
		svarService.update(updatedSvar, sporsmalid).then(() => {
			Alert.success("Vurdering gitt");


		});
	
		
    }

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
        svarService.create(this.reply, this.props.sporsmalid, 0, true, svar.svarid).then(() => {
            this.reply = "";
            this.props.onReply();
        });
    }
    render() {
        return (
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
														this.svartekst = "";
													});
											}}
										>
											Reply
										</Button.Success>
										<Row>
							<Column width={1}>
							<Button.Light onClick={() => this.handleVoting(svar, this.props.sporsmalid, 1)}>
								Vote Up
							</Button.Light>
							</Column>
							<Column width={1}>
							<Button.Light onClick={() => this.handleVoting(svar, this.props.sporsmalid, -1)}>
								Vote Down
							</Button.Light>
							</Column>
						</Row>
									</Column>
								</Card>
							</Card>
						);
					})}
			</Card>
        );
    }

    mounted()  {
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