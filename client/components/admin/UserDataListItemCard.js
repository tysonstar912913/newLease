import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import {
    Button
} from "reactstrap";

class UserDataListItemCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userItemData: null,
            data_id: -1
        };
    }

    componentDidMount() {
        this.setState({
            userItemData: this.props.userItemData,
            data_id: this.props.userItemData.id
        });
    }

    renderStatusField(status) {
        // if (status === 0) {
        //     return (<span className="badge badge-primary badge-pill">User</span>);
        // }
        // else if (status === 1) {
        //     return (<span className="badge badge-light badge-pill">Admin</span>);
        // }
        switch (status) {
            case 0:
                return ("User");
            case 1:
                return ("Admin");
            default:
                return ("User");
        }
    }

    deleteItem(id) {
        if (confirm('Do you really remove this item ?')) {
            this.props.deleteItem(id);
        }
    }

    render() {
        let userItemData = this.props.userItemData;
        let component_key = userItemData.id.toString();
        const viewpageURL = "/app/admin/view/" + userItemData.id;
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
                                    <div className="w-10 w-sm-100">
                                        <p className="list-item-heading mb-1 truncate">{userItemData.first_name}</p>
                                    </div>
                                    <div className="w-10 w-sm-100">
                                        <p className="list-item-heading mb-1 truncate">{userItemData.last_name}</p>
                                    </div>
                                    <div className="w-30 w-sm-100">
                                        <p className="list-item-heading mb-1 truncate">{userItemData.email}</p>
                                    </div>
                                    <div className="w-10 w-sm-100">
                                        {this.renderStatusField(userItemData.status)}
                                    </div>
                                    <div className="w-10 w-sm-100">
                                    {/* {userItemData.is_allowed === 1 ? (<span className='badge badge-primary badge-pill'>active</span>) : (<span className='badge badge-light badge-pill'>inactive</span>)} */}
                                    {(userItemData.is_allowed === 1 || userItemData.is_allowed ) ? ("active") : ("inactive")}
                                    </div>
                                </NavLink>
                                <div className="text-center">
                                    <Button className="btn btn-danger btn-sm" onClick={this.deleteItem.bind(this, this.props.userItemData.id)}><div className="glyph-icon simple-icon-trash"></div></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Colxx>
            </Row>
        );
    }
}

export default UserDataListItemCard;