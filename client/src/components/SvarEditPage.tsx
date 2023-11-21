import * as React from "react";
import { Component } from "react-simplified";
import { Card, Row, Column, Form, Button, Alert } from "../widgets";
import svarService, { Svar } from "../services/svar-service";
import { createHashHistory } from "history";

const history = createHashHistory();

class SvarEdit extends Component<{
    match: { params: { sporsmalid: number, svarid: number} };
}> {
    svar: Svar = {
        svarid: 0,
        svartekst: "",
        sporsmalid: 0,
        poeng: 0,
        dato: new Date(),
        sistendret: new Date(),
        ersvar: false
    };

    componentDidMount() {
        svarService.get(this.props.match.params.sporsmalid, this.props.match.params.svarid!).then((svar: Svar) => {
            this.svar = svar;
        });
    }

    handleUpdate = async () => {
        const updatedSvar: Svar = {
            ...this.svar
        };
    
        // Assuming you have sporsmalid available in your component's state or props
        const sporsmalid = this.svar.sporsmalid; // or this.props.sporsmalid, based on your component's structure
    
        try {
            await svarService.update(updatedSvar, sporsmalid);
            Alert.success("Svar endret");
            history.push("/sporsmal/" + sporsmalid);
        } catch (error) {
            console.error("Update error:", error);
            Alert.danger("En feil oppstod: " + error);
        }
    };
    
    
    
    render() {
        return (
            <Card title="Rediger Svar">
                <Form.Input type="text"
                    label="Svar Tekst"
                    value={this.svar.svartekst}
                    onChange={(e) => (this.svar.svartekst = e.target.value)}
                    placeholder={this.svar.svartekst}
                />
                {/* Add other input fields if necessary */}
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

export default SvarEdit;
