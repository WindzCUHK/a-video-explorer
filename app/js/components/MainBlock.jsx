
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField } from 'material-ui';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import * as navigationActions from '../actions/navigation.js';


// other components
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
		console.log(proxy, text);
	}
	render() {
		// const { currentPath, actions } = this.props;
		const files = this.props.files || [];
		return (
			<div>
				<Header pad={{horizontal: 'medium'}} size="medium" onClick={() => {this.props.actions.changeDir('..')}}>
					<Title>{this.props.currentPath}</Title>
				</Header>
				<Box pad={{horizontal: 'medium', vertical: 'none'}}>
					<TextField  hintText="Cover Name" floatingLabelText="Search" fullWidth={true} onChange={this.textChanged} />
				</Box>

				{(files.length === 0) ? (<p>No files</p>) : null}

				{console.log(this.mergeTags())}

				{files.filter(this.getImageFilter(false)).map((imageFile) => {
					return (<CoverThumbnail key={imageFile.get('path')} actions={this.props.actions} file={imageFile} />);
				})}
				{files.filter(this.getImageFilter(true)).map((file) => {
					return (<Item key={file.get('path')} file={file} />);
				})}
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
