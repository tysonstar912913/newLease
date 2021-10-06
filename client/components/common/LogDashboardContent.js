import React, { Component, Fragment } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
    Row,
    UncontrolledDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu
} from "reactstrap";
import { Colxx } from "./CustomBootstrap";
import { log_action_description } from '../../constants/defaultValues';
import { LOGDASHBOARDLIST, PROPOSALSELECTABLEUSERS } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import DataTablePagination from '../../components/common/DataTablePagination';

class LogDashboardContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            log_action_description: log_action_description,
            loglist: null,
            start_num: 0,
            limit_num: 10,
            criteria_create_user: { label: 'All', value: null },    
        };
    }

    componentDidMount() {
        this.getLogList();
        this.props.actions.fetchAll(PROPOSALSELECTABLEUSERS, 'proposal/getuserlist', {});
    }

    componentWillReceiveProps(newProps) {
        if (newProps) {
            const { loglist } = newProps;
            if (loglist) {
                this.setState({ loglist: loglist.data });
                // this.setState({ isLoading: true });
            }
        }
    }

    getSelectedPageNum = (selectedPageNum) => {
        this.setState({
            start_num: selectedPageNum,
        }, () => {
            this.getLogList();
        });
    }

    convertISOtoDate(datetime) {
        let retVal = '';
        const parseTimestamp = Date.parse(datetime);
        const timestamp = new Date(parseTimestamp);
        let month = parseInt(timestamp.getMonth()) + 1;
        retVal = timestamp.getFullYear() + '-' + month + '-' + timestamp.getDate() + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes();
        return retVal;
    }

    getLogList() {
        const reqUrl = 'logs/getdashboardlist';
        const criteria = {
            order_by_column: 'logs.created_at',
            order_by_dir: 'DESC',
            limit_start_num: this.state.start_num,
            limit_count: this.state.limit_num,
        }
        if (this.state.criteria_create_user.value !== null) {
            criteria.user_id = this.state.criteria_create_user.value;
        }
        this.props.actions.fetchAll(LOGDASHBOARDLIST, reqUrl, criteria);
    }

    handleChangeUser(selectedValue, selectedLabel) {
        this.setState({
            criteria_create_user: {
                label: selectedLabel,
                value: selectedValue
            }
        }, () => {
            this.getLogList();
        });
    }

    render() {
        console.log('this.props.loglist', this.state.loglist)
        let tablerecords = [];
        if (this.state.loglist) {
            tablerecords = this.state.loglist;
            for (let i = 0; i < tablerecords.length; i++) {
                tablerecords[i].description = this.state.log_action_description[tablerecords[i].action];
            }
        }
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="card mt-2 mb-2">
                            <div className="card-body">
                                <h5 className="card-title">Logs</h5>
                                <div className="mb-2">
                                    <div className="d-block d-md-inline-block">
                                        <div className="mr-1 float-md-left btn-group mb-1 dropdown">
                                            <UncontrolledDropdown className="ml-2">
                                                <DropdownToggle
                                                    caret
                                                    color="outline-dark"
                                                    size="xs"
                                                    className="">
                                                    <span className="name">User : {this.state.criteria_create_user.label}</span>
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
                                    </div>
                                </div>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>User Name</th>
                                            <th>Change Content</th>
                                            <th>DateTime</th>
                                        </tr>
                                    </thead>
                                    {tablerecords.length > 0 ? (
                                    <tbody>                                            
                                    {tablerecords.map((record, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{record.first_name} {record.last_name}</td>
                                                <td>{this.state.log_action_description[record.action]}</td>
                                                <td>{this.convertISOtoDate(record.created_at)}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                    ) : ("")}
                                </table>
                                {this.props.loglist && this.props.loglist.pageSize && this.props.loglist.pageSize > 1 ? (
                                    <DataTablePagination
                                        page={this.state.start_num}
                                        pages={this.props.loglist.pageSize}
                                        canPrevious={true}
                                        canNext={true}
                                        defaultPageSize={3}
                                        onPageChange={this.getSelectedPageNum}
                                    ></DataTablePagination>
                                ) : ("")}
                            </div>
                        </div>
                    </Colxx>
                </Row>
            </Fragment>
        );
    }
}

// export default LogDashboardContent;

function mapStateToProps(state) {
    return {
        loglist: state.clientData.logdashboardlist,
        userList: state.clientData.selectable_user_list.data,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LogDashboardContent);