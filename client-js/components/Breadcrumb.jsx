
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
	onDirLinkClick(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.action.changeDir(event.target.getAttribute('href'));
	}
	
	render() {
		console.log('render Breadcrumb');
		const pathFragments = this.props.currentPathFragments;
		return (
			<div className="search-bar__header__content">
				{pathFragments.map((pathFragment, index) => {
					if (pathFragment.get('error')) return console.log(pathFragment.get('error'));
					const dirName = pathFragment.get('dirName');
					const dirPath =  pathFragment.get('dirPath');
					return (
						<span key={dirPath} className="search-bar__header__content__fragment">
							<FontAwesome name='chevron-right' className="search-bar__header__content__link-separator" />
							<a
								className="search-bar__header__content__link"
								href={dirPath}
								onClick={(index === pathFragments.length - 1) ? null : this.onDirLinkClick}
							>{dirName}</a>
						</span>
					);
				})}
			</div>
		);
	}
}

Breadcrumb.propTypes = {
	// currentPathFragments: React.PropTypes.string.isRequired,
	action: React.PropTypes.shape({
		changeDir: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	return {
		currentPathFragments: state.get('currentPathFragments')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(navigationActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumb);
