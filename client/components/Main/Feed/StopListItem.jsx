var React = require('react');
var moment = require('moment-timezone');

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var StopListItem = React.createClass({
   mixins: [SetIntervalMixin],
  componentWillMount: function() {
    if (parseInt(this.props.stop.departure_time.slice(0, 2)) <= parseInt(moment().format("H"))) {
      var time = moment().hour(parseInt(this.props.stop.departure_time.slice(0, 2))).minutes(parseInt(this.props.stop.departure_time.slice(3,5))).add(24, "hours")
    } else {
      var time = moment().hour(parseInt(this.props.stop.departure_time.slice(0, 2))).minutes(parseInt(this.props.stop.departure_time.slice(3,5)))
    }
    this.setState({
      departure_time: time
    })
  },

  componentDidMount: function(){
    this.setInterval(this.tick, 36000)
  },
  tick: function() {
    var newTime = moment(this.state.departure_time).subtract(1, "minutes").format()
    this.setState({
      departure_time: newTime,
    })
  },

  render: function() {
    if (moment(this.state.departure_time) - moment() > 3600000 ){
      var displayTime = moment(this.state.departure_time).format("h:mm A")
    } else if (moment(this.state.departure_time) - moment() > 18000000) {
      var displayTime = null
    } else {
      var displayTime = moment(this.state.departure_time).fromNow("mm")
    }
    return (
      <div className="time-block col-sm-8 col-md-8 col-lg-8">
        {displayTime}
      </div>
    )
  }

});

module.exports = StopListItem;
