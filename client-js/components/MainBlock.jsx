
import path from 'path';

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField } from 'material-ui';
import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Menu from 'grommet/components/Menu';
import Notification from 'grommet/components/Notification';
import SearchInput from 'grommet/components/SearchInput';
import Sidebar from 'grommet/components/Sidebar';
import Split from 'grommet/components/Split';
import Tiles from 'grommet/components/Tiles';
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
	filterByName(f) {
		if (this.props.ui.nameFilter.length === 0) return true;
		else return (f.get('name').indexOf(this.props.ui.nameFilter) !== -1);
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
	getParentDirPath() {
		// path.resolve() not work in windows, 'C:/' => '/C:/'
		return path.join(this.props.currentPath, '..');
	}
	render() {
		// const { currentPath, actions } = this.props;
		const files = this.props.files || [];
		return (
			<App centered={false}>
				<Split flex="right">
					<Sidebar size="small" colorIndex="neutral-1" full={true} fixed={true}>
						<Header pad="small">
							<SearchInput placeHolder="Search tag" onDOMChange={function (event) {console.log(event.target.value);}}/>
						</Header>
						<Menu pad="small" size="small" className="tag-menu">
							{this.mergeTags().map((tag) => {
								return <Anchor href="#" key={tag}>{tag}</Anchor>;
							})}
							<Anchor href="#">(dummy tag)</Anchor>
						</Menu>
					</Sidebar>
					<Article>
						{(this.props.pathError) ? <Notification status="critical" message={this.props.pathError.message} /> : ''}
						<Header pad={{horizontal: 'medium'}} size="medium" onClick={() => {this.props.actions.changeDir(this.getParentDirPath())}}>
							<Title>{this.props.currentPath}</Title>
						</Header>
						<Box pad={{horizontal: 'medium', vertical: 'none'}}>
							<TextField  hintText="Cover Name" floatingLabelText="Search" fullWidth={true} onChange={this.textChanged} />
						</Box>

						{(files.length === 0) ? (<p>No files</p>) : null}
						<Tiles fill={true} selectable={true} size="small">

							{files.filter(this.getImageFilter(false)).filter(this.filterByName.bind(this)).map((imageFile) => {
								return (<CoverThumbnail key={imageFile.get('path')} actions={this.props.actions} file={imageFile} />);
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
	actions: React.PropTypes.object.isRequired
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
		actions: bindActionCreators(navigationActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MainBlock);
