import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx } from "./CustomBootstrap";
import { log_action_description } from '../../constants/defaultValues';

class LogContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            log_action_description: log_action_description
        };
    }

    convertISOtoDate(datetime) {
        let retVal = '';
        const parseTimestamp = Date.parse(datetime);
        const timestamp = new Date(parseTimestamp);
        let month = parseInt(timestamp.getMonth()) + 1;
        retVal = timestamp.getFullYear() + '-' + month + '-' + timestamp.getDate() + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes();
        return retVal;
    }

    render() {
        let tablerecords = [];
        if (this.props.loglist) {
            tablerecords = this.props.loglist;
            for (let i = 0; i < tablerecords.length; i++) {
                tablerecords[i].description = this.state.log_action_description[tablerecords[i].action];
            }
        }
        return (
            <Fragment>
                {tablerecords.length > 0 ? (
                    <Row>
                        <Colxx xxs="12">
                            <div className="card mt-2 mb-2">
                                <div className="card-body">
                                    <h5 className="card-title">Logs</h5>
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>User Name</th>
                                                <th>Change Content</th>
                                                <th>DateTime</th>
                                            </tr>
                                        </thead>
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
                                    </table>
                                </div>
                            </div>
                        </Colxx>
                    </Row>
                ) : ("")}
            </Fragment>
        );
    }
}

export default LogContent;