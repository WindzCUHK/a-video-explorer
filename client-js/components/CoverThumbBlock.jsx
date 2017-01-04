
import React from 'react';

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
			<div className="cover__episode-button grid__cell" onDoubleClick={openVideo}>
				<FontAwesome name={resolutionIconDict[resolution]} />
				<span className="cover__episode-button-text">
					{(isEqual) ? (<FontAwesome name='video-camera' />) : episode}
				</span>
			</div>
		);
	}
}

class Tag extends React.PureComponent {
	constructor(props) {
		super(props);
		this.onTagClick = this.onTagClick.bind(this);
	}
	onTagClick(event) {
		const tag = event.currentTarget.dataset.tag;
		this.props.addCoverFilterTag(tag);
	}
	render() {
		// console.log('render Tag');
		const tag = this.props.tag;
		return (<span className="cover__tag" data-tag={tag} onClick={this.onTagClick}>{tag}</span>);
	}
}

class CoverThumb extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	normalizeURI(targetPath) {
		return encodeURI((targetPath.indexOf('\\') >= 0) ? targetPath.replace(/\\/g, '/') : targetPath);
	}
	render() {
		// console.log('render CoverThumb');
		return (
			<div className="cover__thumb-container">
				<div className="cover__header">
					<div className="cover__header__content">
						{this.props.cover.get('name')}
					</div>
				</div>
				<img
					className="cover__thumb"
					alt={this.props.cover.get('name')}
					src={this.normalizeURI(this.props.cover.get('path'))}
				/>
				<div className="cover__tag-container">
					{this.props.cover.get('tags')
						.filter(tag => !this.props.currentDirTags.has(tag))
						.map((tag) => {
							return (<Tag key={tag} tag={tag} addCoverFilterTag={this.props.action.addCoverFilterTag} />);
						})
					}
				</div>
			</div>
		);
	}
}

