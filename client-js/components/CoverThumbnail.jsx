
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
	scrollEpisode(proxy, unknown, event) {
		console.log(proxy.deltaMode, proxy.deltaX, proxy.deltaY, proxy.deltaZ);
		console.log(event.deltaX);
	}
	render() {
		return (
			// <div className="item-block cover-thumbnail-block">
				/*<img
					className="cover-thumbnail"
					title={this.props.file.get('name')}
					src={this.props.file.get('path')}
				/>*/
			<Tile wide={true} align="center" justify="center">
				<Article full="horizontal">
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

					<Box direction="row" onWheel={this.scrollEpisode}>
						{this.props.file.get('coveredVideos').map((cv, index) => {
							const videoPath = cv.get('file').get('path');
							return (<VideoButton key={videoPath} coveredVideo={cv} openCover={this.props.actions.openCover} index={index} />);
						})}
					</Box>
					<div className="tag-block">
						{this.props.file.get('tags').map((tag) => {
							return (<Tag key={tag} tag={tag} />);
						})}
					</div>
				</Article>
			</Tile>
			// </div>
		);
	}
};
