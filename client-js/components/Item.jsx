
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
	onClickFile(file) {
		const isFile = file.get('isFile');
		if (isFile) return;

		const folderPath = file.get('path');
		this.props.onChangeDir(folderPath);
	}
	render() {
		return (
			<div
				className={'item-block file-block grid__cell ' + ((this.props.file.get('isFile')) ? '' : 'folder-block')}
				onClick={this.onClickFile.bind(this, this.props.file)}
			>
				<FontAwesome name={this.mapFileToIconName(this.props.file)} />
				<span className="item-name">{this.props.file.get('name')}</span>
			</div>
		);
	}

};
