
import path from 'path';

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FontAwesome from 'react-fontawesome';

import * as navigationActions from '../actions/navigation.js';

class Breadcrumb extends React.PureComponent {
	constructor(props) {
		super(props);

		this.onDirLinkClick = this.onDirLinkClick.bind(this);
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
	onDirLinkClick(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.action.changeDir(event.target.getAttribute('href'));
	}
	
	render() {
		console.log('render Breadcrumb');
		// console.log(JSON.stringify(this.getAllDirAndItsPath()));
		const dirAndItsPaths = this.getAllDirAndItsPath();
		return (
			<div className="search-bar__header__content">
				{dirAndItsPaths.map((dirAndPath, index) => {
					return (
						<span key={dirAndPath.dirPath}>
							<FontAwesome name='chevron-right' />
							<a
								href={dirAndPath.dirPath}
								onClick={(index === dirAndItsPaths.length - 1) ? null : this.onDirLinkClick}
							>{dirAndPath.dirName}</a>
						</span>
					);
				})}
			</div>
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
