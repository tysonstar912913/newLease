import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import {
    UncontrolledDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    Input
} from "reactstrap";
import UserDataListItemCard from './UserDataListItemCard';
import DataTablePagination from '../../components/common/DataTablePagination';
import { USERLIST, USERDELETE } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';

class UserDataListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit_num_list: [
                10, 20, 30, 50, 100
            ],
            criteria_order: {
                column: 'id',
                label: '',
                direction: 'DESC'
            },
            start_num: 0,
            limit_num: 10,
            userlist: [],
            get_list_api_url: 'admin/getlist',
            deleteitem_api_url: 'admin/deleteitem',
            criteria_searchKeyword: '',
            isLoading: false
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.getDataList();
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        const { userlist } = newProps;
        this.setState({ userlist: userlist });
        if (userlist && userlist.success) {
            this.setState({ isLoading: true });
        }
    }

    handleSearchInputChange(e) {
        this.setState({
            criteria_searchKeyword: e.target.value
        }, () => {
            this.getDataList();
        })
    }

    handleSearchInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.setState({
                criteria_searchKeyword: e.target.value
            }, () => {
                this.getDataList();
            })
        }
    }

    getDataList() {
        const reqUrl = this.state.get_list_api_url;
        const criteria = {
            order_by_column: this.state.criteria_order.column,
            order_by_dir: this.state.criteria_order.direction,
            limit_start_num: this.state.start_num,
            limit_count: this.state.limit_num,
            searchKeyword: this.state.criteria_searchKeyword
        }
        this.props.actions.fetchAll(USERLIST, reqUrl, criteria);
    }

    handleChangeLimitNum(selectedLimitNum) {
        this.setState({
            limit_num: selectedLimitNum,
            start_num: 0
        }, () => {
            this.getDataList();
        })
    }

    getSelectedPageNum = (selectedPageNum) => {
        this.setState({
            start_num: selectedPageNum,
        }, () => {
            this.getDataList();
        });
    }

    deleteItem(id) {
        const dispatchListData = {
            reqUrl: this.state.get_list_api_url,
            criteria: {
                order_by_column: this.state.criteria_order.column,
                order_by_dir: this.state.criteria_order.direction,
                limit_start_num: this.state.start_num,
                limit_count: this.state.limit_num,
                searchKeyword: this.state.criteria_searchKeyword
            },
            entity: USERLIST
        }
        const del_reqUrl = this.state.deleteitem_api_url;
        this.props.actions.deleteItem(USERDELETE, del_reqUrl, id, dispatchListData);
    }

    render() {
        let item_start_num = this.state.start_num * this.state.limit_num + 1;
        let item_end_number = 0;
        if (this.state.userlist.success && this.state.userlist.data.length > 0) {
            item_end_number = (item_start_num - 1) + this.state.userlist.data.length;
        }
        
        return !this.state.isLoading ? (
            <div className="loading" />
        ) : (
            <Row>
                <Colxx xxs="12">
                    <div className="mb-2">
                        <div className="d-block d-md-inline-block">
                            <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                                <Input
                                    name="searchKeyword"
                                    id="searchKeyword"
                                    placeholder="Seach"
                                    value={this.state.criteria_searchKeyword}
                                    onChange={e => this.handleSearchInputChange(e)}
                                    onKeyPress={e => this.handleSearchInputKeyPress(e)}
                                />
                            </div>
                        </div>
                        <div className="float-md-right">
                            <span className="text-muted text-small mr-1">
                                {item_start_num}-{item_end_number} of {this.state.userlist.pageSize}
                            </span>
                            <div className="d-inline-block dropdown">
                                <UncontrolledDropdown className="ml-2">
                                    <DropdownToggle
                                        caret
                                        color="outline-dark"
                                        size="xs"
                                        className="">
                                        <span className="name">{this.state.limit_num}</span>
                                    </DropdownToggle>
                                    <DropdownMenu className="mt-3" right>
                                        {this.state.limit_num_list.map((limit_num, index) => {
                                            return (
                                                <DropdownItem onClick={() => this.handleChangeLimitNum(limit_num)} >{limit_num}</DropdownItem>
                                            );
                                        })}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                        </div>
                    </div>
                    <div className="separator mb-5" />
                        <Row key="-1">
                            <Colxx xxs="12">
                                <div className="d-flex flex-row card mb-3">
                                    <div className="d-flex flex-grow-1 min-width-zero">
                                        <div className="card-body flex-column flex-lg-row justify-content-between min-width-zero align-self-center d-flex align-items-lg-center background-leaselist-header">
                                            <div className="card-body flex-column flex-lg-row justify-content-between min-width-zero align-self-center d-flex align-items-lg-center py-0">
                                                <div className="w-10 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">FisrtName</p>
                                                </div>
                                                <div className="w-10 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">LastName</p>
                                                </div>
                                                <div className="w-30 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Email</p>
                                                </div>
                                                <div className="w-10 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Status</p>
                                                </div>
                                                <div className="w-10 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Allow</p>
                                                </div>
                                            </div>
                                            <div className="text-center action_col">
                                                <p className="list-item-heading mb-1 truncate">Delete</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Colxx>
                        </Row>
                    {this.state.userlist.success && this.state.userlist.data.length > 0 ? (
                        this.state.userlist.data.map((userItem, index) => {
                            return (
                                <UserDataListItemCard userItemData={userItem} deleteItem={this.deleteItem}></UserDataListItemCard>
                            );
                        })
                    ) : ("")}
                    {this.state.userlist.pageSize > 1 ? (
                        <DataTablePagination
                            page={this.state.start_num}
                            pages={this.state.userlist.pageSize}
                            canPrevious={true}
                            canNext={true}
                            defaultPageSize={3}
                            onPageChange={this.getSelectedPageNum}
                        ></DataTablePagination>
                    ) : ("")}
                </Colxx>
            </Row>
        );
    }

}

function mapStateToProps(state) {
    return {
        userlist: state.clientData.userlist,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDataListView);