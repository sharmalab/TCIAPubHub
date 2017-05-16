var React = require("react");
var ReactDOM = require("react-dom");
var superagent = require("superagent");

var Citation = React.createClass({
  getInitialState: function() {
    return { doiCitation: null };
  },
  componentDidMount: function() {
    var self = this;
    var citationUrl = "api/getCitation?style=apa&lang=en-US&doi=";
    var doi = self.props.doi.slice(18, self.props.doi.length);
    console.log(doi);
    citationUrl += doi;
    //citationUrl+=self.state.
    superagent.get(citationUrl).withCredentials().end(function(err, response) {
      console.log(response);
      self.setState({ doiCitation: response.text.replace("\\n", "") });
    });
  },
  render: function() {
    var self = this;
    return (
      <div className="doiCitation">
        {self.state.doiCitation
          ? <div className="citation bg-info"> {self.state.doiCitation}</div>
          : <div className="message bg-danger">Loading Citation...</div>}
      </div>
    );
  }
});

var DOISmall = React.createClass({
  render: function() {
    var self = this;
    var data = self.props.data;
    var authors = <div />;
    //console.log(data.authors.length);
    if (data.authors) {
      if (data.authors.isArray) {
        authors = data.authors.map(function(d) {
          return <div>{d}</div>;
        });
      }
    }
    console.log(data.url);
    return (
      <div className="doiSummary">
        <div className="doiTitle">
          <a href={encodeURI(data.url)}><h4>{data.title}</h4></a>
        </div>
        <div><Citation doi={data.doi} /></div>
        {
          // <div className="doiAuthors">{authors}</div>
          //<div className="doiDescription">{data.description}</div>
        }
      </div>
    );
  }
});

var AllDOI = React.createClass({
  getInitialState: function() {
    return { DOIs: null };
  },
  componentDidMount: function() {
    var self = this;
    superagent.get("api/getAllDoi").end(function(err, res) {
      var response = JSON.parse(res.text);
      console.log(response);
      if (response.error) {
        self.setState({ error: response });
      } else {
        self.setState({ DOIs: response });
      }
    });
  },
  render: function() {
    console.log("woot");
    console.log(this.state.DOIs);
    if (this.state.error) {
      return <div> Couldnt fetch data from the server</div>;
    }
    var count = 0;
    if (this.state.DOIs) {
      var DOIs = this.state.DOIs;
      console.log(DOIs);
      var DOI = DOIs.map(function(doi) {
        count++;
        return <DOISmall data={doi} key={count} />;
      });
      return <div> {DOI} </div>;
    } else {
      return <div>Loading DOIs...</div>;
    }
  }
});
var SideBar = React.createClass({
  render: function() {
    return <div />;
    /*
        return(
                <div>
                <h3>SideBar</h3>
                    <div className="sideBarSection">
                    <h4> Category </h4>
                        <ul>
                            <li> <a href="#">Category 1</a> </li>
                            <li> <a href="#">Category 2</a> </li>
                        </ul>
                    </div>
                </div>
        );
        */
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div>
        <div id="header">
          <img src="images/tcia_logo_dark_sml.png" />
        </div>

        <div className="container" id="main">
          <h3 id="headline"> TCIA PubHub</h3>

          <form>
            <div className="input-group add-on">
              <input
                className="form-control input-lg"
                placeholder="Search"
                name="srch-term"
                id="srch-term"
                type="text"
              />
              <div className="input-group-btn">
                <button onClick={livesearch} className="btn btn-lg" type="submit">
                  <span className="glyphicon glyphicon-search" />
                </button>
              </div>
            </div>
          </form>

          <div id="allDois" className="col-md-10 col-md-offset-1">
            <AllDOI />
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById("app"));
