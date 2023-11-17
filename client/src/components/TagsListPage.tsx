import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import { Sporsmal } from "../services/sporsmal-service";
import tagService, { Tag } from "../services/tag-service";
import sporsmalTagService from "../services/sporsmalTag-service";
import { createHashHistory } from "history";
import AddTagCard from "./AddTagCard";

const history = createHashHistory();

class TagsList extends Component {
	tags: Tag[] = [];
	sporsmal: Sporsmal[] = [];
	newTag: Tag = { tagid: 0, navn: "", forklaring: "", antall: 0 };

	handleTagCreated = () => {
		tagService.getAll().then((tags: Tag[]) => (this.tags = tags)); // Reloads the tags on tag creation
	};

	render() {
		return (
			<>
				<Card title="Tags">
					{this.tags.map((tag) => (
						<Row key={tag.tagid}>
							<Column width={1}>{tag.tagid}</Column>
							<Column width={1}>{tag.navn}</Column>
							<Column width={1}>{tag.forklaring}</Column>
							<Column width={3}>{tag.antall + "x spørsmål"}</Column>
							{/* <Button.Success
                          onClick={() => history.push('/tags/' + tag.tagid)}
                          >
                          Til Tag
                        </Button.Success> */}
						</Row>
					))}
				</Card>
				<AddTagCard onTagCreated={this.handleTagCreated} />
			</>
		);
	}

	mounted() {
		tagService.getAll().then((tags: Tag[]) => {
			this.tags = tags;

			this.tags.forEach((tag) => {
				sporsmalTagService
					.getSporsmalForTags(tag.tagid)
					.then((sporsmal: Sporsmal[]) => {
						tag.antall = sporsmal.length;
						this.tags = this.tags;
					});
			});
		});
	}
}

export default TagsList;
