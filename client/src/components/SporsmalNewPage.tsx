import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, Alert } from "../widgets";
import sporsmalService from "../services/sporsmal-service";
import tagService, { Tag } from "../services/tag-service";
import AddTagCard from "./AddTagCard";

class SporsmalNew extends Component {
	tittel: string = "";
	innhold: string = "";
	newTag: Tag = { tagid: 0, navn: "", forklaring: "", antall: 0 };
	tags: Tag[] = [];
	chosenTags: Tag[] = [];

	createQuestion = () => {
		if (this.chosenTags.length == 0) {
			return Alert.danger("Alert no worky");
		}
		sporsmalService
			.create(
				this.tittel,
				this.innhold,
				this.chosenTags.map((tag) => tag.tagid), //Send tagids med sporsmalet
				0
			)
			.then(() => {
				SporsmalNew.instance()?.mounted();
				this.tittel = "";
				this.innhold = "";
			});
	};

	handleTagCreated = () => {
		tagService.getAll().then((tags: Tag[]) => (this.tags = tags));
	};

	render() {
		return (
			<>
				<Card title="Nytt Spørsmål">
					<Column>
						<Row>
							<Column width={2}>
								<Form.Label>Spørsmål Tittel:</Form.Label>
							</Column>
							<Column width={4}>
								<Form.Input
									type="text"
									style={{ width: "20vw" }}
									value={this.tittel}
									onChange={(event) =>
										(this.tittel = event.currentTarget.value)
									}
								/>
							</Column>
						</Row>
						<Row>
							<Column width={2}>
								<Form.Label>Spørsmål Tekst:</Form.Label>
							</Column>
							<Column width={5}>
								<Form.Textarea
									type="text"
									style={{ width: "40vw" }}
									value={this.innhold}
									onChange={(event) =>
										(this.innhold = event.currentTarget.value)
									}
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
											<Row key={tag.tagid}>
												<Column width={5}>{tag.navn}</Column>
												<Column width={5}>
													<Button.Danger
														onClick={() => {
															this.tags.push(tag);
															this.chosenTags = this.chosenTags.filter(
																(chosenTag) => chosenTag.tagid != tag.tagid
															);
															this.tags.sort((a, b) => a.tagid - b.tagid);
														}}
													>
														Remove
													</Button.Danger>
												</Column>
											</Row>
										);
									})}
								</span>
								<Form.Select
									type="number"
									value={this.innhold}
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
						<Column width={1}>
							<Button.Success
								onClick={() => {
									this.createQuestion();
								}}
							>
								Lag Spørsmål
							</Button.Success>
						</Column>
					</Column>
				</Card>
				<AddTagCard onTagCreated={this.handleTagCreated} />
			</>
		);
	}

	mounted() {
		tagService.getAll().then((tags: Tag[]) => (this.tags = tags));
		this.chosenTags = [];
	}
}

export default SporsmalNew;
