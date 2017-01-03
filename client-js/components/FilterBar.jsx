
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uiActions from '../actions/ui.js';

class FilterBar extends React.PureComponent {
	constructor(props) {
		super(props);

		this.onTextChanged = this.onTextChanged.bind(this);
	}
	onTextChanged(event) {
		this.props.action.changeCoverNameFilter(event.target.value);
	}
	render() {
		console.log('render FilterBar');
		return (
			<input id="search-input" className="search-bar__input" type="search" onChange={this.onTextChanged} />
		);

		// return (
		// 	<Box pad={{horizontal: 'medium', vertical: 'none'}} direction="row">
		// 		<Box align="center" justify="end" pad="small">
		// 			<Search />
		// 		</Box>
		// 		<Box flex={true}>
		// 			<TextField  hintText="Cover Name" floatingLabelText="Search" fullWidth={true} onChange={this.props.onChange} />
		// 		</Box>
		// 		{this.props.filterTagSet.map((tag) => {
		// 			return (
		// 				<Box key={tag} align="center" justify="center" pad="small">
		// 					<Chip style={{"WebkitAppearance": "initial"}} onTouchTap={this.onDeleteTag.bind(this, tag)}>
		// 						{tag}
		// 					</Chip>
		// 				</Box>
		// 			);
		// 		})}
		// 	</Box>
		// );
	}
	// onDeleteTag(tag, syntheticEvent) {
	// 	syntheticEvent.preventDefault();
	// 	syntheticEvent.stopPropagation();
	// 	this.props.action.deleteCoverFilterTag(tag);
	// }
}

FilterBar.propTypes = {
	// filterTagSet: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	action: React.PropTypes.shape({
		changeCoverNameFilter: React.PropTypes.func.isRequired,
		deleteCoverFilterTag: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	return {
		// filterTagSet: state.get('ui').get('filterTagSet')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(uiActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);
