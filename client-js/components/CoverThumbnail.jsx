
import React from 'react';
import FontAwesome from 'react-fontawesome';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Headline from 'grommet/components/Headline';
import Image from 'grommet/components/Image';
import Tile from 'grommet/components/Tile';
import Tiles from 'grommet/components/Tiles';

class VideoButton extends React.Component {
	render() {
		const isEqual = this.props.coveredVideo.get('isEqual');
		const episode = this.props.coveredVideo.get('episode');
		const videoPath = this.props.coveredVideo.get('file').get('path');
		const openVideo = (event) => {
			event.preventDefault();
			this.props.openCover(videoPath);
		};
		const index = this.props.index;

		return (
			<Box pad="small" full={false} flex="grow" align="center" justify="center" colorIndex={"neutral-" + (index % 3 + 1) + "-a"} onDoubleClick={openVideo} className="episode-button">
				<span>{(isEqual) ? (<FontAwesome name='video-camera' />) : episode}</span>
			</Box>
		);
	}
}

class Tag extends React.Component {
	render() {
		return (<span className="tag">{this.props.tag}</span>);
	}
}

export default class CoverThumbnail extends React.Component {
	constructor(props) {
		super(props);
	}
	normalizeURI(targetPath) {
		return encodeURI((targetPath.indexOf('\\') >= 0) ? targetPath.replace(/\\/g, '/') : targetPath);
	}
	scrollEpisode(syntheticEvent) {
		syntheticEvent.stopPropagation();
		syntheticEvent.preventDefault();
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
	}
	isEpisodeBlockBoundary(isLeft) {
		const element = this.refs['episode-block'].boxContainerRef;

		if (isLeft) return element.scrollLeft === 0;
		else return element.scrollWidth === element.scrollLeft + element.clientWidth;
	}
	render() {
		return (
			<Tile wide={true} align="center" justify="center">
				<Article full="horizontal" align="center" justify="center">
					<Header float={true} basis="xsmall" size="small" align="center" justify="center" colorIndex="neutral-2" className="cover-title-block">
						<Headline size="small" margin="none" align="center" className="cover-title">
							{this.props.file.get('name')}
						</Headline>
					</Header>
					<Image
						alt={this.props.file.get('name')}
						src={this.normalizeURI(this.props.file.get('path'))}
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
							{this.props.file.get('coveredVideos').map((cv, index) => {
								const videoPath = cv.get('file').get('path');
								return (<VideoButton key={videoPath} coveredVideo={cv} openCover={this.props.actions.openCover} index={index} />);
							})}
						</Box>
					</Box>
					<div className="tag-block">
						{this.props.file.get('tags').map((tag) => {
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