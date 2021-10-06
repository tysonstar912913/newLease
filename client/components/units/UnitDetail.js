import React, { Component, Fragment } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Button } from "reactstrap";
import { UNITVIEW, LOGLIST } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { unit_type, unit_status } from '../../constants/defaultValues';
import UnitItemModal from './UnitItemModal';
import LogContent from "../../components/common/LogContent";

class UnitDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            unit_type: unit_type,
            unit_status: unit_status,
            modal: false,
            unitItemData: null,
            isLoading: false
        };
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        const reqUrl = 'units/getitem';
        this.setState({ id: this.props.match.params.id });
        this.props.actions.fetchById(UNITVIEW, reqUrl, this.props.match.params.id);
        this.getLogList(this.props.match.params.id);
    }

    getLogList(data_id) {
        const reqUrl = 'logs/getloglist';
        const criteria = {
            order_by_column: 'logs.created_at',
            order_by_dir: 'DESC',
            type: 2,
            data_id: data_id
        }
        this.props.actions.fetchAll(LOGLIST, reqUrl, criteria);
    }

    componentWillReceiveProps(newProps) {
        const { unitItemData } = newProps;
        if (unitItemData) {
            this.setState({ unitItemData: unitItemData })
            this.setState({ isLoading: true });
        }
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    renderNumberOfCardText(field, value) {
        if (value > 0) {
            return (
                <p className="card-text"> <strong>{field} : </strong> {value}</p>
            )
        }
        else {
            return "";
        }
    }

    render() {
        let unit_type_label = '';
        let unit_status_label = '';
        if (this.state.unitItemData) {
            for (let i = 0; i < this.state.unit_type.length; i++) {
                if (this.state.unit_type[i].value == this.state.unitItemData.data.unit_type) {
                    unit_type_label = this.state.unit_type[i].label;
                }
            }
            for (let i = 0; i < this.state.unit_status.length; i++) {
                if (this.state.unit_status[i].value == this.state.unitItemData.data.unit_status) {
                    unit_status_label = this.state.unit_status[i].label;
                }
            }
        }
        return !this.state.isLoading ? (
            <div className="loading" />
        ) : (
            <Fragment>
                {this.state.unitItemData && this.state.unitItemData.data !== null ? (
                    <Row>
                        <Colxx xxs="12">
                            <div className="mb-2">
                                <h1>{this.state.unitItemData.data.unit_name}</h1>
                                <div className="text-zero top-right-button-container">
                                    <Button className="top-right-button btn btn-primary btn-lg" onClick={this.toggle}>Edit</Button>
                                </div>
                            </div>
                            <div className="separator mb-5" />
                            <Row>
                                <Colxx xxs="12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Unit Details</h5>
                                            <p className="card-text"> <strong>Name</strong> {this.state.unitItemData.data.unit_name} </p>
                                            <p className="card-text"> <strong>Area</strong> {this.state.unitItemData.data.unit_area} </p>
                                            <p className="card-text"> <strong>Building</strong> {this.state.unitItemData.data.building}</p>
                                            <p className="card-text"> <strong>Floor</strong> {this.state.unitItemData.data.floor}</p>
                                            <p className="card-text"> <strong>Type</strong> {unit_type_label}</p>
                                            <p className="card-text"> <strong>Status</strong> {unit_status_label}</p>
                                            {this.state.unitItemData.data.unit_type == 2 ? (
                                                <div>
                                                    {this.renderNumberOfCardText('Number of Bedrooms', this.state.unitItemData.data.number_of_bedrooms)}
                                                    {this.renderNumberOfCardText('Number of Bathrooms', this.state.unitItemData.data.number_of_bathrooms)}
                                                    {this.renderNumberOfCardText('Number of Livingrooms', this.state.unitItemData.data.number_of_livingrooms)}
                                                    {this.renderNumberOfCardText('Number of Diningrooms', this.state.unitItemData.data.number_of_diningrooms)}
                                                    {this.renderNumberOfCardText('Number of Kitchens', this.state.unitItemData.data.number_of_kitchens)}
                                                    {this.renderNumberOfCardText('Number of Laundry', this.state.unitItemData.data.number_of_laundry)}
                                                    {this.renderNumberOfCardText('Number of Maidrooms', this.state.unitItemData.data.number_of_maidrooms)}
                                                    {this.renderNumberOfCardText('Number of Duplex', this.state.unitItemData.data.number_of_duplex)}
                                                    {this.renderNumberOfCardText('Number of Atrium', this.state.unitItemData.data.number_of_atrium)}
                                                    {this.renderNumberOfCardText('Number of Terraces', this.state.unitItemData.data.number_of_terraces)}
                                                    {this.renderNumberOfCardText('Number of Pools', this.state.unitItemData.data.number_of_pools)}
                                                    {this.renderNumberOfCardText('Number of Lobbies', this.state.unitItemData.data.number_of_lobbies)}
                                                </div>
                                            ) : ("")}
                                        </div>
                                    </div>
                                </Colxx>
                            </Row>
                            <LogContent loglist={(this.props.loglist && this.props.loglist.success && this.props.loglist.data) ? this.props.loglist.data : null}></LogContent>

                            <UnitItemModal toggle={this.toggle} is_modalopen={this.state.modal} data_id={this.props.match.params.id} initialValues={this.state.unitItemData.data}></UnitItemModal>
                        </Colxx>
                    </Row>
                ) : ("")}
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        unitItemData: state.clientData.unititem,
        loglist: state.clientData.loglist,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UnitDetail);