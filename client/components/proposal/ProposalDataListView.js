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
    Input,
    Button
} from "reactstrap";
import ProposalDataListItemCard from './ProposalDataListItemCard';
import DataTablePagination from '../../components/common/DataTablePagination';
import { PROPOSALSELECTABLECLIENTS, PROPOSALLIST, PROPOSALDELETE, PROPOSALSELECTABLEUSERS } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { proposal_status, unit_type } from '../../constants/defaultValues';

class ProposalDataListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit_num_list: [
                10, 20, 30, 50, 100
            ],
            orderColList: [
                { col_name: 'clients.company_name', label: 'Company Name' },
                { col_name: 'proposal.created_at', label: 'Date' },
                { col_name: 'proposal.proposal_status', label: 'Status' },
            ],
            criteria_order: {
                column: 'proposal.id',
                label: '',
                direction: 'DESC'
            },
            criteria_status: { label: 'All', value: null },
            criteria_user: { label: 'All', value: null },
            criteria_create_user: { label: 'All', value: null },       
            criteria_unit_type: { label: 'All', value: null },     
            filterStatusList: proposal_status,
            unit_type: unit_type,
            start_num: 0,
            limit_num: 10,
            criteria_searchKeyword: '',

            get_list_api_url: 'proposal/getlist',
            deleteitem_api_url: 'proposal/deleteitem',
            isLoading: false,
        };
        this.deleteItem = this.deleteItem.bind(this);
        // this.handledownloadExcel = this.handledownloadExcel.bind(this);

        this.getDataList();
    }

    componentDidMount() {
        this.props.actions.fetchAll(PROPOSALSELECTABLEUSERS, 'proposal/getuserlist', {});
        this.props.actions.fetchAll(PROPOSALSELECTABLECLIENTS, 'proposal/getclientlist', {});
    }

    componentWillReceiveProps(newProps) {
        const { proposallist } = newProps;
        if (proposallist && proposallist.success) {
            this.setState({ isLoading: true });
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
            searchKeyword: this.state.criteria_searchKeyword,
            excel_download: false
        };

        if (this.state.criteria_status.value !== null) {
            criteria.criteria_status = this.state.criteria_status.value;
        }
        
        if (this.state.criteria_user.value !== null) {
            criteria.criteria_user_id = this.state.criteria_user.value;
        }

        if (this.state.criteria_create_user.value !== null) {
            criteria.criteria_create_user_id = this.state.criteria_create_user.value;
        }

        if (this.state.criteria_unit_type.value !== null) {
            criteria.unit_type = this.state.criteria_unit_type.value;
        }
        this.props.actions.fetchAll(PROPOSALLIST, reqUrl, criteria);
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

    handleChangeStatus(selectedValue, selectedLabel) {
        this.setState({
            criteria_status: {
                label: selectedLabel,
                value: selectedValue
            }
        }, () => {
            this.getDataList();
        });
    }

    handleChangeUnitType(selectedValue, selectedLabel) {
        this.setState({
            criteria_unit_type: {
                label: selectedLabel,
                value: selectedValue
            }
        }, () => {
            this.getDataList();
        });
    }    

    handleChangeClient(selectedValue, selectedLabel) {
        this.setState({
            criteria_user: {
                label: selectedLabel,
                value: selectedValue
            }
        }, () => {
            this.getDataList();
        });
    }

    handleChangeUser(selectedValue, selectedLabel) {
        this.setState({
            criteria_create_user: {
                label: selectedLabel,
                value: selectedValue
            }
        }, () => {
            this.getDataList();
        });
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
                order_by_dir: this.state.criteria_order.direction,
                limit_start_num: this.state.start_num,
                limit_count: this.state.limit_num,
                searchKeyword: this.state.criteria_searchKeyword
            },
            entity: PROPOSALLIST
        }
        const del_reqUrl = this.state.deleteitem_api_url;
        this.props.actions.deleteItem(PROPOSALDELETE, del_reqUrl, id, dispatchListData);
    }

    // handledownloadExcel() {
    //     // const reqUrl = this.state.get_list_api_url;
    //     const reqUrl = 'proposal/downloadexcel';
    //     const criteria = {
    //         order_by_column: this.state.criteria_order.column,
    //         order_by_dir: this.state.criteria_order.direction,
    //         limit_start_num: this.state.start_num,
    //         limit_count: this.state.limit_num,
    //         searchKeyword: this.state.criteria_searchKeyword,
    //         excel_download: true
    //     };

    //     if (this.state.criteria_status.value !== null) {
    //         criteria.criteria_status = this.state.criteria_status.value;
    //     }

    //     if (this.state.criteria_user.value !== null) {
    //         criteria.criteria_user_id = this.state.criteria_user.value;
    //     }
    //     this.props.actions.fetchAll('', reqUrl, criteria);
    // }

    render() {
        let item_start_num = this.state.start_num * this.state.limit_num + 1;
        let item_end_number = 0;
        let total_pagesize = 1;
        if (this.props.proposallist && this.props.proposallist.success && this.props.proposallist.data.length > 0) {
            item_end_number = (item_start_num - 1) + this.props.proposallist.data.length;
            total_pagesize = this.props.proposallist.pageSize;
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
                                <div className="mr-1 float-md-left btn-group mb-1 dropdown">
                                    <UncontrolledDropdown className="ml-2">
                                        <DropdownToggle
                                            caret
                                            color="outline-dark"
                                            size="xs"
                                            className="">
                                            <span className="name">Status: {this.state.criteria_status.label}</span>
                                        </DropdownToggle>
                                        <DropdownMenu className="mt-3" right>
                                            <DropdownItem
                                                onClick={() => this.handleChangeStatus(null, 'All')}
                                                key={-1}>All</DropdownItem>
                                            {this.state.filterStatusList.map((optionitem, index) => {
                                                return (
                                                    <DropdownItem
                                                        onClick={() => this.handleChangeStatus(optionitem.value, optionitem.label)}
                                                        key={index.toString()}>
                                                        {optionitem.label}
                                                    </DropdownItem>
                                                );
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                <div className="mr-1 float-md-left btn-group mb-1 dropdown">
                                    <UncontrolledDropdown className="ml-2">
                                        <DropdownToggle
                                            caret
                                            color="outline-dark"
                                            size="xs"
                                            className="">
                                            <span className="name">Client: {this.state.criteria_user.label}</span>
                                        </DropdownToggle>
                                        <DropdownMenu className="mt-3" right>
                                            <DropdownItem
                                                onClick={() => this.handleChangeClient(null, 'All')}
                                                key={-1}>All</DropdownItem>
                                            {this.props.clientList && this.props.clientList.map((client, index) => {
                                                return (
                                                    <DropdownItem
                                                        onClick={() => this.handleChangeClient(client.id, client.company_name)}
                                                        key={index.toString()}>
                                                        {client.company_name}
                                                    </DropdownItem>
                                                );
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                <div className="mr-1 float-md-left btn-group mb-1 dropdown">
                                    <UncontrolledDropdown className="ml-2">
                                        <DropdownToggle
                                            caret
                                            color="outline-dark"
                                            size="xs"
                                            className="">
                                            <span className="name">Created By : {this.state.criteria_create_user.label}</span>
                                        </DropdownToggle>
                                        <DropdownMenu className="mt-3" right>
                                            <DropdownItem
                                                onClick={() => this.handleChangeUser(null, 'All')}
                                                key={-1}>All</DropdownItem>
                                            {this.props.userList && this.props.userList.map((user, index) => {
                                                return (
                                                    <DropdownItem
                                                        onClick={() => this.handleChangeUser(user.id, user.first_name + ' ' + user.last_name)}
                                                        key={index.toString()}>
                                                        {user.first_name + ' ' + user.last_name}
                                                    </DropdownItem>
                                                );
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                <div className="mr-1 float-md-left btn-group mb-1 dropdown">
                                    <UncontrolledDropdown className="ml-2">
                                        <DropdownToggle
                                            caret
                                            color="outline-dark"
                                            size="xs"
                                            className="">
                                            <span className="name">Unit type: {this.state.criteria_unit_type.label}</span>
                                        </DropdownToggle>
                                        <DropdownMenu className="mt-3" right>
                                            <DropdownItem
                                                onClick={() => this.handleChangeUnitType(null, 'All')}
                                                key={-1}>All</DropdownItem>
                                            {this.state.unit_type.map((optionitem, index) => {
                                                return (
                                                    <DropdownItem
                                                        onClick={() => this.handleChangeUnitType(optionitem.value, optionitem.label)}
                                                        key={index.toString()}>
                                                        {optionitem.label}
                                                    </DropdownItem>
                                                );
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                {/* <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                                    <Input
                                        name="searchKeyword"
                                        id="searchKeyword"
                                        placeholder="Seach"
                                        value={this.state.criteria_searchKeyword}
                                        onChange={e => this.handleSearchInputChange(e)}
                                        onKeyPress={e => this.handleSearchInputKeyPress(e)}
                                    />
                                </div> */}
                            </div>
                            <div className="float-md-right">
                                <span className="text-muted text-small mr-1">
                                    {item_start_num}-{item_end_number} of {total_pagesize}
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
                                                    <DropdownItem key={index} onClick={() => this.handleChangeLimitNum(limit_num)} >{limit_num}</DropdownItem>
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
                                                    <p className="list-item-heading mb-1 truncate">Client Name</p>
                                                </div>
                                                <div className="w-15 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Create User</p>
                                                </div>
                                                <div className="w-15 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Created Date</p>
                                                </div>
                                                <div className="w-15 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Status</p>
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
                        {this.props.proposallist && this.props.proposallist.success && this.props.proposallist.data.length > 0 ? (
                            this.props.proposallist.data.map((proposalItem, index) => {
                                return (
                                    <ProposalDataListItemCard key={index} proposalItemData={proposalItem} deleteItem={this.deleteItem}></ProposalDataListItemCard>
                                );
                            })
                        ) : ("")}
                        {this.props.proposallist && this.props.proposallist.pageSize && this.props.proposallist.pageSize > 1 ? (
                            <DataTablePagination
                                page={this.state.start_num}
                                pages={this.props.proposallist.pageSize}
                                canPrevious={true}
                                canNext={true}
                                defaultPageSize={3}
                                onPageChange={this.getSelectedPageNum}
                            ></DataTablePagination>
                        ) : ("")}
                        
                        <Row className="mt-5">
                            <Colxx xxs="8">
                                <div className="text-zero">
                                    <a href={`/api/proposal/downloadexcel?order_by_column=` + this.state.criteria_order.column + '&order_by_dir=' + this.state.criteria_order.direction + '&searchKeyword=' + this.state.criteria_searchKeyword + '&criteria_status=' + this.state.criteria_status.value + '&criteria_user_id=' + this.state.criteria_user.value} className="bottom-left-button btn btn-secondary btn-lg ml-2">Download Xlsx</a>
                                    {/* <Button className="bottom-left-button btn btn-secondary btn-lg ml-2" onClick={this.handledownloadExcel}>Download Xlsx</Button> */}
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
        proposallist: state.clientData.proposallist,
        clientList: state.clientData.selectable_client_list.data,
        userList: state.clientData.selectable_user_list.data,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProposalDataListView);