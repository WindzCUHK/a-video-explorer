
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigationActions from '../actions/navigation.js';

function mapFilesToHtml(files) {
	console.log(files);
	if (!files) return (<p>No files</p>);
	return files.map((f) => {
		return (<p key={f.name}>{f.name}</p>);
	});
}

class MainBlock extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		// const { currentPath, actions } = this.props;
		return (
			<div>
				<div onClick={() => {this.props.actions.changeDir('..')}}>{this.props.currentPath}</div>
				<h1>Hello to react</h1>
				{mapFilesToHtml(this.props.files)}
			</div>
		);
	}
};

MainBlock.propTypes = {
	currentPath: React.PropTypes.string.isRequired,
	actions: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		currentPath: state.get('currentPath'),
		files: state.get('files')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(navigationActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MainBlock);
