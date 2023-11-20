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

	sortedByPoeng: boolean = false;

	handleSortByPoeng = () => {
		this.sortedByPoeng = true;
		this.fetchData();
	};

	handleSortByDefault = () => {
		this.sortedByPoeng = false;
		this.fetchData();
	};

	handleVoting = (svar: Svar, sporsmalid: number, increment: number) => {
		const updatedPoeng = svar.poeng + increment;
		const updatedSvar: Svar = {
			...svar,
			poeng: updatedPoeng,
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
		const sortedSvarer = [...this.svarer].sort((a, b) =>
			this.sortedByPoeng ? b.poeng - a.poeng : 0
		);

		return (
			<>
				<div>
					<Button.Success onClick={this.handleSortByPoeng}>
						Sorter etter Poeng
					</Button.Success>
					<Button.Success onClick={this.handleSortByDefault}>
						Sorter vanlig etter dato lastet opp
					</Button.Success>
				</div>
				<Card title="Svarene">
					{sortedSvarer.map((svar) => (
						<SvarCard
							key={svar.svarid}
							svar={svar}
							sporsmalid={this.props.sporsmalid}
						/>
					))}
				</Card>
			</>
		);
	}

	mounted() {
		this.fetchData();

		favorittService
			.getAll()
			.then(
				(favoriteList) =>
					(this.favoriteList = favoriteList.map((x) => x.svarid!))
			);
	}

	fetchData() {
		svarService.getAll(this.props.sporsmalid).then((svarer) => {
			// Apply filtering if needed
			const filteredSvarer = svarer.filter((svar) => !svar.ersvar);

			// Update the component data
			this.svarer = filteredSvarer;

			// Force a re-render by calling forceUpdate
			// this.forceUpdate();
		});
	}
}

export default SvarList;
