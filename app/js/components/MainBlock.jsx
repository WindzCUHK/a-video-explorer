
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigationActions from '../actions/navigation.js';

class MainBlock extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { currentPath, actions } = this.props;
		return (
			<div>
				<h1>Hello to react</h1>
				<p onClick={() => {this.props.actions.changeDir('abc')}}>{this.props.currentPath}</p>
			</div>
		);
	}
};

MainBlock.propTypes = {
	currentPath: React.PropTypes.string.isRequired,
	actions: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
	console.log('mapStateToProps', state);
	return {
		currentPath: state.currentPath
	};
}
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(navigationActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MainBlock);
