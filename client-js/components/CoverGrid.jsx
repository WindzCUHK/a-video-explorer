
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uiActions from '../actions/navigation.js';


class CoverGrid extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
		);
	}
}

CoverGrid.propTypes = {
	// files: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	action: React.PropTypes.shape({
		changeDir: React.PropTypes.func.isRequired,
		openCover: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	function getImageFilter(revert) {
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
		return (f) => {
			const fileType = f.get('ext') || '';
			return ((extDict[fileType] === IMAGE) !== revert);
		};
	}
	const rawFiles = state.get('files');
	const imageFilter = getImageFilter(false);

	const covers = [];
	const files = [];
	rawFiles.forEach((f) => {
		if (imageFilter(f)) images.push(f);
		else files.push(f);
	});

	return {
		covers: covers,
		files: files
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(uiActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverGrid);
