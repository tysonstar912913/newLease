import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import {
    Button
} from "reactstrap";

class UnitDataListItemCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unitItemData: null,
            data_id: -1
        };
    }

    componentDidMount() {
        this.setState({
            unitItemData: this.props.unitItemData,
            data_id: this.props.unitItemData.id
        });
    }

    renderStatusField(status) {
        // if (status === 1) {
        //     return (
        //         <span className="badge badge-primary badge-pill">
        //             Available
        //         </span>);
        // }
        // else if (status === 2) {
        //     return (
        //         <span className="badge badge-light badge-pill">
        //             Not Available
        //         </span>);
        // }
        // else if (status === 3) {
        //     return (
        //         <span className="badge badge-secondary badge-pill">
        //             Pending Proposal
        //         </span>);
        // }
        // else if (status === 4) {
        //     return (
        //         <span className="badge badge-warning badge-pill">
        //             Pending Lease
        //         </span>);
        // }
        // else if (status === 5) {
        //     return (
        //         <span className="badge badge-success badge-pill">
        //             Leased
        //         </span>);
        // }
        switch (status) {
            case 1:
                return ("Available");
            case 2:
                return ("Not Available");
            case 3:
                return ("Pending Proposal");
            case 4:
                return ("Pending Lease");
            case 5:
                return ("Leased");
            default:
                return ("Available");
        }
    }

    renderTypeField(unit_type) {
        // switch (unit_type) {
        //     case 1:
        //         return (<span className="badge badge-primary badge-pill">Office</span>);
        //     case 2:
        //         return (<span className="badge badge-light badge-pill">Residental</span>);
        //     case 3:
        //         return (<span className="badge badge-success badge-pill">Retail</span>);
        //     default:
        //         return (<span className="badge badge-primary badge-pill">Office</span>);
        // }
        switch (unit_type) {
            case 1:
                return ("Office");
            case 2:
                return ("Residental");
            case 3:
                return ("Retail");
            default:
                return ("Office");
        }
    }

    deleteItem(id) {
        if (confirm('Do you really remove this item ?')) {
            this.props.deleteItem(id);
        }
    }

    render() {
        let unitItemData = this.props.unitItemData;
        let component_key = unitItemData.id.toString();
        const viewpageURL = "/app/unit/view/" + unitItemData.id;
        let visible_style = {
            visibility: 'hidden'
        }
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
                                        <p className="list-item-heading mb-1 truncate">
                                            {unitItemData.unit_name}
                                        </p>
                                    </div>
                                    <div className="mb-1 text-muted text-small w-15 w-sm-100">
                                        <div className="pr-4">Building: {unitItemData.building}</div>
                                        <div className="pr-4">Floor: {unitItemData.floor}</div>
                                        <div className="pr-4">Area: {unitItemData.unit_area}</div>
                                    </div>
                                    <div className="w-15 w-sm-100">
                                        {this.renderTypeField(unitItemData.unit_type)}
                                    </div>
                                    <div className="w-15 w-sm-100">
                                        {this.renderStatusField(unitItemData.unit_status)}
                                    </div>
                                </NavLink>
                                <div className="text-center">
                                    {this.props.unitItemData.units_count_in_proposal < 1 ? (
                                        <Button className="btn btn-danger btn-sm" onClick={this.deleteItem.bind(this, this.props.unitItemData.id)}><div className="glyph-icon simple-icon-trash"></div></Button>
                                    ) : (<Button className="btn btn-danger btn-sm" style={visible_style}><div className="glyph-icon simple-icon-trash"></div></Button>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </Colxx>
            </Row>
        );
    }
}

export default UnitDataListItemCard;