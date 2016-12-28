
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import App from 'grommet/components/App';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Notification from 'grommet/components/Notification';
import Split from 'grommet/components/Split';

import * as navigationActions from '../actions/navigation.js';
import * as uiActions from '../actions/ui.js';

// my components
import TagsBar from './TagsBar.jsx';
import FilterBar from './FilterBar.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import CoverGrid from './CoverGrid.jsx';

// http://jaketrent.com/post/smart-dumb-components-react/
// https://facebook.github.io/immutable-js/docs/#/Seq

class MainBlock extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	render() {
		console.log('render MainBlock');
		return (
			<App centered={false}>
				<TagsBar />
				<Article className="content-container">
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


					<CoverGrid />



				</Article>
			</App>
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
