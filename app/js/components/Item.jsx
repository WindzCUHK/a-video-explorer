
import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class Thumbnail extends React.Component {
	constructor(props) {
		super(props);
	}
	mapFileToIconName(file) {
		if (!file.get('isFile')) return 'folder';
		else {
			const defaultIconName = 'file';
			const fileExtDict = {
				"txt": 'file-text'
			};
			return fileExtDict[file.get('ext')] || defaultIconName;
		}
	}
	render() {
		return (
			<span className="item-block">
				<FontAwesome name={this.mapFileToIconName(this.props.file)} />
				<span className="item-name">{this.props.file.get('name')}</span>
			</span>
		);
	}

};
