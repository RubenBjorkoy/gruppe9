import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, Alert } from "../widgets";
import tagService from "../services/tag-service";


interface NewTag {
	navn: string;
	forklaring: string;
}

class AddTagCard extends Component<{ onTagCreated: () => void }> {
	newTag: NewTag = {
		navn: "",
		forklaring: "",
	};

	handleTagCreation = () => {
		if (this.newTag.navn == "") {
			return Alert.danger("Tag name cannot be empty");
		}
		tagService.createTag(this.newTag.navn, this.newTag.forklaring).then(() => {
	
			this.props.onTagCreated();
			this.newTag.navn = "";
			this.newTag.forklaring = "";
		});
	};

	render() {
		return (
			<Card title="Savner en tag?">
				<Row>
					<Column width={2}>
						<Form.Label>Tag Navn:</Form.Label>
					</Column>
					<Column width={4}>
						<Form.Input
							type="text"
							style={{ width: "20vw" }}
							value={this.newTag.navn}
							onChange={(event) =>
								(this.newTag.navn = event.currentTarget.value)
							}
						/>
					</Column>
				</Row>
				<Row>
					<Column width={2}>
						<Form.Label>Tag Forklaring:</Form.Label>
					</Column>
					<Column width={5}>
						<Form.Textarea
							type="text"
							style={{ width: "40vw" }}
							value={this.newTag.forklaring}
							onChange={(event) =>
								(this.newTag.forklaring = event.currentTarget.value)
							}
						/>
					</Column>
				</Row>
				<Column width={1}>
					<Button.Success
						onClick={() => {
							this.handleTagCreation();
						}}
					>
						Lag Tag
					</Button.Success>
				</Column>
			</Card>
		);
	}
}

export default AddTagCard;
