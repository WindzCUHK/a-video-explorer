
import path from 'path';

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Header from 'grommet/components/Header';
import Button from 'grommet/components/Button';
import NextIcon from 'grommet/components/icons/base/Next';

import * as navigationActions from '../actions/navigation.js';

class Breadcrumb extends React.Component {
	constructor(props) {
		super(props);
	}
	getAllDirAndItsPath() {
		const dirPaths = [];

		let currentPath = this.props.currentPath;
		do {
			let nextPath = path.join(currentPath, '..');

			const dirName = path.basename(currentPath);
			dirPaths.push({
				dirName: (dirName) ? dirName : currentPath,
				dirPath: currentPath
			});

			// check if root dir reached
			if (currentPath === nextPath) break;
			else currentPath = nextPath;

		} while (true);

		return dirPaths.reverse();
	}
	onDirLinkClick(dirPath, event) {
		this.props.action.changeDir(dirPath);
	}
	render() {
		console.log(JSON.stringify(this.getAllDirAndItsPath()));
		const dirAndItsPaths = this.getAllDirAndItsPath();
		return (
			<Header pad={{horizontal: 'medium'}} size="medium">
				{dirAndItsPaths.map((dirAndPath, index) => {
					return (
						<Button
							plain={true}
							key={dirAndPath.dirPath}
							icon={<NextIcon size="small" />}
							label={dirAndPath.dirName}
							onClick={(index === dirAndItsPaths.length - 1) ? null : this.onDirLinkClick.bind(this, dirAndPath.dirPath)}
						/>
					);
				})}
			</Header>
		);
	}
}

Breadcrumb.propTypes = {
	currentPath: React.PropTypes.string.isRequired,
	action: React.PropTypes.shape({
		changeDir: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	return {
		currentPath: state.get('currentPath')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(navigationActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumb);
