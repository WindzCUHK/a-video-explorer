
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tiles from 'grommet/components/Tiles';

import * as uiActions from '../actions/navigation.js';

// TODO: rewrite below
import CoverThumbnail from './CoverThumbnail.jsx';
import Item from './Item.jsx';

class CoverGrid extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	shouldCoverShown(cover) {

		let nameMatch = false, tagMatch = false;

		// filter by name
		const nameFilter = this.props.nameFilter.toLowerCase();
		if (nameFilter.length === 0) nameMatch = true;
		else nameMatch = (cover.get('name').toLowerCase().includes(nameFilter));

		// short circuit
		if (!nameMatch) return false;

		const fileTags = cover.get('tags');
		const filterTagSet = this.props.filterTagSet;

		// filter by tags
		if (filterTagSet.isEmpty()) tagMatch = true;
		else {
			tagMatch = fileTags.some( tag => filterTagSet.has(tag) );
			// tagMatch = fileTags.some( tag => filterTagSet.includes(tag) );
		}

		return nameMatch && tagMatch;
	}
	preRender() {
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
		const rawFiles = this.props.files;
		const imageFilter = getImageFilter(false);

		const covers = [];
		const files = [];
		rawFiles.forEach((f) => {
			if (imageFilter(f)) covers.push(f);
			else files.push(f);
		});

		return { covers, files };
	}
	render() {
		console.log('render CoverGrid');
		const { covers, files } = this.preRender();
		return (
			<Tiles fill={true} selectable={true}>
				{covers.map((cover) => {
					return (<CoverThumbnail
						key={cover.get('path')}
						actions={this.props.action}
						cover={cover}
						isShown={this.shouldCoverShown.bind(this)(cover)}
					/>);
				})}
				{files.map((file) => {
					return (<Item key={file.get('path')} file={file} />);
				})}
			</Tiles>
		);
	}
}

CoverGrid.propTypes = {
	// files: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

	nameFilter: React.PropTypes.string.isRequired,
	action: React.PropTypes.shape({
		changeDir: React.PropTypes.func.isRequired,
		openCover: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	return {
		files: state.get('files'),
		filterTagSet: state.get('ui').get('filterTagSet'),
		nameFilter: state.get('ui').get('nameFilter')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(uiActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverGrid);
