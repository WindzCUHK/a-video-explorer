
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import SearchInput from 'grommet/components/SearchInput';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';

import * as uiActions from '../actions/ui.js';

class TagsBar extends React.PureComponent {

	constructor(props) {
		super(props);
	}
	isFilteredTag(tag) {
		const tagFilter = this.props.tagFilter.toLowerCase();
		if (tagFilter.length === 0) return true;
		else return (tag.toLowerCase().indexOf(tagFilter) !== -1);
	}
	onSearchInputChanged(event) {
		this.props.action.changeTagFilter(event.target.value);
	}
	onTagClick(syntheticEvent) {
		syntheticEvent.preventDefault();
		syntheticEvent.stopPropagation();

		const targetTag = syntheticEvent.target.textContent;
		this.props.action.addCoverFilterTag(targetTag);
	}
	render() {
		console.log('render TagsBar');
		return (
			<Sidebar size="small" colorIndex="neutral-1" full={true} fixed={true} className="tags-bar-container">
				<Header pad={{horizontal: "small"}}>
					<SearchInput placeHolder="Search tag" onDOMChange={this.onSearchInputChanged.bind(this)} />
				</Header>
				<Menu pad="small" size="small" className="tag-menu">
					{this.props.tags.map((tag) => {
						return (
							<Anchor href="#" key={tag}
								className={'tag-item ' + ((this.isFilteredTag.bind(this)(tag)) ? '' : 'hidden')}
								onClick={this.onTagClick.bind(this)}
							>
								{tag}
							</Anchor>
						);
					})}
					{/*<Anchor className='tag-item' href="#">#dummy tag</Anchor>*/}
				</Menu>
			</Sidebar>
		);
	}
}

TagsBar.propTypes = {
	// tags: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

	tagFilter: React.PropTypes.string.isRequired,
	action: React.PropTypes.shape({
		changeTagFilter: React.PropTypes.func.isRequired,
		addCoverFilterTag: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	return {
		tags: state.get('fileTags'),
		tagFilter: state.get('ui').get('tagFilter')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(uiActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsBar);
