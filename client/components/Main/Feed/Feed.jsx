var React = require("react");
var request = require("superagent");
var VirtualScroll = require('react-virtualized');
var Loading = require('../Loading.jsx');

var Stops = React.createClass({
  getInitialState: function() {
    return {
      stops: [],
      loaded: false
    }
  },

  getInfo: function(that) {
    var position = navigator.geolocation.getCurrentPosition(function(position){
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      fetch("https://last-stop-backup.herokuapp.com/apis/stops?lat="+lat+"&lon="+lon)
      // fetch("https://last-stop-backup.herokuapp.com/apis/stops?lat=37.600377&lon=-122.3875")
        .then(function(res){
          res.json().then(function(data){
              that.setState({stops: data, loaded:true});
          })
        });
      });
    },

  componentWillMount: function () {
    this.getInfo(this);
  },

  // componentDidMount: function() {
  //   setInterval(forceUpdate(), 3000);
  // },

  render:function(){
    if (this.state.loaded !== false ) {
      var feedStyle = {
        textAlign:'right'
      }
      var stops = this.state.stops.map(function(stop){
        var departure_time = stop.departure_time
        var check = parseInt(departure_time.slice(0,2))
        if (check >= 24) {
          departure_time = "0" + (check-24).toString() + departure_time.slice(2);
        }
        var date = moment(departure_time, "HH:mm:ss")
        if (date.diff(moment()) < 0) {
          date.add(24, 'hours');
          check -= 24
        }
        if (check > 12) {
          departure_time = (check-12).toString() + departure_time.slice(2);
          departure_time = departure_time.slice(0,5);
          if (departure_time.slice(-1) == ":") {
            departure_time = departure_time.slice(0,-1);
          }
          departure_time += " PM"
        } else {
          departure_time = departure_time.slice(0,5);
          if (departure_time.slice(-1) == ":") {
            departure_time = departure_time.slice(0,-1);
          }
          departure_time += " AM";
        }
        if (departure_time.slice(0,2) === "00") {
          departure_time = departure_time.replace("00:", "12:");
        }
        if (departure_time.slice(0,1) === "0") {
          departure_time = departure_time.slice(1);
        }
        return (
          <div className="stop-container col-sm-12 col-md-12 col-lg-12">
            <div className="header-block col-sm-12 col-md-12 col-lg-12">
              <div className="transit-agency col-sm-4 col-md-4 col-lg-4">{stop.agency_id}</div>
              <div className="stop-name col-sm-8 col-md-8 col-lg-8">{stop.stop_name}</div>
            </div>
            <div className="info-block col-sm-12 col-md-12 col-lg-12">
              <div className="route-destination-block col-sm-4 col-md-4 col-lg-4">
                <div className="route-short col-sm-12 col-md-12 col-lg-12">{stop.route_short_name}</div>
                <div className="fa fa-arrow-circle-right stop-dest col-sm-12 col-md-12 col-lg-12"> {stop.destination}</div>
              </div>
              <div className="time-block col-sm-8 col-md-8 col-lg-8">{(date.diff(moment()) < 3600000 && date.diff(moment()) > 0) ? date.fromNow(true).replace("minute","min") : departure_time}</div>
            </div>
          </div>
        );
      });
      return (
      <div className="col-sm-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2">
        {stops}
      </div>
      );
    } else {
      return <div><Loading/></div>
    }
  }
});

module.exports = Stops
