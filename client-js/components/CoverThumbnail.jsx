
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FontAwesome from 'react-fontawesome';

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

		const resolutionIconDict = {
			HD: 'check-circle',
			SD: 'exclamation-circle',
			GG: 'question-circle'
		};

		return (
			<div className="cover__episode-button" onDoubleClick={openVideo}>
				<span>
					<FontAwesome name={resolutionIconDict[resolution]} />
					{(isEqual) ? (<FontAwesome name='video-camera' />) : episode}
				</span>
			</div>
		);
	}
}

class Tag extends React.PureComponent {
	render() {
		// console.log('render Tag');
		return (<span className="cover__tag">{this.props.tag}</span>);
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
		const element = this.refs['episode-block'];
		console.log('scrollEpisode', element);
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
		const element = this.refs['episode-block'];

		if (isLeft) return element.scrollLeft === 0;
		else return element.scrollWidth === element.scrollLeft + element.clientWidth;
	}
	render() {
		console.log('render CoverThumbnail');
		return (
			<div className={'grid__cell'+' '+'cover'+' '+((this.props.isShown) ? '' : 'hidden')}>
				<div className="cover__header">
					<span className="cover__header__content">
						{this.props.cover.get('name')}
					</span>
				</div>
				<img
					className="cover__thumb"
					alt={this.props.cover.get('name')}
					src={this.normalizeURI(this.props.cover.get('path'))}
				/>

				<div onWheel={this.scrollEpisode.bind(this)} ref="episode-block" className="cover__episode-container">
					<div className="cover__episode-arrow-container">
						<div className="episode-arrow cover__episode-arrow--left hidden" ref="episode-arrow-left">
							<FontAwesome name='step-backward' />
						</div>
						<div className="episode-arrow cover__episode-arrow--right hidden" ref="episode-arrow-right">
							<FontAwesome name='step-forward' />
						</div>
						{this.props.cover.get('coveredVideos').map((cv, index) => {
							const videoPath = cv.get('file').get('path');
							return (<VideoButton key={videoPath} coveredVideo={cv} openCover={this.props.actions.openCover} index={index} />);
						})}
					</div>
				</div>
				<div className="cover__tag-container">
					<Tag key={'dummy'} tag={'dummy'} />
					{this.props.cover.get('tags')
						.filter(tag => !this.props.currentDirTags.has(tag))
						.map((tag) => {
							return (<Tag key={tag} tag={tag} />);
						})
					}
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.refs['episode-block'].dispatchEvent(new WheelEvent('wheel'));
	}
}

export default CoverThumbnail;
