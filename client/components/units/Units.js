import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Button } from "reactstrap";
import UnitItemModalNew from './UnitItemModalNew';
import UnitDataListView from './UnitDataListView';

class Units extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="mb-2">
                            <h1>Units List</h1>
                            <div className="text-zero top-right-button-container">
                                <Button className="top-right-button btn btn-primary btn-lg" onClick={this.toggle}>
                                    New Unit
                                </Button>
                            </div>
                        </div>
                    </Colxx>
                </Row>
                <UnitDataListView />
                <UnitItemModalNew toggle={this.toggle} is_modalopen={this.state.modal}></UnitItemModalNew>
            </Fragment>
        );
    }
}

export default Units;