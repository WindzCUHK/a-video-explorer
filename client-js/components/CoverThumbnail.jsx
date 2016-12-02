
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FontAwesome from 'react-fontawesome';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Headline from 'grommet/components/Headline';
import Image from 'grommet/components/Image';
import Tile from 'grommet/components/Tile';
import Status from 'grommet/components/icons/Status';

class VideoButton extends React.PureComponent {
	render() {
		const isEqual = this.props.coveredVideo.get('isEqual');
		const episode = this.props.coveredVideo.get('episode');
		const videoPath = this.props.coveredVideo.get('file').get('path');
		const resolution = this.props.coveredVideo.get('file').get('resolution');
		const openVideo = (event) => {
			event.preventDefault();
			this.props.openCover(videoPath);
		};
		const index = this.props.index;

		const resolutionStatusDict = {
			HD: 'ok',
			SD: 'warning',
			GG: 'unknown'
		};

		return (
			<Box pad="small" full={false} flex="grow" align="center" justify="center" colorIndex={"neutral-" + (index % 3 + 1) + "-a"} onDoubleClick={openVideo} className="episode-button">
				<span>
					<Status value={resolutionStatusDict[resolution]} />
					{(isEqual) ? (<FontAwesome name='video-camera' />) : episode}
				</span>
			</Box>
		);
	}
}

class Tag extends React.PureComponent {
	render() {
		// console.log('render Tag');
		return (<span className="tag">{this.props.tag}</span>);
	}
}

class CoverThumbnail extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	normalizeURI(targetPath) {
		return encodeURI((targetPath.indexOf('\\') >= 0) ? targetPath.replace(/\\/g, '/') : targetPath);
	}
	scrollEpisode(syntheticEvent) {
		const element = this.refs['episode-block'].boxContainerRef;
		element.scrollLeft += syntheticEvent.deltaY * 3;

		const leftArrow = this.refs['episode-arrow-left'];
		const rightArrow = this.refs['episode-arrow-right'];
		const isLeftMost = this.isEpisodeBlockBoundary(true);
		const isRightMost = this.isEpisodeBlockBoundary(false);
		if (isLeftMost && isRightMost) return;
		else {
			leftArrow.classList.toggle('hidden', !isLeftMost);
			rightArrow.classList.toggle('hidden', !isRightMost);

		}

		let isScrollHandled = !isLeftMost && !isRightMost;
		isScrollHandled |= (syntheticEvent.deltaY < 0) && !isLeftMost;
		isScrollHandled |= (syntheticEvent.deltaY > 0) && !isRightMost;
		if (isScrollHandled) {
			syntheticEvent.stopPropagation();
			syntheticEvent.preventDefault();
		}
	}
	isEpisodeBlockBoundary(isLeft) {
		const element = this.refs['episode-block'].boxContainerRef;

		if (isLeft) return element.scrollLeft === 0;
		else return element.scrollWidth === element.scrollLeft + element.clientWidth;
	}
	render() {
		// console.log('render CoverThumbnail');
		return (
			<Tile align="center" justify="center" size="auto" className={"cover-tile" + " " + ((this.props.isShown) ? "" : "hidden")}>
				<Article full="horizontal" align="center" justify="center">
					<Header float={true} basis="xsmall" size="small" align="center" justify="center" colorIndex="neutral-2" className="cover-title-block">
						<Headline size="small" margin="none" align="center" className="cover-title">
							{this.props.cover.get('name')}
						</Headline>
					</Header>
					<Image
						alt={this.props.cover.get('name')}
						src={this.normalizeURI(this.props.cover.get('path'))}
						size="large"
						fit="contain"
					/>

					<Box full="horizontal" direction="row" onWheel={this.scrollEpisode.bind(this)} ref="episode-block" className="episode-block">
						<Box direction="row" flex="grow" className="episode-arrow-block">
							<div className="episode-arrow episode-arrow-left hidden" ref="episode-arrow-left">
								<FontAwesome name='step-backward' />
							</div>
							<div className="episode-arrow episode-arrow-right hidden" ref="episode-arrow-right">
								<FontAwesome name='step-forward' />
							</div>
							{this.props.cover.get('coveredVideos').map((cv, index) => {
								const videoPath = cv.get('file').get('path');
								return (<VideoButton key={videoPath} coveredVideo={cv} openCover={this.props.actions.openCover} index={index} />);
							})}
						</Box>
					</Box>
					<div className="tag-block">
						{this.props.cover.get('tags').map((tag) => {
							return (<Tag key={tag} tag={tag} />);
						})}
					</div>
				</Article>
			</Tile>
		);
	}

	componentDidMount() {
		this.refs['episode-block'].props.onWheel(new WheelEvent('wheel'));
	}
};

function mapStateToProps(state) {
	return {
		filterTagSet: state.get('ui').get('filterTagSet')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		// action: bindActionCreators(uiActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverThumbnail);
