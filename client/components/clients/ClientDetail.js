import React, { Component, Fragment } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Button } from "reactstrap";
import * as crudAction from '../../actions/crudAction';
import { client_type, client_status } from '../../constants/defaultValues';
import ClientItemModal from './ClientItemModal';
import { CLIENTVIEW, LOGLIST } from '../../constants/entity';
import LogContent from "../../components/common/LogContent";

class ClientDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            client_type: client_type,
            client_status: client_status,
            modal: false,
            clientItemData: null,
            isLoading: false
        };
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        const reqUrl = 'clients/getitem';
        this.setState({ id: this.props.match.params.id });
        this.props.actions.fetchById(CLIENTVIEW, reqUrl, this.props.match.params.id);
        this.getLogList(this.props.match.params.id);
    }

    getLogList(data_id) {
        const reqUrl = 'logs/getloglist';
        const criteria = {
            order_by_column: 'logs.created_at',
            order_by_dir: 'DESC',
            type: 1,
            data_id: data_id
        }
        this.props.actions.fetchAll(LOGLIST, reqUrl, criteria);
    }

    componentWillReceiveProps(newProps) {
        const { clientItemData } = newProps;
        if (clientItemData) {
            this.setState({ clientItemData: clientItemData.data })
            this.setState({ isLoading: true });
        }
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        let clientItemData = null;
        let datetime = "";
        let client_type_label = '';
        let client_status_label = '';
        if (this.state.clientItemData) {
            const parseTimestamp = Date.parse(this.state.clientItemData.created_at);
            const timestamp = new Date(parseTimestamp);
            let month = parseInt(timestamp.getMonth()) + 1;
            datetime = month + '/' + timestamp.getDate() + '/' + timestamp.getFullYear();

            for (let i = 0; i < this.state.client_type.length; i++) {
                if (this.state.client_type[i].value === this.state.clientItemData.client_type) {
                    client_type_label = this.state.client_type[i].label;
                }
            }
            for (let i = 0; i < this.state.client_status.length; i++) {
                if (this.state.client_status[i].value === this.state.clientItemData.client_status) {
                    client_status_label = this.state.client_status[i].label;
                }
            }
        }
        return !this.state.isLoading ? (
            <div className="loading" />
        ) : (
            <Fragment>
                {this.state.clientItemData !== null ? (
                    <Row>
                        <Colxx xxs="12">
                            <div className="mb-2">
                                <h1>{this.state.clientItemData.company_name}</h1>
                                <div className="text-zero top-right-button-container">
                                    <Button className="top-right-button btn btn-primary btn-lg" onClick={this.toggle}>Edit</Button>
                                </div>
                            </div>
                            <div className="separator mb-5" />
                            <Row>
                                <Colxx xxs="12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Client Details</h5>
                                            <p className="card-text"> <strong>Name</strong> {this.state.clientItemData.company_name} </p>
                                            <p className="card-text"> <strong>Arabic Name</strong> {this.state.clientItemData.company_name_ar} </p>
                                            <p className="card-text"> <strong>CR Number</strong> {this.state.clientItemData.cr_number}</p>
                                            <p className="card-text"> <strong>VAT RNO.</strong> {this.state.clientItemData.vat_rno}</p>
                                            <p className="card-text"> <strong>Join Date </strong> {datetime}</p>
                                            <p className="card-text"> <strong>Status</strong> {client_status_label}</p>
                                            <p className="card-text"> <strong>Address </strong> {this.state.clientItemData.address} </p>
                                            <p className="card-text"> <strong>Client Type</strong> {client_type_label} </p>
                                            <p className="card-text"> <strong>Contact Person Name </strong> {this.state.clientItemData.contact_person_name} </p>
                                            <p className="card-text"> <strong>Contact Person Position </strong> {this.state.clientItemData.contact_person_pos} </p>
                                            <p className="card-text"> <strong>Contact Person Phone </strong> {this.state.clientItemData.contact_person_phone} </p>
                                            <p className="card-text"> <strong>Active</strong> {this.state.clientItemData.is_active ? "Active" : "Inactive"}</p>
                                        </div>
                                    </div>
                                </Colxx>
                            </Row>
                            <LogContent loglist={(this.props.loglist && this.props.loglist.success && this.props.loglist.data) ? this.props.loglist.data : null}></LogContent>
                            <Row>
                                <Colxx xxs="12">
                                    <div className="text-zero top-right-button-container mt-5">
                                        <NavLink to={`/app/proposal/new/${this.state.clientItemData.id}`} className="bottom-right-button btn btn-primary btn-lg">Generate Proposal</NavLink>
                                    </div>
                                </Colxx>
                            </Row>
                            <ClientItemModal toggle={this.toggle} is_modalopen={this.state.modal} initialValues={this.state.clientItemData}></ClientItemModal>
                        </Colxx>
                    </Row>
                ) : ("")}
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        clientItemData: state.clientData.clientview,
        loglist: state.clientData.loglist,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientDetail);