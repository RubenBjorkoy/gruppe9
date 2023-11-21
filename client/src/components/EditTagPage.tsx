import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, Alert } from "../widgets";
import tagService, { Tag } from "../services/tag-service";
import { createHashHistory } from "history";

const history = createHashHistory();

class TagEdit extends Component<{
	match: { params: { tagid: number } };
}> {
	tag: Tag = {
		tagid: 0,
		navn: "",
		forklaring: "",
		antall: 0,
	};

	componentDidMount() {
		tagService.getTag(this.props.match.params.tagid).then((tag: Tag) => {
			this.tag = tag;
		});
	}

	handleUpdate = async () => {
		const updatedTag: Tag = {
			...this.tag,
		};

		try {
			await tagService.updateTag(updatedTag);
			Alert.success("Svar endret");
			history.push("/tags");
		} catch (error) {
			console.error("Update error:", error);
			Alert.danger("En feil oppstod: " + error);
		}
	};

	render() {
		return (
			<Card title="Rediger Tag">
				<Form.Input
					type="text"
					label="Tag navn"
					value={this.tag.navn}
					onChange={(e) => (this.tag.navn = e.target.value)}
					placeholder={this.tag.navn}
				/>
				<Form.Input
					type="text"
					label="Tag forklaring"
					value={this.tag.forklaring}
					onChange={(e) => (this.tag.forklaring = e.target.value)}
					placeholder={this.tag.forklaring}
				/>
				<Row>
					<Column>
						<Button.Success onClick={this.handleUpdate}>
							Oppdater
						</Button.Success>
					</Column>
				</Row>
			</Card>
		);
	}
}

export default TagEdit;
