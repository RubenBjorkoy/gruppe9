import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import svarService, { Svar } from "../services/svar-service";
import favorittService, { Favoritt } from "../services/favoritt-service";
import { createHashHistory } from "history";
import SvarCard from "./SvarCard";

const history = createHashHistory();

class SvarList extends Component<{
	sporsmalid: number;
	onReply: () => void;
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
				this.props.onReply();
				SvarList.instance()?.mounted();
			});
	};
	render() {
		return (
			<Card title="Svarene">
				{this.svarer.map((svar) => {
					return <SvarCard svar={svar} sporsmalid={this.props.sporsmalid} />;
				})}
			</Card>
		);
	}

	mounted() {
		svarService.getAll(this.props.sporsmalid).then((svarer) => {
			this.svarer = svarer.filter((svar) => svar.ersvar === false);
			this.svarsvarer = svarer.filter((svar) => svar.ersvar === true);
			console.log(this.svarer);
			console.log(this.svarsvarer);
		});

		favorittService
			.getAll()
			.then(
				(favoriteList) =>
					(this.favoriteList = favoriteList.map((x) => x.svarid!))
			);
	}
}

export default SvarList;
