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
	reply: string = "";
	favoriteList: number[] = [];

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
												SporsmalDetails.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
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
										SporsmalDetails.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
										this.svartekst = "";
									});
							}}
						>
							Create Answer
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
									<Column>
										{svar.dato.toString().replace("T", " ").substring(0, 19)}
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
																Number(this.sporsmal.sporsmalid),
																0,
																true,
																svar.svarid
															)
															.then(() => {
																// Reloads the Spørsmal
																SporsmalDetails.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
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
														Number(this.sporsmal.sporsmalid),
														0,
														true,
														svar.svarid
													)
													.then(() => {
														// Reloads the Spørsmal
														SporsmalDetails.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
														this.svartekst = "";
													});
											}}
										>
											Reply
										</Button.Success>
										<Button.Light
											onClick={() => {
												this.favoriteList.includes(svar.svarid!)
													? favorittService.delete(svar.svarid!).then(() => {
															Alert.success("Favoritt fjernet");
													  })
													: favorittService.create(svar.svarid!).then(() => {
															Alert.success("Favoritt lagt til");
													  });
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
								</Card>
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
			.then(() => {
				//Increase points when user enters the page to increase popularity
				const UpdatedQuestion = {
					...this.sporsmal,
					poeng: this.sporsmal.poeng + 1,
				};
				//sporsmalService.update(UpdatedQuestion).then(() => {});
			})
			.catch((error) =>
				Alert.danger("Finner ikke spørsmålet: " + error.message)
			);
		sporsmalTagService
			.getTagForSporsmal(this.props.match.params.sporsmalid)
			.then((tags) => (this.tags = tags));

		svarService
			.getAll(this.props.match.params.sporsmalid)
			.then((svarer) => (this.svarer = svarer));

		favorittService
			.getAll()
			.then(
				(favoriteList) =>
					(this.favoriteList = favoriteList.map((x) => x.svarid!))
			);
	}
}

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
		console.log(this.chosenTags);
		sporsmalService
			.create(
				this.tittel,
				this.innhold,
				this.chosenTags.map((tag) => tag.tagid), //Send tagids with the sporsmal
				0
			)
			.then(() => {
				// Reloads the Spørsmal
				SporsmalList.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
				this.tittel = "";
				this.innhold = "";
			});
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
											<>
												<Row key={tag.tagid}>
													<Column width={5}>{tag.navn}</Column>
												</Row>
											</>
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
								Create Question
							</Button.Success>
						</Column>
					</Column>
				</Card>
				<Card title="Missing a tag?">
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
								TagService.createTag(
									this.newTag.navn,
									this.newTag.forklaring
								).then(() => {
									// Reloads the Spørsmal
									SporsmalNew.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
									this.newTag.navn = "";
									this.newTag.forklaring = "";
								});
							}}
						>
							Create Tag
						</Button.Success>
					</Column>
				</Card>
			</>
		);
	}

	mounted() {
		TagService.getAll().then((tags: Tag[]) => (this.tags = tags));
	}
}

class FavorittList extends Component {
	favoritter: Svar[] = [];

	render() {
		return (
			<Card title="Favoritter">
				<Row>
					<Column width={5}>Svar</Column>
					<Column width={1}>SvarID</Column>
					<Column width={1}>Poeng</Column>
				</Row>
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
	newTag: Tag = { tagid: 0, navn: "", forklaring: "", antall: 0 };

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
				<Card title="Missing a tag?">
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
								TagService.createTag(
									this.newTag.navn,
									this.newTag.forklaring
								).then(() => {
									// Reloads the Spørsmal
									TagsList.instance()?.mounted(); // .? meaning: call SporsmalList.instance().mounted() if SporsmalList.instance() does not return null
									this.newTag.navn = "";
									this.newTag.forklaring = "";
								});
							}}
						>
							Create
						</Button.Success>
					</Column>
				</Card>
			</>
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
