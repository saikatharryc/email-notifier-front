import React, { Component, Compusernament, lazy, Suspense } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";

const Widget03 = lazy(() => import("../../views/Widgets/Widget03"));

const brandPrimary = getStyle("--primary");
const brandSuccess = getStyle("--success");
const brandInfo = getStyle("--info");
const brandWarning = getStyle("--warning");
const brandDanger = getStyle("--danger");

class Dashboard extends Component {
  state = {
    dropdownOpen: false,
    radioSelected: 2,
    loading: true,
    timestamp: "",
    selectAll: false,
    data: [],
    checked: [],
    pageSize: 5,
    maxPageNumber: 0,
    recepients: []
  };

  componentDidMount() {
    const data2 = [
      { email: "email0" },
      { email: "email1" },
      { email: "email2" },
      { email: "email3" },
      { email: "email4" },
      { email: "email5" },
      { email: "email6" },
      { email: "email7" },
      { email: "email8" }
    ];

    var checkedCopy = [];
    var selectAll = this.state.selectAll;
    data2.forEach(function(e, index) {
      checkedCopy.push(selectAll);
    });

    this.setState({
      data: data2,
      checked: checkedCopy,
      selectAll: selectAll
    });
  }

  toggle(val) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected
    });
  }
  handleChange = () => {
    var selectAll = !this.state.selectAll;
    let recepients = this.state.recepients;

    this.setState({ selectAll: selectAll });
    var checkedCopy = [];
    this.state.data.forEach(function(e, index) {
      checkedCopy.push(selectAll);
      if (selectAll) {
        recepients.push(e.email);
      }
    });
    if (!selectAll) {
      recepients.splice(0, recepients.length);
    }
    this.setState({
      checked: checkedCopy,
      recepients: recepients
    });
  };
  handleSingleCheckboxChange = row => {
    console.log(row);
    const index = row.index;
    const email = row.row.email;
    var checkedCopy = this.state.checked;
    checkedCopy[index] = !this.state.checked[index];
    let recepients = this.state.recepients;
    if (checkedCopy[index] == true) {
      recepients.push(email);
      this.setState({
        recepients: recepients
      });
    } else {
      const emailIndex = recepients.indexOf(email);
      if (emailIndex > -1) {
        recepients.splice(emailIndex, 1);
        this.setState({ recepients: recepients });
      }

      this.setState({ selectAll: false });
    }

    this.setState({
      checked: checkedCopy
    });
  };
  changeHandler=(e)=>{
    console.log(e.target.value,e.target.name)
  }
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );
  pageChange = page => {
    //fetch data where limit : page*this.state.pageSize, skip:page*this.state.pageSize - this.state.pageSize
  };
  pageSizeChange = pageSize => {
    this.setState({
      pageSize: pageSize
    });
  };

  addEmail =()=>{
    this.state.email
  }
  addCampaign=()=>{
      this.state.etemplate,
      this.state.cpgname
      this.state.recepients
  }
  runCampaign =()=>{
    this.state.campaigns
    this.state.frequency
    this.state.limitedDays
  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="4">
            <Card className="p-4" className="justify-content-center">
              <CardHeader>User Segment</CardHeader>

              <div style={{ margin: "2.5%" }}>
                <p className="text-muted"> Addd/Update User Email List:</p>
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>@</InputGroupText>
                  </InputGroupAddon>
                  <Input type="text" placeholder="email" name="email" onChange={this.handleChange} />
                </InputGroup>
                <Button color="primary" className="px-4" onClick={this.addEmail} >
                  Add
                </Button>
              </div>
            </Card>
            </Col>
            <Col xs="12" sm="6" lg="4">
            <Card>
              <CardHeader>
                Run a Campaign
              </CardHeader>
               <CardBody>
                 Select Campaigns: <InputGroup className="mb-4">

               <select name="campaigns" onChange={this.changeHandler}>
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
              </InputGroup>

              Select Frequency:<InputGroup className="mb-4">
               <select name="frequency" onChange={this.changeHandler}>
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
              </select>
              </InputGroup>
            For:
            <InputGroup className="mb-4">
            <InputGroupAddon addonType="postpend">
                    <InputGroupText>Days</InputGroupText>
                  </InputGroupAddon>
                  <Input type="number" placeholder="days" name="limitedDays" onChange={this.changeHandler} />
                  </InputGroup>

               </CardBody>
               <CardFooter>
               <Button color="primary" className="px-4" onClick={this.runCampaign}>
                  Run Campaign
                </Button>
               </CardFooter>
              </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="8">
            <Card>
              <CardHeader>Create Campaign with Email Template:</CardHeader>
              <CardBody>
                Campaign Name:
                <InputGroup className="mb-8">
                  <InputGroupAddon addonType="prepend" />
                  <Input
                    type="text"
                    placeholder="Campaign name"
                    name="cpgname"
                    onChange={this.handleChange}
                  />
                </InputGroup>
                <br />
                Select User:
                <ReactTable
                  data={this.state.data}
                  filterable
                  showPagination={true}
                  showPageSizeOptions={true}
                  defaultPageSize={this.state.pageSize}
                  defaultFilterMethod={(filter, row) =>
                    row[filter.id] !== undefined
                      ? String(row[filter.id])
                          .toLowerCase()
                          .includes(filter.value.toLowerCase())
                      : false
                  }
                  columns={[
                    {
                      Header: (
                        <input
                          type="checkbox"
                          onChange={this.handleChange}
                          checked={this.state.selectAll}
                        />
                      ),
                      Cell: row => (
                        <input
                          type="checkbox"
                          defaultChecked={this.state.checked[row.index]}
                          checked={this.state.checked[row.index]}
                          onChange={() => this.handleSingleCheckboxChange(row)}
                        />
                      ),
                      sortable: false,
                      filterable: false
                    },
                    {
                      Header: "email",
                      accessor: "email"
                    }
                  ]}
                  className="-striped "
                  onPageSizeChange={pageIndex => this.pageSizeChange(pageIndex)}
                  onPageChange={pageSize => this.pageChange(pageSize)}
                /><br />

                Email Template:<br />
                <textarea
                  placeholder="Define Email Template here..."
                  cols={80}
                  rows={20}
                  name="etemplate"
                  onChange={this.handleChange}
                  style={{ margin: "2em" }}
                ></textarea>



                <br />

                <Button color="primary" className="px-4" onClick={this.addCampaign}>
                  Add Campaign
                </Button>
              </CardBody>
            </Card>
          </Col>
            <Col lg="4">
            <Card>
             <CardHeader> Selected Users:</CardHeader>
             <CardBody>
            {this.state.recepients.join()}
            </CardBody>
            </Card>
            </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
