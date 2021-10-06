import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import {
    Button
} from "reactstrap";
import { proposal_status } from '../../constants/defaultValues';

class ProposalDataListItemCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            proposal_status: proposal_status,
            proposalItemData: null,
            data_id: -1
        };
    }

    componentDidMount() {
        this.setState({
            proposalItemData: this.props.proposalItemData,
            data_id: this.props.proposalItemData.id
        });
    }

    deleteItem(id) {
        if (confirm('Do you really remove this item ?')) {
            this.props.deleteItem(id);
        }
    }

    proposal_status_render(status) {
        let index = -1;
        for (let i = 0; i < this.state.proposal_status.length; i++) {
            if (this.state.proposal_status[i].value == status) {
                index = i;
            }
        }
        let badge_theme_class = ''
        if (index >= 0) {
            badge_theme_class = "badge " + this.state.proposal_status[index].theme_option + " badge-pill"
        }
        // return (index >= 0) ? (<span className={badge_theme_class}>{this.state.proposal_status[index].label}</span>) : "";
        return (index >= 0) ? (this.state.proposal_status[index].label) : "";
    }

    render() {
        let proposalItemData = this.props.proposalItemData;
        const parseTimestamp = Date.parse(this.props.proposalItemData.proposal_updated_at);
        const timestamp = new Date(parseTimestamp);
        let month = parseInt(timestamp.getMonth()) + 1;
        let datetime = month + '/' + timestamp.getDate() + '/' + timestamp.getFullYear();
        let component_key = proposalItemData.proposal_id.toString();
        const viewpageURL = "/app/proposal/view/" + proposalItemData.proposal_id;
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
                                    <div className="w-25 w-sm-100">
                                        <p className="list-item-heading mb-1 truncate">{proposalItemData.company_name}</p>
                                    </div>
                                    <div className="w-15 w-sm-100">
                                        <p className="list-item-heading mb-1 truncate">{proposalItemData.first_name} {proposalItemData.last_name}</p>
                                    </div>
                                    <p className="mb-1 text-muted text-small w-15 w-sm-100">{datetime}</p>
                                    <div className="w-15 w-sm-100">{this.proposal_status_render(proposalItemData.proposal_status)}</div>
                                </NavLink>
                                <div className="text-center">
                                    {proposalItemData.proposal_status === 1 ? (
                                        <Button className="btn btn-danger btn-sm" onClick={this.deleteItem.bind(this, this.props.proposalItemData.proposal_id)}><div className="glyph-icon simple-icon-trash"></div></Button>
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

export default ProposalDataListItemCard;