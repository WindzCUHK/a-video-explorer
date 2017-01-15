
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as navigationActions from '../actions/navigation.js';

class CoverDetailView extends React.PureComponent {
	constructor(props) {
		super(props);

		// this.onDirLinkClick = this.onDirLinkClick.bind(this);
	}
	normalizeURI(targetPath) {
		return encodeURI((targetPath.indexOf('\\') >= 0) ? targetPath.replace(/\\/g, '/') : targetPath);
	}
	render() {
		console.log('render CoverDetailView');
		console.log(this.props.selectedCover);
		// const pathFragments = this.props.currentPathFragments;
		if (!this.props.selectedCover) return (<div className="modal-block hidden"></div>);
		return (
			<div className="modal-block" onClick={this.props.action.unselectCover}>
				<span>{this.props.selectedCover.get('name')}</span>
				<img
					alt={this.props.selectedCover.get('name')}
					src={this.normalizeURI(this.props.selectedCover.get('path'))}
				/>
			</div>
		);
	}
}



CoverDetailView.propTypes = {
	// selectedCover: React.PropTypes.object,
	action: React.PropTypes.shape({
		selectCover: React.PropTypes.func.isRequired,
		unselectCover: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	return {
		selectedCover: state.get('ui').get('selectedCover')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(navigationActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverDetailView);
