
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as navigationActions from '../actions/navigation.js';

class CoverDetailView extends React.PureComponent {
	constructor(props) {
		super(props);

		// this.onDirLinkClick = this.onDirLinkClick.bind(this);
	}
	render() {
		console.log('render CoverDetailView');
		// const pathFragments = this.props.currentPathFragments;
		return (
			<div className="modal-block">
				<span>{this.props.selectCover}</span>
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
		selectedCover: state.get('selectedCover')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(navigationActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CoverDetailView);
