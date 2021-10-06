import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import {
    Button
} from "reactstrap";
import { lease_status } from '../../constants/defaultValues';

class LeaseDataListItemCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lease_status: lease_status,
            leaseItemData: null,
            data_id: -1
        };
    }

    componentDidMount() {
        this.setState({
            leaseItemData: this.props.leaseItemData,
            data_id: this.props.leaseItemData.id
        });
    }

    deleteItem(id) {
        if (confirm('Do you really remove this item ?')) {
            this.props.deleteItem(id);
        }
    }

    lease_status_render(status) {
        let index = -1;
        for (let i = 0; i < this.state.lease_status.length; i++) {
            if (this.state.lease_status[i].value == status) {
                index = i;
            }
        }
        let badge_theme_class = ''
        if (index >= 0) {
            badge_theme_class = "badge " + this.state.lease_status[index].theme_option + " badge-pill"
        }
        // return (index >= 0) ? (<span className={badge_theme_class}>{this.state.lease_status[index].label}</span>) : "";
        return (index >= 0) ? (this.state.lease_status[index].label) : "";
    }

    render() {
        let leaseItemData = this.props.leaseItemData;
        const parseTimestamp = Date.parse(this.props.leaseItemData.lease_updated_at);
        const timestamp = new Date(parseTimestamp);
        let month = parseInt(timestamp.getMonth()) + 1;
        let datetime = month + '/' + timestamp.getDate() + '/' + timestamp.getFullYear();
        let component_key = leaseItemData.lease_id.toString();
        const viewpageURL = "/app/lease/view/" + leaseItemData.lease_id;
        return (
            <Row key={component_key}>
                <Colxx xxs="12">
                    <div className="d-flex flex-row card mb-3">
                        <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                            <div className="card-body flex-column flex-lg-row justify-content-between min-width-zero align-self-center d-flex align-items-lg-center">
                                <NavLink
                                    to={viewpageURL}
                                    className="card-body flex-column flex-lg-row justify-content-between min-width-zero align-self-center d-flex align-items-lg-center py-0"
                                >
                                    <div className="w-40 w-sm-100">
                                        <p className="list-item-heading mb-1 truncate">{leaseItemData.company_name}</p>
                                    </div>
                                    <p className="mb-1 text-muted text-small w-15 w-sm-100">{datetime}</p>
                                    <div className="w-15 w-sm-100">{this.lease_status_render(leaseItemData.lease_status)}</div>
                                </NavLink>
                                <div className="text-center">
                                    {leaseItemData.lease_status === 1 ? (
                                        <Button className="btn btn-danger btn-sm" onClick={this.deleteItem.bind(this, this.props.leaseItemData.lease_id)}><div className="glyph-icon simple-icon-trash"></div></Button>
                                    ) : (
                                            <Button className="btn btn-danger btn-sm invisible"><div className="glyph-icon simple-icon-trash"></div></Button>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Colxx>
            </Row>
        );
    }
}

export default LeaseDataListItemCard;