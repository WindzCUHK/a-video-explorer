

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Article from 'grommet/components/Article';
import App from 'grommet/components/App';
import Notification from 'grommet/components/Notification';
import Split from 'grommet/components/Split';
import Tiles from 'grommet/components/Tiles';

import * as navigationActions from '../actions/navigation.js';
import * as uiActions from '../actions/ui.js';

// my components
import TagsBar from './TagsBar.jsx';
import FilterBar from './FilterBar.jsx';
import Breadcrumb from './Breadcrumb.jsx';

// TODO: rewrite below
import CoverThumbnail from './CoverThumbnail.jsx';
import Item from './Item.jsx';

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

class MainBlock extends React.Component {
	constructor(props) {
		super(props);
	}
	getImageFilter(revert) {
		return (f) => {
			const fileType = f.get('ext') || '';
			return ((extDict[fileType] === IMAGE) !== revert);
		};
	}
	filterByName(f) {
		const nameFilter = this.props.ui.get('nameFilter').toLowerCase();
		if (nameFilter.length === 0) return true;
		else return (f.get('name').toLowerCase().indexOf(nameFilter) !== -1);
	}
	mergeTags() {
		if (!this.props.files) return [];
		return Object.keys(this.props.files.map((f) => {
			return f.get('tags');
		}).reduce((mergedTags, tags) => {
			tags.forEach((t) => {
				mergedTags[t] = true;
			});
			return mergedTags;
		}, {}));
	}
	textChanged(proxy, text) {
		this.props.action.ui.changeCoverNameFilter(text);
	}
	render() {
		console.log('render MainBlock');
		// const { currentPath, action } = this.props;
		const files = this.props.files || [];
		return (
			<App centered={false}>
				<Split flex="right">
					<TagsBar tags={this.mergeTags.bind(this)()} />
					<Article>
						{(this.props.pathError) ? <Notification status="critical" message={this.props.pathError.message} /> : null}
						<FilterBar />
						<Breadcrumb />






						{(files.length === 0) ? (<p>No files</p>) : null}
						<Tiles fill={true} selectable={true}>

							{files.filter(this.getImageFilter(false)).filter(this.filterByName.bind(this)).map((imageFile) => {
								return (<CoverThumbnail key={imageFile.get('path')} actions={this.props.action.navigation} file={imageFile} />);
							})}
							{files.filter(this.getImageFilter(true)).map((file) => {
								return (<Item key={file.get('path')} file={file} />);
							})}
						</Tiles>







					</Article>
				</Split>
			</App>
		);
	}
};

MainBlock.propTypes = {
	currentPath: React.PropTypes.string.isRequired,
	action: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		ui: state.get('ui'),
		currentPath: state.get('currentPath'),
		pathError: state.get('pathError'),
		files: state.get('files')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: {
			navigation: bindActionCreators(navigationActions, dispatch),
			ui: bindActionCreators(uiActions, dispatch)
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MainBlock);
