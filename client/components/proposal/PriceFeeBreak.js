import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";

class PriceFeeBreak extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let rent_free_period = parseInt(this.props.calcData.rent_free_period);
        let base_rent = parseFloat(this.props.calcData.base_rent);
        let annual_community_service_charges = parseFloat(this.props.calcData.annual_community_service_charges);
        let annual_building_service_charges = parseFloat(this.props.calcData.annual_building_service_charges);
        let annual_increment_on_service_charges = parseFloat(this.props.calcData.annual_increment_on_service_charges) * 0.01;
        let leaseyear_count = 5;

        let tablerecords = [{
            lease_year: 1,
            base_rent: base_rent,
            bsc: annual_building_service_charges,
            mcsc: annual_community_service_charges,
            months: 12
        }];

        for (let i = 1; i < 5; i++) {
            let record = {
                lease_year: i + 1,
                base_rent: base_rent,
                bsc: tablerecords[i - 1].bsc + tablerecords[i - 1].bsc * annual_increment_on_service_charges,
                mcsc: tablerecords[i - 1].mcsc + tablerecords[i - 1].mcsc * annual_increment_on_service_charges,
                months: tablerecords[i - 1].months + 12,
            }
            tablerecords.push(record);
        }


        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="card mb-5">
                            <div className="card-body">
                                <h5 className="card-title">Price and Fee break</h5>
                                <p>Rent free Period Amount: {rent_free_period}</p>
                                <p>Total Service Charge: {annual_community_service_charges + annual_building_service_charges} SAR</p>
                                {/* <p>Total Design Review Fees: 0</p> */}
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Lease Year</th>
                                            <th>Base Rent</th>
                                            <th>Annual Base Rent</th>
                                            <th>BSC</th>
                                            <th>Annual BSC</th>
                                            <th>MCSC</th>
                                            <th>Annual MCSC</th>
                                            <th>Total Rent</th>
                                            <th>Due Date </th>
                                        </tr>
                                    </thead>
                                    <tbody>{tablerecords.map((record, index) => {
                                        return (<tr key={index}>
                                            <th scope="row">{record.lease_year}</th>
                                            <td>{parseFloat(record.base_rent).toFixed(2)}SAR/㎡</td>
                                            <td>0</td>
                                            <td>{parseFloat(record.bsc).toFixed(2)}SAR/㎡</td>
                                            <td>0</td>
                                            <td>{parseFloat(record.mcsc).toFixed(2)}SAR/㎡</td>
                                            <td>0</td>
                                            <td>{parseFloat(record.base_rent + record.bsc + record.mcsc).toFixed(2)}SAR/㎡</td>
                                            <td>{record.months}Months ..</td>
                                        </tr>)
                                    })}</tbody></table>
                            </div>
                        </div>
                    </Colxx>
                </Row>
            </Fragment>
        );
    }
}

export default PriceFeeBreak;