
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigationActions from '../actions/navigation.js';

// other components
import Thumbnail from './Thumbnail.jsx';

// http://jaketrent.com/post/smart-dumb-components-react/
// https://facebook.github.io/immutable-js/docs/#/Seq

const IMAGE = "i";
const VIDEO = "v";
const extDict = {
	"jpg": IMAGE,
	"jpeg": IMAGE,
	"png": IMAGE,
	"bmp": IMAGE,
	"avi": VIDEO,
	"mp4": VIDEO,
	"mkv": VIDEO,
	"wmv": VIDEO
};

function mapFilesToHtml(actions, files) {
	if (!files) return (<p>No files</p>);
	return files.map((f) => {
		const fileType = f.get('ext') || '';
		// console.log(f.toJS());
		switch (extDict[fileType]) {
			case IMAGE:
				return (<Thumbnail key={f.get('name')} actions={actions} file={f}/>);
			case VIDEO:
				return (<p key={f.get('name')}>{f.get('name')}</p>);
			default:
				return (<p key={f.get('name')}>{f.get('name')}</p>);
		}
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
				{mapFilesToHtml(this.props.actions, this.props.files)}
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
