
import React from 'react';

export default class CoverThumbnail extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<span>
				<img
					className="cover-thumbnail"
					title={this.props.file.get('name')}
					src={this.props.file.get('path')}
					onDoubleClick={() => {this.props.actions.openCover(this.props.file)}}
				/>
			</span>
		);
	}

};
