
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as navActions from '../actions/navigation.js';
import * as uiActions from '../actions/ui.js';

import CoverThumbBlock from './CoverThumbBlock.jsx';
// TODO: rewrite below
import Item from './Item.jsx';

class CoverGrid extends React.PureComponent {
	constructor(props) {
		super(props);

		this.shouldCoverShown = this.shouldCoverShown.bind(this);
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
			const hasCoveredVideos = f.get('coveredVideos') && f.get('coveredVideos').size > 0;
			if (imageFilter(f) && hasCoveredVideos) covers.push(f);
			else files.push(f);
		});

		return { covers, files };
	}
	render() {
		console.log('render CoverGrid');
		const { covers, files } = this.preRender();
		return (
			<div className="grids_container">
				<div className="grid">
					{covers.map((cover) => {
						return (<CoverThumbBlock
							key={cover.get('path')}
							action={this.props.action}
							cover={cover}
							currentDirTags={this.props.currentDirTags}
							isShown={this.shouldCoverShown(cover)}
						/>);
					})}
				</div>

				<div className="grid">
					{files.sort((a, b) => {
						const aIsFile = a.get('isFile');
						const bIsFile = b.get('isFile');
						if (aIsFile !== bIsFile) {
							if (aIsFile) {
								// a is file, b is folder, b should be first
								return 1;
							} else return -1;
						} else return a.get('path').localeCompare(b.get('path'));
					}).map((file) => {
						return (<Item key={file.get('path')} file={file} onChangeDir={this.props.action.changeDir} />);
					})}
				</div>
			</div>
		);
	}
}

CoverGrid.propTypes = {
	// currentDirTags: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	// files: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

	nameFilter: React.PropTypes.string.isRequired,
	action: React.PropTypes.shape({
		changeDir: React.PropTypes.func.isRequired,
		openCover: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	return {
		currentDirTags: state.get('currentDirTags'),
		files: state.get('files'),
		filterTagSet: state.get('ui').get('filterTagSet'),
		nameFilter: state.get('ui').get('nameFilter')
	};
}
function mapDispatchToProps(dispatch) {
	const actions = Object.assign(navActions, uiActions);
	return {
		action: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverGrid);
