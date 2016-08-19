
import React from 'react';

export default class Thumbnail extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		// const { currentPath, actions } = this.props;
		return (
			<span>
				<img
					className="thumb-cover"
					title={this.props.file.get('name')}
					src={this.props.file.get('path')}
					onDoubleClick={() => {this.props.actions.openCover(this.props.file)}}
				/>
			</span>
		);
	}

};
