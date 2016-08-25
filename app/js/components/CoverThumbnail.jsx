
import React from 'react';
import FontAwesome from 'react-fontawesome';

class VideoButton extends React.Component {
	render() {
		const isEqual = this.props.coveredVideo.get('isEqual');
		const episode = this.props.coveredVideo.get('episode');
		const videoPath = this.props.coveredVideo.get('file').get('path');
		const openVideo = (event) => {
			event.preventDefault();
			this.props.openCover(videoPath);
		};

		if (isEqual) {
			return (<FontAwesome className="episode-button" name='video-camera' onDoubleClick={openVideo} />);
		} else {
			return (<div className="episode-button" onDoubleClick={openVideo}>{episode}</div>);
		}
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
	render() {
		return (
			<div className="item-block cover-thumbnail-block">
				<img
					className="cover-thumbnail"
					title={this.props.file.get('name')}
					src={this.props.file.get('path')}
				/>
				<div className="cover-name">{this.props.file.get('name')}</div>
				<div className="episode-block">
					{this.props.file.get('coveredVideos').map((cv) => {
						const videoPath = cv.get('file').get('path');
						return (<VideoButton key={videoPath} coveredVideo={cv} openCover={this.props.actions.openCover} />);
					})}
				</div>
				<div className="tag-block">
					{this.props.file.get('tags').map((tag) => {
						return (<Tag key={tag} tag={tag} />);
					})}
				</div>
			</div>
		);
	}
};
