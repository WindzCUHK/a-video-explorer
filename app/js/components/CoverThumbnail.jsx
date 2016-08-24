
import React from 'react';
import FontAwesome from 'react-fontawesome';

const renderBoundVideos = (coveredVideos, openCover) => {
	const components = [];
	if (coveredVideos) {
		coveredVideos.forEach((cv) => {
			console.log(cv.get('file').get('path'));
			if (cv.get('isEqual')) {
				components.push(<FontAwesome
					key={cv.get('file').get('path')}
					className="episode-button"
					name='video-camera'
					onDoubleClick={(e) => {e.preventDefault();openCover(cv.get('file').get('path'))}}
				/>);
			} else {
				components.push(<div
					key={cv.get('file').get('path')}
					className="episode-button"
					onDoubleClick={(e) => {e.preventDefault();openCover(cv.get('file').get('path'))}}
				>{cv.get('episode')}</div>);
			}
		});
	}

	return components;
};

// class VideoButton extends React.Component {
// 	render() {
// 		return (<FontAwesome
// 			key={cv.get('file').get('path')}
// 			className="episode-button"
// 			name='video-camera'
// 			onDoubleClick={(e) => {e.preventDefault();openCover(cv.get('file').get('path'))}}
// 		/>);
// 	}
// }

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
					{renderBoundVideos(this.props.file.get('coveredVideos'), this.props.actions.openCover)}
				</div>
				<div className="tag-block">
					{this.props.file.get('tags').map((tag) => {
						return <Tag key={tag} tag={tag} />;
					})}
				</div>
			</div>
		);
	}
};
