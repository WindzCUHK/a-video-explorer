
import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class Thumbnail extends React.PureComponent {
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
			<div className="item-block file-block">
				<FontAwesome name={this.mapFileToIconName(this.props.file)} />
				<span className="item-name">{this.props.file.get('name')}</span>
			</div>
		);
	}

};
