var React = require("react");

var Provider extends Component {
	getChildContext() {
		return {
			store: this.props.store
		};
	}

	render() {
		store: this.props.children
	}
}
Provider.childContextTypes = {
	store: React.PropTypes.object
};
//Children need a similar contextTypes, then can access this.context
