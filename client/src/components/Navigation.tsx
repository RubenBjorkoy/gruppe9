import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, NavBar, Alert } from "../widgets";
import { createHashHistory } from "history";

const history = createHashHistory();

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

export default Navigation;
