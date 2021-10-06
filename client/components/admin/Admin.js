import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Button } from "reactstrap";
import { user_status } from '../../constants/defaultValues';
import UserModalNew from './UserModalNew';
import UserDataListView from './UserDataListView';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTypeOption: 2,
            selectedStatusOption: 1,
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
                            <h1>User List</h1>
                            <div className="text-zero top-right-button-container">
                                <Button className="top-right-button btn btn-primary btn-lg" onClick={this.toggle}>New User</Button>
                            </div>
                        </div>
                    </Colxx>
                </Row>
                <UserDataListView />
                <UserModalNew toggle={this.toggle} is_modalopen={this.state.modal}></UserModalNew>
            </Fragment>
        );
    }
}

export default Admin;