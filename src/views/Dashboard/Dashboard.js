import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import ReactTable from "react-table";
import { NotificationManager } from "react-notifications";
import cityData from "./city_state";
import "react-table/react-table.css";
import AuthService from "../../AuthService";
import lodash from 'lodash'
const allCity = Object.keys(cityData);

const auth = new AuthService();
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
    recepients: [],
    campaignsData: [],
    frequency: "daily",
    sent: 0,
    clickedData: [],
    opendData: [],
    thData:[],
    userState: allCity[0],
    userCity: cityData[allCity[0]][0],
    thState: allCity[0],
    thCity: cityData[allCity[0]][0],
    campState: allCity[0],
    campCity: 'all',
    thDet:'',
    finalCity:[],
    finalState:[]
  };

  componentDidMount() {
    const page = 1;
    let params = {
      limit: page * this.state.pageSize,
      skip: page * this.state.pageSize - this.state.pageSize
    };
    let query = Object.keys(params)
      .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    this.fetchCampaign();
    this.fetchStats();
    this.fetchTheaters();
    auth
      .fetch("/apis/emailList/fetchEmails?" + query, { method: "GET" })
      .then(data2 => {
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
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Failed to fetch emails");
      });
  }
  fetchTheaters = ()=>{
    const page = 1;
    let params = {
      limit: page * this.state.pageSize,
      skip: page * this.state.pageSize - this.state.pageSize
    };
    let query = Object.keys(params)
      .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    auth
    .fetch("/apis/theaters/fetchTheaters?" + query, { method: "GET" })
    .then(data2 => {
      this.setState({
        thData: data2,
      });
    })
    .catch(error => {
      console.log(error);
      NotificationManager.error("Failed to fetch theaters");
    });
  }

  fetchStats = () => {
    auth
      .fetch("/apis/stats", { method: "GET" })
      .then(data => {
        this.setState({
          sent: data.toalSent,
          opendData: data.openData,
          clickedData: data.clickData
        });
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Unable to fetch stats!");
      });
  };

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
  changeHandler = e => {
    //currently deselect wont work, only will work if deselect all the items
    if(e.target.name=='campCity' || e.target.name=='campState'){
      const stateCursor= ((e.target.name == 'campCity') ? 'finalCity' : 'finalState') ;

          if(e.target.value){
            let cloning = this.state[stateCursor] ;
            console.log(cloning);
            let updatedData = cloning.concat(e.target.value);
            updatedData = lodash.uniq(updatedData);
            this.setState({
              [`${stateCursor}`]:updatedData
            });
          }else{
            this.setState({
              [`${stateCursor}`]:[]
            });
          }
    }else if(e.target.name=='thDet'){
      if(e.target.value){
        const datas = this.state.thData[e.target.value]
        let cloningCity = this.state.finalCity ;
        let updatedDataCitY = cloningCity.concat(datas.city);
        let cloningState = this.state.finalState ;
        let updatedDataState = cloningState.concat(datas.state);
        updatedDataState = lodash.uniq(updatedDataState);
        updatedDataCitY = lodash.uniq(updatedDataCitY);
        this.setState({
          finalCity:updatedDataCitY,
          finalState:updatedDataState
        });
      }
    }else{
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  };
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );
  pageSizeChange = pageSize => {
    this.setState({
      pageSize: pageSize
    });
  };

  pageChange = page => {
    //fetch data where limit : page*this.state.pageSize, skip:page*this.state.pageSize - this.state.pageSize
    let params = {
      limit: page * this.state.pageSize,
      skip: page * this.state.pageSize - this.state.pageSize
    };
    let query = Object.keys(params)
      .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    auth
      .fetch("/apis/emailList/fetchEmails?" + query, { method: "GET" })
      .then(data => {
        console.log(data);
        var checkedCopy = this.state.checked;
        var selectAll = this.state.selectAll;
        data.forEach(function(e, index) {
          checkedCopy.push(selectAll);
        });

        this.setState({
          data: data,
          checked: checkedCopy,
          selectAll: selectAll
        });
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Failed to fetch emails");
      });
  };

  pageChangeth = page => {
    //fetch data where limit : page*this.state.pageSize, skip:page*this.state.pageSize - this.state.pageSize
    let params = {
      limit: page * this.state.pageSize,
      skip: page * this.state.pageSize - this.state.pageSize
    };
    let query = Object.keys(params)
      .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    auth
      .fetch("/apis/theaters/fetchTheaters" + query, { method: "GET" })
      .then(data => {
        console.log(data);
        var checkedCopy = this.state.checked;
        var selectAll = this.state.selectAll;
        data.forEach(function(e, index) {
          checkedCopy.push(selectAll);
        });

        this.setState({
          data: data,
          checked: checkedCopy,
          selectAll: selectAll
        });
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Failed to fetch emails");
      });
  };

  addEmail = () => {
    auth
      .fetch("/apis/emailList/addEmail", {
        method: "POST",
        body: JSON.stringify({
          email: this.state.email,
          name: this.state.name,
          city: this.state.userCity,
          state: this.state.userState
        })
      })
      .then(data => {
        console.log(data);
        var checkedCopy = this.state.checked;
        var selectAll = this.state.selectAll;
        let statedata = this.state.data;
        statedata.push(data);
        statedata.forEach(function(e, index) {
          checkedCopy.push(selectAll);
        });
        this.setState({
          data: statedata,
          checked: checkedCopy,
          selectAll: selectAll
        });
        NotificationManager.success("Email added to the list ");
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Failed to add email");
      });
    // this.state.email
  };
  addCampaign = () => {
    // this.state.etemplate,
    // this.state.cpgname
    // this.state.recepients
    auth
      .fetch("/apis/campaign/createCampaign", {
        method: "POST",
        body: JSON.stringify({
          campaignName: this.state.cpgname,
          usersSelected: {
            city:this.state.finalCity.length ?this.state.finalCity : [this.state.campCity],
            state:this.state.finalState.length ? this.state.finalState: [this.state.campState]
          },
          template: this.state.etemplate
        })
      })
      .then(data => {
        console.log(data);
        NotificationManager.success("Campaign added ! ");
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Failed to add Campaign!");
      });
  };

  addTh = () => {
    auth
      .fetch("/apis/theaters/addTheater", {
        method: "POST",
        body: JSON.stringify({
          name: this.state.thName,
          city: this.state.thCity,
          state: this.state.thState
        })
      })
      .then(data => {
      let alldata = this.state.thData;
      const concatedData = alldata.concat(data);
        this.setState({
          thData: concatedData
        });
        //above thing not used now
        NotificationManager.success("Email added to the list ");
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Failed to add theater");
      });
    // this.state.email
  };
  fetchCampaign = () => {
    auth
      .fetch("/apis/campaign/fetchCampaign", { method: "GET" })
      .then(data => {
        this.setState({
          campaignsData: data
        });
        if (!this.state.campaigns && this.state.campaignsData.length) {
          this.setState({
            campaigns: data[0]._id
          });
        }
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Failed to fetch Campaign!");
      });
  };
  runCampaign = () => {
    // this.state.campaigns
    // this.state.frequency
    // this.state.limitedDays

    auth
      .fetch("/apis/campaign/runCampaign", {
        method: "POST",
        body: JSON.stringify({
          frequency: this.state.frequency,
          timePeriod: this.state.limitedDays,
          _id: this.state.campaigns
        })
      })
      .then(data => {
        console.log(data);
        NotificationManager.success("Campaign added ! ");
      })
      .catch(error => {
        console.log(error);
        NotificationManager.error("Failed to add Campaign!");
      });
  };
  render() {
    let items = [];
    this.state.campaignsData.length &&
      this.state.campaignsData.forEach((e, i) => {
        items.push(
          <option value={e._id} key={i}>
            {e.campaignName}
          </option>
        );
      });
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="4">
            <Card className="p-4" className="justify-content-center">
              <CardHeader>User Segment</CardHeader>

              <div style={{ margin: "2.5%" }}>
                <p className="text-muted"> Addd User List:</p>
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>name</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    placeholder="name"
                    name="name"
                    onChange={this.changeHandler}
                  />
                </InputGroup>
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>@</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    placeholder="email"
                    name="email"
                    onChange={this.changeHandler}
                  />
                </InputGroup>
                Select State:
                <InputGroup className="mb-4">
                  <select name="userState" onChange={this.changeHandler}>
                    {allCity.map((e, i) => {
                      return (
                        <option value={e} key={i}>
                          {e}
                        </option>
                      );
                    })}
                  </select>
                </InputGroup>
                Select City:
                <InputGroup className="mb-4">
                  <select
                    name="userCity"
                    onChange={this.changeHandler}
                    disabled={this.state.userState ? false : true}
                  >
                    {cityData[this.state.userState].map((e, i) => {
                      return (
                        <option value={e} key={i}>
                          {e}
                        </option>
                      );
                    })}
                  </select>
                </InputGroup>
                <Button
                  color="primary"
                  className="px-4"
                  onClick={this.addEmail}
                  disabled={
                    this.state.name &&
                    this.state.userCity &&
                    this.state.userState &&
                    this.state.email
                      ? false
                      : true
                  }
                >
                  Add
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Card className="p-4" className="justify-content-center">
              <CardHeader>Theater Segment</CardHeader>

              <div style={{ margin: "2.5%" }}>
                <p className="text-muted"> Add Theater List:</p>
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>name</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    placeholder="name"
                    name="thName"
                    onChange={this.changeHandler}
                  />
                </InputGroup>
                Select State:
                <InputGroup className="mb-4">
                  <select name="thState" onChange={this.changeHandler}>
                    {allCity.map((e, i) => {
                      return (
                        <option value={e} key={i}>
                          {e}
                        </option>
                      );
                    })}
                  </select>
                </InputGroup>
                Select City:
                <InputGroup className="mb-4">
                  <select
                    name="thCity"
                    onChange={this.changeHandler}
                    disabled={this.state.thState ? false : true}
                  >
                    {cityData[this.state.thState].map((e, i) => {
                      return (
                        <option value={e} key={i}>
                          {e}
                        </option>
                      );
                    })}
                  </select>
                </InputGroup>
                <Button
                  color="primary"
                  className="px-4"
                  onClick={this.addTh}
                  disabled={
                    this.state.thName &&
                    this.state.thCity &&
                    this.state.thState
                      ? false
                      : true
                  }
                >
                  Add
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Card>
              <CardHeader>Run a Campaign</CardHeader>
              <CardBody>
                Select Campaigns:{" "}
                <InputGroup className="mb-4">
                  <select
                    name="campaigns"
                    placeholder="select campaigns"
                    onChange={this.changeHandler}
                  >
                    {items}
                  </select>
                </InputGroup>
                Select Frequency:
                <InputGroup className="mb-4">
                  <select name="frequency" onChange={this.changeHandler}>
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                  </select>
                </InputGroup>
                For:
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="append">
                    <InputGroupText>Days</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="number"
                    placeholder="days"
                    name="limitedDays"
                    onChange={this.changeHandler}
                  />
                </InputGroup>
              </CardBody>
              <CardFooter>
                <Button
                  color="primary"
                  className="px-4"
                  onClick={this.runCampaign}
                >
                  Run Campaign
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <Card>
            <CardHeader>Stats</CardHeader>
            Total Sent: {this.state.sent} <br />
             Total Times Opened:  {this.state.opendData}<br />
             Total Times clickd:{this.state.clickedData}<br />
            </Card>
          </Col>
          <Col lg="6">
            <Card>
            <CardHeader>Theater List</CardHeader>
            <ReactTable
                  data={this.state.thData}
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
                      Header: "name",
                      accessor: "name"
                    },
                    {
                      Header: "state",
                      accessor: "state"
                    },
                    {
                      Header: "city",
                      accessor: "city"
                    }
                  ]}
                  className="-striped "
                  onPageSizeChange={pageIndex => this.pageSizeChange(pageIndex)}
                  onPageChange={pageSize => this.pageChangeth(pageSize)}
                />
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
                    onChange={this.changeHandler}
                  />
                </InputGroup>
                <br />
                Select Theater:
                <InputGroup className="mb-4">
                  <select name="thDet" onChange={this.changeHandler} multiple={true}>
                    {this.state.thData.map((e, i) => {
                      return (
                        <option value={i} key={i}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                </InputGroup>
                <br />
                Select User from: State:
                <InputGroup className="mb-4">
                  <select name="campState" onChange={this.changeHandler} multiple={true}>
                    {allCity.map((e, i) => {
                      if (allCity.length - 1 == i) {
                        return [
                          <option value="all" key={i + 1}>
                            all
                          </option>,
                          <option value={e} key={i}>
                            {e}
                          </option>
                        ];
                      }
                      return (
                        <option value={e} key={i}>
                          {e}
                        </option>
                      );
                    })}
                  </select>
                </InputGroup>
                City:
                <InputGroup className="mb-4">
                  <select
                    name="campCity"
                    onChange={this.changeHandler}
                    disabled={this.state.campState ? false : true}
                    multiple={true}
                  >
                    {this.state.campState && this.state.campState !="all" && cityData[this.state.campState].map((e, i) => {
                      if (cityData[this.state.campState].length - 1 == i) {
                        return [
                          <option value="all" key={i + 1}>
                            all
                          </option>,
                          <option value={e} key={i}>
                            {e}
                          </option>
                        ];
                      }
                      return (
                        <option value={e} key={i}>
                          {e}{" "}
                        </option>
                      );
                    })}
                    {this.state.campState && this.state.campState =="all" &&(
                      <option value="all" key= {0}>all</option>
                    )

                    }
                  </select>
                </InputGroup>
                Selected Cities :{this.state.finalCity.join()}<br />
                Selected States :{this.state.finalState.join()}<br />
                Email Template:
                <br />
                <textarea
                  placeholder="Define Email Template here..."
                  cols={80}
                  rows={20}
                  name="etemplate"
                  onChange={this.changeHandler}
                  style={{ margin: "2em" }}
                />
                <br />
                <Button
                  color="primary"
                  className="px-4"
                  onClick={this.addCampaign}
                  disabled={
                    this.state.cpgname &&
                    this.state.etemplate &&
                    this.state.campCity &&
                    this.state.campState
                      ? false
                      : true
                  }
                >
                  Add Campaign
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card>
              <CardHeader>All Users</CardHeader>
              <CardBody>
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
                      Header: "name",
                      accessor: "name"
                    },
                    {
                      Header: "state",
                      accessor: "state"
                    },
                    {
                      Header: "city",
                      accessor: "city"
                    },
                    {
                      Header: "email",
                      accessor: "email"
                    }
                  ]}
                  className="-striped "
                  onPageSizeChange={pageIndex => this.pageSizeChange(pageIndex)}
                  onPageChange={pageSize => this.pageChange(pageSize)}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
