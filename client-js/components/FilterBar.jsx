
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Box from 'grommet/components/Box';
import { TextField, Chip } from 'material-ui';

import * as uiActions from '../actions/ui.js';

class FilterBar extends React.Component {
	constructor(props) {
		super(props);
	}
	onTextChanged(proxy, text) {
		this.props.action.changeCoverNameFilter(text);
	}
	onDeleteTag(tag, syntheticEvent) {
		syntheticEvent.preventDefault();
		syntheticEvent.stopPropagation();
		this.props.action.deleteCoverFilterTag(tag);
	}
	render() {
		return (
			<Box pad={{horizontal: 'medium', vertical: 'none'}} direction="row">
				<Box flex={true}>
					<TextField  hintText="Cover Name" floatingLabelText="Search" fullWidth={true} onChange={this.onTextChanged.bind(this)} />
				</Box>
				{this.props.filterTagSet.map((tag) => {
					return (
						<Box key={tag} align="center" justify="center" pad="small">
							<Chip style={{"WebkitAppearance": "initial"}} onRequestDelete={this.onDeleteTag.bind(this, tag)}>
								{tag}
							</Chip>
						</Box>
					);
				})}
			</Box>
		);
	}
}

FilterBar.propTypes = {
	filterTagSet: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	action: React.PropTypes.shape({
		changeCoverNameFilter: React.PropTypes.func.isRequired,
		deleteCoverFilterTag: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	return {
		filterTagSet: state.get('ui').get('filterTagSet').toArray()
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(uiActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);
