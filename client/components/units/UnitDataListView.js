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
import UnitDataListItemCard from './UnitDataListItemCard';
import DataTablePagination from '../../components/common/DataTablePagination';
import { UNITLIST, UNITDELETE } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { unit_buildings, unit_floor, unit_status, unit_type } from '../../constants/defaultValues';

class UnitDataListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit_num_list: [
                10, 20, 30, 50, 100
            ],
            filterBuildingList: unit_buildings,
            filterFloorList: unit_floor,
            filterStatusList: unit_status,
            filterTypeList: unit_type,
            criteria_building: { label: 'All', value: null },
            criteria_floor: { label: 'All', value: null },
            criteria_status: { label: 'All', value: null },
            criteria_type: { label: 'All', value: null },
            get_list_api_url: 'units/getlist',
            criteria_order: {
                column: 'id',
                label: '',
                direction: 'DESC'
            },
            start_num: 0,
            limit_num: 10,
            unit_data_list: [],
            deleteitem_api_url: 'units/deleteitem',
            isLoading: false
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.getDataList();
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        const { unitlist } = newProps;
        if (unitlist && unitlist.success) {
            this.setState({ unit_data_list: unitlist });
            this.setState({ isLoading: true });
        }
    }

    handleChangeBuilding(selectedValue, selectedLabel) {
        this.setState({
            criteria_building: {
                label: selectedLabel,
                value: selectedValue
            }
        }, () => {
            this.getDataList();
        })
    }

    handleChangeFloor(selectedValue, selectedLabel) {
        this.setState({
            criteria_floor: {
                label: selectedLabel,
                value: selectedValue
            }
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
        })
    }

    handleChangeType(selectedValue, selectedLabel) {
        this.setState({
            criteria_type: {
                label: selectedLabel,
                value: selectedValue
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

    getSelectedPageNum = (selectedPageNum) => {
        this.setState({
            start_num: selectedPageNum,
        }, () => {
            this.getDataList();
        });
    }

    getDataList() {
        const reqUrl = this.state.get_list_api_url;
        const criteria = {
            order_by_column: this.state.criteria_order.column,
            order_by_dir: this.state.criteria_order.direction,
            limit_start_num: this.state.start_num,
            limit_count: this.state.limit_num,
        }
        if (this.state.criteria_building.value !== null) {
            criteria.criteria_building = this.state.criteria_building.value;
        }
        if (this.state.criteria_floor.value !== null) {
            criteria.criteria_floor = this.state.criteria_floor.value;
        }
        if (this.state.criteria_status.value !== null) {
            criteria.criteria_status = this.state.criteria_status.value;
        }
        if (this.state.criteria_type.value !== null) {
            criteria.unit_type = this.state.criteria_type.value;
        }
        this.props.actions.fetchAll(UNITLIST, reqUrl, criteria);
    }

    deleteItem(id) {
        const dispatchListData = {
            reqUrl: this.state.get_list_api_url,
            criteria: {
                order_by_column: this.state.criteria_order.column,
                order_by_dir: this.state.criteria_order.direction,
                limit_start_num: this.state.start_num,
                limit_count: this.state.limit_num,

            },
            entity: UNITLIST
        }
        if (this.state.criteria_building.value !== null) {
            dispatchListData.criteria.criteria_building = this.state.criteria_building.value;
        }
        if (this.state.criteria_floor.value !== null) {
            dispatchListData.criteria.criteria_floor = this.state.criteria_floor.value;
        }
        if (this.state.criteria_status.value !== null) {
            dispatchListData.criteria.criteria_status = this.state.criteria_status.value;
        }
        const del_reqUrl = this.state.deleteitem_api_url;
        this.props.actions.deleteItem(UNITDELETE, del_reqUrl, id, dispatchListData);
    }

    render() {
        let item_start_num = this.state.start_num * this.state.limit_num + 1;
        let item_end_number = 0;
        if (this.state.unit_data_list.success && this.state.unit_data_list.data.length > 0) {
            item_end_number = (item_start_num - 1) + this.state.unit_data_list.data.length;
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
                                            <span className="name">Type: {this.state.criteria_type.label}</span>
                                        </DropdownToggle>
                                        <DropdownMenu className="mt-3" right>
                                            <DropdownItem
                                                onClick={() => this.handleChangeType(null, 'All')}
                                                key={-1}>All</DropdownItem>
                                            {this.state.filterTypeList.map((optionitem, index) => {
                                                return (
                                                    <DropdownItem
                                                        onClick={() => this.handleChangeType(optionitem.value, optionitem.label)}
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
                                            <span className="name">Building: {this.state.criteria_building.label}</span>
                                        </DropdownToggle>
                                        <DropdownMenu className="mt-3" right>
                                            <DropdownItem
                                                onClick={() => this.handleChangeBuilding(null, 'All')}
                                                key={-1}>All</DropdownItem>
                                            {this.state.filterBuildingList.map((optionitem, index) => {
                                                return (
                                                    <DropdownItem
                                                        onClick={() => this.handleChangeBuilding(optionitem.value, optionitem.label)}
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
                                            <span className="name">Floor: {this.state.criteria_floor.label}</span>
                                        </DropdownToggle>
                                        <DropdownMenu className="mt-3" right>
                                            <DropdownItem
                                                onClick={() => this.handleChangeFloor(null, 'All')}
                                                key={-1}>All</DropdownItem>
                                            {this.state.filterFloorList.map((optionitem, index) => {
                                                return (
                                                    <DropdownItem
                                                        onClick={() => this.handleChangeFloor(optionitem.value, optionitem.label)}
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
                                            <span className="name">Status: {this.state.criteria_status.label}</span>
                                        </DropdownToggle>
                                        <DropdownMenu className="mt-3" right>
                                            <DropdownItem
                                                onClick={() => this.handleChangeStatus(null, 'All')}
                                                key={-1}>All</DropdownItem>
                                            {this.state.filterStatusList.map((optionitem, index) => {
                                                if (optionitem.value < 3) {
                                                    return (
                                                        <DropdownItem
                                                            onClick={() => this.handleChangeStatus(optionitem.value, optionitem.label)}
                                                            key={index.toString()}>
                                                            {optionitem.label}
                                                        </DropdownItem>
                                                    );
                                                }
                                            })}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                            <div className="float-md-right">
                                <span className="text-muted text-small mr-1">
                                    {item_start_num}-{item_end_number} of {this.state.unit_data_list.pageSize}
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
                                                <div className="w-40 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Unit Name</p>
                                                </div>
                                                <div className="w-15 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Detail</p>
                                                </div>
                                                <div className="w-15 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Unit Type</p>
                                                </div>
                                                <div className="w-15 w-sm-100">
                                                    <p className="list-item-heading mb-1 truncate">Unit Status</p>
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
                        {this.state.unit_data_list.success && this.state.unit_data_list.data.length > 0 ? (
                            this.state.unit_data_list.data.map((unitItem, index) => {
                                return (
                                    <UnitDataListItemCard unitItemData={unitItem} deleteItem={this.deleteItem}></UnitDataListItemCard>
                                );
                            })
                        ) : ("")}
                        {this.state.unit_data_list.pageSize > 1 ? (
                            <DataTablePagination
                                page={this.state.start_num}
                                pages={this.state.unit_data_list.pageSize}
                                canPrevious={true}
                                canNext={true}
                                defaultPageSize={3}
                                onPageChange={this.getSelectedPageNum}
                            ></DataTablePagination>
                        ) : ("")}

                        <Row className="mt-5">
                            <Colxx xxs="8">
                                <div className="text-zero">
                                    <a href={`/api/units/downloadexcel?order_by_column=` + this.state.criteria_order.column + '&order_by_dir=' + this.state.criteria_order.direction + '&criteria_building=' + this.state.criteria_building.value + '&criteria_floor=' + this.state.criteria_floor.value + '&criteria_status=' + this.state.criteria_status.value} className="bottom-left-button btn btn-secondary btn-lg ml-2">Download Xlsx</a>
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
        unitlist: state.clientData.unitlist,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UnitDataListView);