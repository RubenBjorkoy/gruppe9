import * as React from "react";
import { createRoot } from "react-dom/client";
import { Component } from "react-simplified";
import { Alert, Card, Row, Column, Form, Button, NavBar } from "./widgets";
import sporsmalService, { Sporsmal } from "./sporsmal-service";
import sporsmalTagService from "./sporsmalTag-service";
import TagService, { Tag } from "./tag-service";
import favorittService, { Favoritt } from "./favoritt-service";
import { Link, NavLink } from "react-router-dom";
import { HashRouter, Route } from "react-router-dom";
import { createHashHistory } from "history";
import svarService, { Svar } from "./svar-service";

const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Navigation extends Component {
	render() {
		return (
			<>
				<NavBar brand="Forum">
					<NavBar.Link to="/">Spørsmål</NavBar.Link>
					<NavBar.Link to="/nyspor">Nytt Spørsmål</NavBar.Link>
					<NavBar.Link to="/favs">Favoritter</NavBar.Link>
					<NavBar.Link to="/tags">Tags</NavBar.Link>
				</NavBar>
			</>
		);
	}
}

class SporsmalList extends Component {
	sporsmaler: Sporsmal[] = [];

	render() {
		return (
			<Card title="Spørsmål">
				{this.sporsmaler.map((sporsmal) => (
					<Row key={sporsmal.sporsmalid}>
						<Column width={1}>{sporsmal.sporsmalid}</Column>
						<Column width={1}>{sporsmal.tittel}</Column>
						<Column width={1}>{sporsmal.innhold}</Column>
						<Column width={1}>{sporsmal.poeng}</Column>
						<Column width={2}>
							{sporsmal.dato?.toString().replace("T", " ").substring(0, 19)}
						</Column>
						<Column width={2}>
							{sporsmal.sistendret
								?.toString()
								.replace("T", " ")
								.substring(0, 19)}
						</Column>
						<Column width={1}>
							<Button.Success
								onClick={() => history.push("/sporsmal/" + sporsmal.sporsmalid)}
							>
								Til Spørsmål
							</Button.Success>
						</Column>
					</Row>
				))}
			</Card>
		);
	}

	mounted() {
		sporsmalService
			.getAll()
			.then((sporsmaler) => (this.sporsmaler = sporsmaler));
	}
}

class SporsmalDetails extends Component<{
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
	svarer: Svar[] = [];
	tags: Tag[] = [{ tagid: 0, navn: "", forklaring: "", antall: 0 }];
	svartekst = "";

	render() {
		return (
			<>
				<Card title="Spørsmål">
					<Row>
						<Column width={2}>Tittel:</Column>
						<Column>{this.sporsmal.tittel}</Column>
					</Row>
					<Row>
						<Column width={2}>Spørsmål:</Column>
						<Column>{this.sporsmal.innhold}</Column>
					</Row>
					<Row>
						<Column width={2}>Poeng:</Column>
						<Column>{this.sporsmal.poeng}</Column>
					</Row>
					<Row>
						<Column width={2}>Dato:</Column>
						<Column>
							{this.sporsmal.dato.toString().replace("T", " ").substring(0, 19)}
						</Column>
					</Row>
					<Row>
						<Column width={2}>Sist Endret:</Column>
						<Column>
							{this.sporsmal.sistendret
								.toString()
								.replace("T", " ")
								.substring(0, 19)}
						</Column>
					</Row>
					<Row>
						<Column width={2}>Godkjent Svar:</Column>
						<Column>
							{/* <Form.Checkbox checked={this.sporsmal.ersvart} onChange={() => {}} /> */}
						</Column>
					</Row>
					<Row>
						<Column width={2}>Tagger:</Column>
						<Column>
							{this.tags.map((tag) => {
								return (
									<>
										<Row key={tag.tagid}>
											<Column width={5}>{tag.navn}</Column>
										</Row>
									</>
								);
							})}
						</Column>
					</Row>
				</Card>
				<Button.Success
					onClick={() =>
						history.push(
							"/sporsmal/" + this.props.match.params.sporsmalid + "/rediger"
						)
					}
				>
					Rediger
				</Button.Success>

				<Card title="Nytt Svar">
					<Row>
						<Column width={10}>
							<Form.Input
								type="text"
								value={this.svartekst}
								style={{ width: "80vw" }}
								onChange={(event) => {
									this.svartekst = event.currentTarget.value;
								}}
								onKeyDown={(event: any) => {
									//submits on enter key
									if (event.keyCode === 13 && !event.shiftKey) {
										svarService
											.create(
												this.svartekst,
												Number(this.sporsmal.sporsmalid),
												0,
												false
											)
											.then(() => {
												// Reloads the Spørsmal
												SporsmalList.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
												this.svartekst = "";
											});
									}
								}}
							/>
						</Column>
					</Row>
					<Column width={1}>
						<Button.Success
							onClick={() => {
								svarService
									.create(
										this.svartekst,
										Number(this.sporsmal.sporsmalid),
										0,
										false
									)
									.then(() => {
										// Reloads the Spørsmal
										SporsmalList.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
										this.svartekst = "";
									});
							}}
						>
							Create
						</Button.Success>
					</Column>
				</Card>
				<Card title="Svarene">
					{this.svarer.map((svar) => {
						return (
							<Card title={"SvarID " + svar.svarid} key={svar.svarid}>
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
									{/* <Column>{this.svar.dato.toLocaleString()}</Column> */}
								</Row>
								<Row>
									<Column width={2}>Sist Endret:</Column>
									{/* <Column>{this.svar.sistendret.toLocaleString()}</Column> */}
								</Row>
							</Card>
						);
					})}
				</Card>
			</>
		);
	}

	mounted() {
		sporsmalService
			.get(this.props.match.params.sporsmalid)
			.then((sporsmal: Sporsmal) => (this.sporsmal = sporsmal))
			.catch((error) =>
				Alert.danger("Finner ikke spørsmålet: " + error.message)
			);
		//svarservice
		//getAll
		sporsmalTagService
			.getTagForSporsmal(this.props.match.params.sporsmalid)
			.then((tags) => (this.tags = tags));

		svarService
			.getAll(this.props.match.params.sporsmalid)
			.then((svarer) => (this.svarer = svarer));
	}
}

class SporsmalNew extends Component {
	tittel = "";
	innhold = "";
	poeng = 0;
	// dato = Date();
	// sistendret = Date();

	render() {
		return (
			<Card title="Nytt Spørsmål">
				<Row>
					<Column width={1}>
						<Form.Label>Spørsmål Tittel:</Form.Label>
					</Column>
					<Column width={4}>
						<Form.Input
							type="text"
							value={this.tittel}
							onChange={(event) => (this.tittel = event.currentTarget.value)}
						/>
					</Column>
				</Row>
				<Row>
					<Column width={1}>
						<Form.Label>Spørsmål:</Form.Label>
					</Column>
					<Column width={4}>
						<Form.Input
							type="text"
							value={this.innhold}
							onChange={(event) => (this.innhold = event.currentTarget.value)}
						/>
					</Column>
				</Row>
				<Column width={1}>
					<Button.Success
						onClick={() => {
							this.poeng = 0;
							sporsmalService
								.create(this.tittel, this.innhold, this.poeng)
								.then(() => {
									// Reloads the Spørsmal
									SporsmalList.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
									this.tittel = "";
									this.innhold = "";
								});
						}}
					>
						Create
					</Button.Success>
				</Column>
			</Card>
		);
	}
}

class FavorittList extends Component {
	favoritter: Svar[] = [];

	render() {
		return (
			<Card title="Favoritter">
				{this.favoritter.map((favoritt) => (
					<Row key={favoritt.svarid}>
						<Column width={5}>{favoritt.svartekst}</Column>
						<Column width={1}>{favoritt.svarid}</Column>
						<Column width={1}>{favoritt.poeng}</Column>
						{/* <Column width={1}>{favoritt.sistendret}</Column> */}
					</Row>
				))}
			</Card>
		);
	}

	mounted() {
		favorittService
			.getAll()
			.then((favoritter: Svar[]) => (this.favoritter = favoritter));
	}
}

class TagsList extends Component {
	tags: Tag[] = [];
	sporsmal: Sporsmal[] = [];

	render() {
		return (
			<Card title="Tags">
				{this.tags.map((tag) => (
					<Row key={tag.tagid}>
						<Column width={1}>{tag.tagid}</Column>
						<Column width={1}>{tag.navn}</Column>
						<Column width={1}>{tag.forklaring}</Column>
						<Column width={1}>{tag.antall}</Column>
						{/* <Button.Success
                          onClick={() => history.push('/tags/' + tag.tagid)}
                          >
                          Til Tag
                        </Button.Success> */}
					</Row>
				))}
			</Card>
		);
	}

	mounted() {
		TagService.getAll().then((tags: Tag[]) => {
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

let root = document.getElementById("root");
if (root)
	createRoot(root).render(
		<HashRouter>
			<div>
				<Navigation />
				<Route exact path="/" component={SporsmalList} />
				<Route path={"/sporsmal/:sporsmalid"} component={SporsmalDetails} />
				<Route exact path="/nyspor" component={SporsmalNew} />
				<Route exact path="/favs" component={FavorittList} />
				<Route exact path="/tags" component={TagsList} />
			</div>
		</HashRouter>
	);
