
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as navigationActions from '../actions/navigation.js';
import * as uiActions from '../actions/ui.js';

// my components
import TagsBar from './TagsBar.jsx';
import FilterBar from './FilterBar.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import CoverGrid from './CoverGrid.jsx';

// http://jaketrent.com/post/smart-dumb-components-react/
// https://facebook.github.io/immutable-js/docs/#/Seq

class LoadingBlock extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={((this.props.isLoading) ? '' : 'hidden')}>Loading...</div>
		);
	}
}
LoadingBlock.propTypes = {
	isLoading: React.PropTypes.bool
};
const ConnectedLoadingBlock = connect((state) => {
	return {
		isLoading: state.get('ui').get('isLoading')
	};
})(LoadingBlock);


class MainBlock extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	render() {
		console.log('render MainBlock');
		return (
			<div className="container">
				<TagsBar />
				<main>
					{(this.props.pathError) ? <Notification status="critical" message={this.props.pathError.message} /> : null}

					<div className="search-bar">
						<FilterBar />
						<div className="search-bar__header">
							<Breadcrumb />
						</div>
						<label htmlFor="search-input" className="search-bar__label">
							<img className="search-bar__icon" src="./assets/search.svg" />
						</label>
					</div>

					<ConnectedLoadingBlock />
					<CoverGrid />



				</main>
			</div>
		);
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	console.log('old prop', this.props);
	// 	console.log('new prop', nextProps);
	// 	console.log('old state', this.state);
	// 	console.log('new state', nextState);

	// 	return false;
	// }
};

MainBlock.propTypes = {
	pathError: React.PropTypes.object
};

function mapStateToProps(state) {
	return {
		pathError: state.get('pathError')
	};
}

export default connect(mapStateToProps)(MainBlock);