class CoverEpisode extends React.PureComponent {
	constructor(props) {
		super(props);
		this.scrollIntervalId = null;

		this.scrollEpisode = this.scrollEpisode.bind(this);
		this.stopScroll = this.stopScroll.bind(this);
		this.scrollToLeft = this.scrollToLeft.bind(this);
		this.scrollToRight = this.scrollToRight.bind(this);
		this.scrollByWheel = this.scrollByWheel.bind(this);
	}
	scrollEpisode(isToLeft, scrollDelta, scrollInterval) {

		const parent = this.refs['episode-buttons-parent'];
		const element = this.refs['episode-buttons'];
		const scrollButton = (isToLeft) ? this.refs['episode-arrow-left'] : this.refs['episode-arrow-right'];
		const reverseScrollButton = (!isToLeft) ? this.refs['episode-arrow-left'] : this.refs['episode-arrow-right'];
		function hideScrollButton() {
			scrollButton.classList.add('hidden');
		}
		function showReverseScrollButton() {
			reverseScrollButton.classList.remove('hidden');
		}

		// get current translate
		const translateRegex = /translateX\(([.-\d]+)px\)/;
		const groups = translateRegex.exec(element.style.transform);
		
		// new translate
		const translateDelta = (isToLeft) ? -scrollDelta : scrollDelta;
		const currentValue = (groups) ? parseInt(groups[1], 10) : 0;
		let translateValue = currentValue + translateDelta;

		// check boundary, scroll left => check right boundary
		if (this.isOnBoundary(parent, element, !isToLeft, translateValue)) {
			// console.log('already on boundary do nothing');
			hideScrollButton();

			// when wheel scroll too fast, it moves out of the boundary
			if (!scrollInterval) {
				if (parent.clientWidth >= element.clientWidth) {
					// no need scroll
					return false;
				} else {
					// move to boundary directly
					if (isToLeft) element.style.transform = `translateX(${parent.clientWidth - element.clientWidth}px)`;
					else element.style.transform = 'translateX(0px)';
					showReverseScrollButton();
					return true;
				}
			}

		} else {
			// can scroll => can scroll in reserve direction, hence show reserve scroll button
			showReverseScrollButton();
			// in case previous interval timer still exist
			this.stopScroll();

			const translateAsScroll = (function translateAsScroll() {
				element.style.transform = `translateX(${translateValue}px)`;
				translateValue = translateValue + translateDelta;
				if (this.isOnBoundary(parent, element, !isToLeft, translateValue)) {
					// console.log('meet boundary, stop scroll');
					hideScrollButton();
					this.stopScroll();
				}
			}).bind(this);
			if (scrollInterval) {
				// continue scrolling
				this.scrollIntervalId = setInterval(translateAsScroll, scrollInterval);
			} else {
				// wheel scroll
				translateAsScroll();
				return true;
			}
		}

		// don't prevent the original wheel event
		return false;
	}
	stopScroll() {
		if (this.scrollIntervalId) {
			clearInterval(this.scrollIntervalId);
			this.scrollIntervalId = null;
		}
	}
	isOnBoundary(parent, target, isLeft, translateValue) {
		if (isLeft) return translateValue >= 0;
		else return target.clientWidth - Math.abs(translateValue) <= parent.clientWidth;
	}
	scrollToLeft(syntheticEvent, domEvent, isReverse) {
		const scrollDelta = 5;
		const scrollInterval = 1000 / 60;
		this.scrollEpisode(true, scrollDelta, scrollInterval);

		syntheticEvent.stopPropagation();
		syntheticEvent.preventDefault();
	}
	scrollToRight(syntheticEvent, domEvent) {
		const scrollDelta = 5;
		const scrollInterval = 1000 / 60;
		this.scrollEpisode(false, scrollDelta, scrollInterval);
		
		syntheticEvent.stopPropagation();
		syntheticEvent.preventDefault();
	}
	scrollByWheel(syntheticEvent) {
		const scrollDelta = syntheticEvent.deltaY * 3;
		const isToLeft = scrollDelta >= 0;

		if (this.scrollEpisode(isToLeft, Math.abs(scrollDelta))) {
			syntheticEvent.stopPropagation();
			syntheticEvent.preventDefault();
		}
	}
	render() {
		// console.log('render CoverEpisode');
		return (
			<div className="cover__episode" ref="episode-buttons-parent" onWheel={this.scrollByWheel}>
				<div className="cover__episode-button-container grid grid--single-row" ref="episode-buttons">
					{this.props.cover.get('coveredVideos').map((cv, index) => {
						const videoPath = cv.get('file').get('path');
						return (<VideoButton key={videoPath} coveredVideo={cv} openCover={this.props.action.openCover} index={index} />);
					})}
				</div>
				<div className="cover__episode-arrow-container">
					<div className="cover__episode-arrow cover__episode-arrow--left" ref="episode-arrow-left" onMouseDown={this.scrollToLeft} onMouseUp={this.stopScroll} onMouseLeave={this.stopScroll}>
						<FontAwesome name='step-backward' />
					</div>
					<div className="cover__episode-arrow cover__episode-arrow--right" ref="episode-arrow-right" onMouseDown={this.scrollToRight} onMouseUp={this.stopScroll} onMouseLeave={this.stopScroll}>
						<FontAwesome name='step-forward' />
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		// this.refs['episode-buttons'].dispatchEvent(new WheelEvent('wheel'));
		this.scrollEpisode(true, 1, 0);
		this.scrollEpisode(false, 1, 0);
	}


	// check `this.prop.cover` content, so that can reuse component when changing directory
	// shouldComponentUpdate(nextProps, nextState) {
	// 	console.log('old prop', this.props);
	// 	console.log('new prop', nextProps);
	// 	console.log('old state', this.state);
	// 	console.log('new state', nextState);

	// 	return false;
	// }
}

class CoverThumbBlock extends React.PureComponent {
	render() {
		// console.log('render CoverThumbBlock');
		return (
			<div className={'grid__cell'+' '+'cover'+' '+((this.props.isShown) ? '' : 'hidden')}>
				<CoverThumb 
					action={this.props.action}
					cover={this.props.cover}
					currentDirTags={this.props.currentDirTags}
				/>
				<CoverEpisode 
					action={this.props.action}
					cover={this.props.cover}
				/>
			</div>
		);
	};
}

export default CoverThumbBlock;



// old scrollEpisode
/*
	scrollEpisode(syntheticEvent) {
		const element = this.refs['episode-buttons'];
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
*/
