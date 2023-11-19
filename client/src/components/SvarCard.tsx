import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import svarService, { Svar } from "../services/svar-service";
import favorittService, { Favoritt } from "../services/favoritt-service";
import { createHashHistory } from "history";
import SvarReplyCard from "./SvarReply";

const history = createHashHistory();

class SvarCard extends Component<{
	sporsmalid: number;
	svar: Svar;
	//onReply: () => void;
}> {
	svartekst: string = "";
	reply: string = "";
	favoriteList: number[] = [];
	svarer: Svar[] = [];
	svarsvarer: Svar[] = [];

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
				//this.props.onReply();
				SvarCard.instance()?.mounted();
			});
	};

	renderReplies() {
		if (this.svarsvarer.length > 0) {
			return this.svarsvarer.map((svar) => (
				<SvarReplyCard
					key={svar.svarid}
					sporsmalid={this.props.sporsmalid}
					svar={svar}
				/>
			));
		}
		return null; // If there are no replies, return null
	}

	render() {
		return (
			<>
				<Card
					title={"SvarID " + this.props.svar.svarid}
					key={this.props.svar.svarid}
				>
					<Row>
						<Column>
							<Row>
								<Column width={4}>Svar:</Column>
								<Column>{this.props.svar.svartekst}</Column>
							</Row>
							<Row>
								<Column width={4}>Poeng:</Column>
								<Column>{this.props.svar.poeng}</Column>
							</Row>
							<Row>
								<Column width={4}>Dato:</Column>
								<Column>
									{this.props.svar.dato
										.toString()
										.replace("T", " ")
										.substring(0, 19)}
								</Column>
							</Row>
							<Row>
								<Column width={4}>Sist Endret:</Column>
								<Column>
									{this.props.svar.sistendret
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
									this.handleFavoriting(this.props.svar);
								}}
							>
								{
									//Checks if the answer is in the favorite list
									this.favoriteList.includes(this.props.svar.svarid!)
										? "Remove Favorite"
										: "Favorite"
								}
							</Button.Light>
							<Column width={1}>
								{/*Upvote button*/}
								<Button.Light
									small={true}
									onClick={() =>
										this.handleVoting(this.props.svar, this.props.sporsmalid, 1)
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
										this.handleVoting(
											this.props.svar,
											this.props.sporsmalid,
											-1
										)
									}
								>
									<span style={{ fontSize: "40px" }}>
										&#11206; {/*Unicode for arrow down*/}
									</span>
								</Button.Light>
							</Column>
						</Column>
					</Row>
					<Column width={8}>
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
									this.handleReply(this.props.svar);
								}
							}}
						/>
					</Column>
					<Column>
						<Button.Success
							onClick={() => {
								this.handleReply(this.props.svar);
							}}
						>
							Reply
						</Button.Success>
					</Column>
					<Column>
						{
							this.renderReplies() // Renders the replies
						}
					</Column>
				</Card>
			</>
		);
	}

	mounted() {
		svarService.getAll(this.props.sporsmalid).then((svarer) => {
			this.svarer = svarer.filter((svar) => svar.ersvar === false);
			this.svarsvarer = svarer.filter((svar) => svar.ersvar === true);
			this.svarsvarer = svarer.filter(
				(svar) => svar.svarsvarid === this.props.svar.svarid
			);
		});

		favorittService
			.getAll()
			.then(
				(favoriteList) =>
					(this.favoriteList = favoriteList.map((x) => x.svarid!))
			);
	}
}

export default SvarCard;
