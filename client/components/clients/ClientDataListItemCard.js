import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import {
    Button
} from "reactstrap";

class ClientDataListItemCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientItemData: null,
            data_id: -1
        };
    }

    componentDidMount() {
        this.setState({
            clientItemData: this.props.clientItemData,
            data_id: this.props.clientItemData.id
        });
    }

    deleteItem(id) {
        if (confirm('Do you really remove this item ?')) {
            this.props.deleteItem(id);
        }
    }

    render() {
        let clientItemData = this.props.clientItemData;
        const parseTimestamp = Date.parse(this.props.clientItemData.created_at);
        const timestamp = new Date(parseTimestamp);
        let month = parseInt(timestamp.getMonth()) + 1;
        let datetime = month + '/' + timestamp.getDate() + '/' + timestamp.getFullYear();
        let component_key = clientItemData.id.toString();
        const viewpageURL = "/app/client/view/" + clientItemData.id;
        let visible_style = {
            visibility: 'hidden'
        }
        return (
            <Row key={component_key}>
                <Colxx xxs="12">
                    <div className="d-flex flex-row card mb-3">
                        <div className="d-flex flex-grow-1 min-width-zero">
                            <div className="card-body flex-column flex-lg-row justify-content-between min-width-zero align-self-center d-flex align-items-lg-center">
                                <NavLink
                                    to={viewpageURL}
                                    className="card-body flex-column flex-lg-row justify-content-between min-width-zero align-self-center d-flex align-items-lg-center py-0"
                                >
                                    <div className="w-25 w-sm-100">
                                        <p className="list-item-heading mb-1 truncate">
                                            {clientItemData.company_name}
                                        </p>
                                    </div>
                                    <p className="mb-1 text-muted text-small w-15 w-sm-100">
                                        {datetime}
                                    </p>
                                    <div className="w-15 w-sm-100">
                                        {clientItemData.client_status == 1 ? (
                                            // <span className="badge badge-primary badge-pill">
                                            //     Client
                                            // </span>
                                            "Client"
                                        ) : (
                                            // <span className="badge badge-secondary badge-pill">
                                            //         Prospect
                                            // </span>
                                            "Prospect"
                                            )}
                                    </div>
                                    <div className="w-15 w-sm-100">
                                        {clientItemData.is_active ? ("Active") : ("Inactive")}
                                    </div>
                                </NavLink>
                                <div className="text-center">
                                    {this.props.clientItemData.client_count_in_proposal < 1 ? (
                                        <Button className="btn btn-danger btn-sm" onClick={this.deleteItem.bind(this, this.props.clientItemData.id)}><div className="glyph-icon simple-icon-trash"></div></Button>
                                    ) : (<Button className="btn btn-danger btn-sm" style={visible_style}><div className="glyph-icon simple-icon-trash"></div></Button>)}
                                    {/* <Button className="btn btn-danger btn-sm" onClick={this.deleteItem.bind(this, this.props.clientItemData.id)}><div className="glyph-icon simple-icon-trash"></div></Button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Colxx>
            </Row>
        );
    }
}

export default ClientDataListItemCard;