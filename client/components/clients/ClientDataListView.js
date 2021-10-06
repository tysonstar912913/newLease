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
import ClientDataListItemCard from './ClientDataListItemCard';
import DataTablePagination from '../../components/common/DataTablePagination';
import { CLIENTSLIST, CLIENTDELETE } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';

class ClientDataListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit_num_list: [
                10, 20, 30, 50, 100
            ],
            orderColList: [
                { col_name: 'company_name', label: 'Company Name' },
                { col_name: 'created_at', label: 'Date' },
                { col_name: 'client_status', label: 'Status' },
            ],
            criteria_order: {
                column: 'id',
                label: '',
                direction: 'DESC'
            },
            start_num: 0,
            limit_num: 10,
            criteria_searchKeyword: '',
            client_data_list: [],
            get_list_api_url: 'clients/getlist',
            deleteitem_api_url: 'clients/deleteitem',
            isLoading: false
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.getDataList();
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        if (newProps) {
            const { clientlist } = newProps;
            if (clientlist && clientlist.success) {
                this.setState({ isLoading: true });
            }
        }
    }

    getDataList() {
        // this.setState({ isLoading: false });
        const reqUrl = this.state.get_list_api_url;
        const criteria = {
            order_by_column: this.state.criteria_order.column,
            order_by_dir: this.state.criteria_order.direction,
            limit_start_num: this.state.start_num,
            limit_count: this.state.limit_num,
            searchKeyword: this.state.criteria_searchKeyword
        }
        this.props.actions.fetchAll(CLIENTSLIST, reqUrl, criteria);
    }

    handleChangeOrderCol(selectedOrderColumn, selectedOrderLabel) {
        this.setState({
            criteria_order: {
                column: selectedOrderColumn,
                label: selectedOrderLabel,
            }
        }, () => {
            this.getDataList();
        })
    }

    handleChangeLimitNum(selectedLimitNum) {
        this.setState({
            limit_num: selectedLimitNum,
            start_num: 0
        }, () => {
            this.getDataList();
        })
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
                order_by_dir: 'ASC',
                limit_start_num: this.state.start_num,
                limit_count: this.state.limit_num,
                searchKeyword: this.state.criteria_searchKeyword
            },
            entity: CLIENTSLIST
        }
        const del_reqUrl = this.state.deleteitem_api_url;
        this.props.actions.deleteItem(CLIENTDELETE, del_reqUrl, id, dispatchListData);
    }

    render() {
        let item_start_num = this.state.start_num * this.state.limit_num + 1;
        let item_end_number = 0;
        if (this.props.clientlist.success && this.props.clientlist.data.length > 0) {
            item_end_number = (item_start_num - 1) + this.props.clientlist.data.length;
        }
        return !this.state.isLoading ? (
            <div className="loading" />
        ) : (
                <Row>
                    <Colxx xxs="12">
                        <div className="mb-2">
                            <div className="d-block d-md-inline-block">
                                <div className="mr-1 float-md-left btn-group mb-1 dropdown">
                                    <UncontrolledDropdown className="ml-2">
                                        <DropdownToggle
                                            caret
                                            color="outline-dark"
                                            size="xs"
                                            className="">
                                            <span className="name">Order By: {this.state.criteria_order.label}</span>
                                        </DropdownToggle>
                                        <DropdownMenu className="mt-3" right>
                                            {this.state.orderColList.map((ordercolitem, index) => {
                                                return (
                                                    <DropdownItem
                                                        onClick={() => this.handleChangeOrderCol(ordercolitem.col_name, ordercolitem.label)}
                                                        key={index.toString()}>
                                                        {ordercolitem.label}
                                                    </DropdownItem>
                                                );
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
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
                                    {item_start_num}-{item_end_number} of {this.props.clientlist.pageSize}
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
                                                <div className="w-25 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Company Name</p>
                                                </div>
                                                <div className="w-15 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Created Date</p>
                                                </div>
                                                <div className="w-15 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Client Status</p>
                                                </div>
                                                <div className="w-15 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Active</p>
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
                        {this.props.clientlist.success && this.props.clientlist.data.length > 0 ? (
                            this.props.clientlist.data.map((clientItem, index) => {
                                return (
                                    <ClientDataListItemCard clientItemData={clientItem} deleteItem={this.deleteItem}></ClientDataListItemCard>
                                );
                            })
                        ) : ("")}
                        {this.props.clientlist.pageSize > 1 ? (
                            <DataTablePagination
                                page={this.state.start_num}
                                pages={this.props.clientlist.pageSize}
                                canPrevious={true}
                                canNext={true}
                                defaultPageSize={3}
                                onPageChange={this.getSelectedPageNum}
                            ></DataTablePagination>
                        ) : ("")}

                        <Row className="mt-5">
                            <Colxx xxs="8">
                                <div className="text-zero">
                                    <a href={`/api/clients/downloadexcel?order_by_column=` + this.state.criteria_order.column + '&order_by_dir=' + this.state.criteria_order.direction + '&searchKeyword=' + this.state.criteria_searchKeyword} className="bottom-left-button btn btn-secondary btn-lg ml-2">Download Xlsx</a>
                                </div>
                            </Colxx>
                        </Row>
                    </Colxx>
                </Row>
            );
    }
}

function mapStateToProps(state) {
    return {
        clientlist: state.clientData.clientlist,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientDataListView);