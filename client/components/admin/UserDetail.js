import React, { Component, Fragment } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Button } from "reactstrap";
import { USERVIEW } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { user_status } from '../../constants/defaultValues';
import UserItemModal from './UserItemModal';

class UserDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            user_status: user_status,
            modal: false,
            userItemData: null,
            isLoading: false
        };
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        const reqUrl = 'admin/getitem';
        this.setState({ id: this.props.match.params.id });
        this.props.actions.fetchById(USERVIEW, reqUrl, this.props.match.params.id);
    }

    componentWillReceiveProps(newProps) {
        const { userItemData } = newProps;
        this.setState({ userItemData: userItemData })
        if (userItemData && userItemData.data) {
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
        let user_status_label = '';
        if (this.state.userItemData) {
            for (let i = 0; i < this.state.user_status.length; i++) {
                if (this.state.user_status[i].value == this.state.userItemData.data.status) {
                    user_status_label = this.state.user_status[i].label;
                }
            }
        }
        return !this.state.isLoading ? (
            <div className="loading" />
        ) : (
            <Fragment>
                {this.state.userItemData && this.state.userItemData.data !== null ? (
                    <Row>
                        <Colxx xxs="12">
                            <div className="mb-2">
                                <h1>User Details</h1>
                                <div className="text-zero top-right-button-container">
                                    <Button className="top-right-button btn btn-primary btn-lg" onClick={this.toggle}>Edit</Button>
                                </div>
                            </div>
                            <div className="separator mb-5" />
                            <Row>
                                <Colxx xxs="12">
                                    <div className="card">
                                        <div className="card-body">
                                            <p className="card-text"> <strong>First Name : </strong> {this.state.userItemData.data.first_name} </p>
                                            <p className="card-text"> <strong>Last Name : </strong> {this.state.userItemData.data.last_name} </p>
                                            <p className="card-text"> <strong>email : </strong> {this.state.userItemData.data.email} </p>
                                            <p className="card-text"> <strong>status : </strong> {user_status_label} </p>
                                            <p className="card-text"> <strong>active : </strong> 
                                                {(this.state.userItemData.data.is_allowed === 1 || this.state.userItemData.data.is_allowed) ? (<span className='badge badge-primary badge-pill'>active</span>) : (<span className='badge badge-light badge-pill'>inactive</span>)} </p>
                                            {console.log(this.state.userItemData.is_allowed)}
                                        </div>
                                    </div>
                                </Colxx>
                            </Row>

                            <UserItemModal toggle={this.toggle} is_modalopen={this.state.modal} data_id={this.props.match.params.id} initialValues={this.state.userItemData.data}></UserItemModal>
                        </Colxx>
                    </Row>
                ) : ("")}
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    if (state.clientData.useritem && state.clientData.useritem.data) {
        state.clientData.useritem.data.reset_password = '';
        state.clientData.useritem.data.confirm_password = '';
    }
    return {
        userItemData: state.clientData.useritem,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);