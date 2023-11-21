import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, Alert } from "../widgets";
import sporsmalService, { Sporsmal } from "../services/sporsmal-service";
import tagService, { Tag } from "../services/tag-service";
import sporsmalTagService from "../services/sporsmalTag-service";

import { createHashHistory } from "history";
import AddTagCard from "./AddTagCard";

const history = createHashHistory();

class SporsmalEdit extends Component<{
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

	tags: Tag[] = [];
	chosenTags: Tag[] = [];

	handleUpdate = async () => {
		const updatedSporsmal: Sporsmal = {
			...this.sporsmal,
		};

		if (this.chosenTags.length == 0) {
			return Alert.danger("Du må velge minst en tag");
		}

		await sporsmalService
			.update(updatedSporsmal, true, this.chosenTags)
			.then(() => {
				Alert.success("Spørsmål endret");
			})
			.catch((error) => {
				Alert.danger("Kunne ikke endre spørsmål: " + error.message);
				console.error(error);
			});
		history.push("/sporsmal/" + this.sporsmal.sporsmalid);
	};

	handleTagCreated = () => {
		tagService.getAll().then((tags: Tag[]) => (this.tags = tags)); // Laste inn tagene etter de er skapt
	};

	render() {
		return (
			<>
				<Card title="Rediger Spørsmål">
					<Row>
						<Column width={2}>Tittel:</Column>
						<Column>
							<Form.Input
								type="text"
								value={this.sporsmal.tittel}
								onChange={(e) => (this.sporsmal.tittel = e.target.value)}
								placeholder={this.sporsmal.tittel}
							/>
						</Column>
					</Row>
					<Row>
						<Column width={2}>Innhold:</Column>
						<Column>
							<Form.Textarea
								value={this.sporsmal.innhold}
								onChange={(e) => (this.sporsmal.innhold = e.target.value)}
								placeholder={this.sporsmal.innhold}
							/>
						</Column>
					</Row>
					<Row>
						<Column width={2}>
							<Form.Label>Spørsmål Tag:</Form.Label>
						</Column>
						<Column width={4}>
							<span>
								{this.chosenTags.map((tag) => {
									return (
										<>
											<Row key={tag.tagid}>
												<Column width={5}>{tag.navn}</Column>
												<Column width={5}>
													<Button.Danger
														onClick={() => {
															sporsmalTagService.delete(
																this.props.match.params.sporsmalid,
																tag.tagid
															);
															this.tags.push(tag);
															this.chosenTags = this.chosenTags.filter(
																(chosenTag) => {
																	return chosenTag.tagid != tag.tagid;
																}
															);
															this.tags.sort((a, b) => a.tagid - b.tagid);
														}}
													>
														Slett
													</Button.Danger>
												</Column>
											</Row>
										</>
									);
								})}
							</span>
							<Form.Select
								type="number"
								value={this.sporsmal.innhold}
								onChange={(event) => {
									this.chosenTags.push(
										this.tags.find(
											(tag) => tag.tagid == Number(event.currentTarget.value)
										) as Tag
									);
									this.tags = this.tags.filter(
										(tag) => tag.tagid != Number(event.currentTarget.value)
									);
								}}
							>
								<option value={0}>Velg Tag</option>
								{this.tags.map((tag) => {
									return (
										<option value={tag.tagid} key={tag.tagid}>
											{tag.navn}
										</option>
									);
								})}
							</Form.Select>
						</Column>
					</Row>
					<Row>
						<Column>
							<Button.Success onClick={this.handleUpdate}>
								Oppdater
							</Button.Success>
						</Column>
					</Row>
				</Card>
				<AddTagCard onTagCreated={this.handleTagCreated} />
			</>
		);
	}
	componentDidMount() {
		sporsmalService
			.get(this.props.match.params.sporsmalid)
			.then((sporsmal: Sporsmal) => {
				this.sporsmal = sporsmal;
			})
			.catch((error) =>
				Alert.danger("Finner ikke spørsmålet: " + error.message)
			);
		Promise.all([
			sporsmalTagService.getTagForSporsmal(this.props.match.params.sporsmalid),
			tagService.getAll(),
		])
			.then(([chosenTags, allTags]) => {
				this.chosenTags = chosenTags;

				// Filtrer for kun chosenTags
				this.tags = allTags.filter(
					(tag) =>
						!chosenTags.some((chosenTag) => chosenTag.tagid === tag.tagid)
				);
			})
			.catch((error) =>
				Alert.danger("Finner ikke spørsmålet: " + error.message)
			);
	}
}

export default SporsmalEdit;
