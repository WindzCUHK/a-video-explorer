
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import SearchInput from 'grommet/components/SearchInput';
import Menu from 'grommet/components/Menu';
import Box from 'grommet/components/Box';
import Anchor from 'grommet/components/Anchor';

import * as uiActions from '../actions/ui.js';

class TagsBar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.onSearchInputChanged = this.onSearchInputChanged.bind(this);
		this.onTagClick = this.onTagClick.bind(this);
	}
	isFilteredTag(tag) {
		const tagFilter = this.props.tagFilter.toLowerCase();
		if (tagFilter.length === 0) return true;
		else return (tag.toLowerCase().indexOf(tagFilter) !== -1);
	}
	onSearchInputChanged(event) {
		this.props.action.changeTagFilter(event.target.value);
	}
	onTagClick(tag, syntheticEvent) {
		syntheticEvent.preventDefault();
		syntheticEvent.stopPropagation();

		this.props.action.toggleCoverFilterTag(tag);
	}
	render() {
		console.log('render TagsBar');
		return (
			<Sidebar size="small" colorIndex="neutral-1" full={true} fixed={true} className="tags-bar-container">
				<Header className="overwrite" pad={{horizontal: "small"}}>
					<SearchInput className="overwrite" placeHolder="Search tag" onDOMChange={this.onSearchInputChanged.bind(this)} />
				</Header>
				<Menu size="small" className="tag-menu">
					{this.props.tags.map((tag) => {
						return (
							<Box key={tag} colorIndex={(this.props.filterTagSet.has(tag)) ? 'accent-2-t' : undefined }>
								<Anchor href="#"
									className={'tag-item ' + ((this.isFilteredTag.bind(this)(tag)) ? '' : 'hidden')}
									onClick={this.onTagClick.bind(this, tag)}
								>
									<span className="tag-first-char">{tag.charAt(0)}</span>
									<span>{tag.substring(1)}</span>
								</Anchor>
							</Box>
						);
					})}
					{/*<Anchor className='tag-item' href="#">#dummy tag</Anchor>*/}
				</Menu>
			</Sidebar>
		);
	}

	
	// onTagClick(event) {
	// 	console.log(event.currentTarget.dataset, event.currentTarget);
	// }
	// render() {
	// 	console.log('render TagsBar');
	// 	return (
	// 		<nav className="side-nav">
	// 			<div className="side-nav__content">
	// 				<div className="side-nav__search__container">
	// 					<label>
	// 						<img className="side-nav__search__icon" src="./assets/search.svg" />
	// 						<input className="side-nav__search__input" type="search" placeholder="Search tag" onChange={this.onSearchInputChanged} />
	// 					</label>
	// 				</div>
	// 				{this.props.tags.map((tag) => {
	// 					return (
	// 						<span key={tag} data-tag={tag} className="side-nav__menu-item" onClick={this.onTagClick}>
	// 							<span className="side-nav__menu-item__first-char">{tag.charAt(0)}</span>
	// 							<span>{tag.substring(1)}</span>
	// 						</span>
	// 					);
	// 				})}
	// 				<span>nav item</span>
	// 				<span>nav item</span>
	// 				<span>nav item</span>
	// 			</div>
	// 		</nav>
	// 	);
	// }
}

TagsBar.propTypes = {
	// tags: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	// filterTagSet: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

	tagFilter: React.PropTypes.string.isRequired,
	action: React.PropTypes.shape({
		changeTagFilter: React.PropTypes.func.isRequired,
		toggleCoverFilterTag: React.PropTypes.func.isRequired
	})
};

function mapStateToProps(state) {
	return {
		tags: state.get('fileTags'),
		tagFilter: state.get('ui').get('tagFilter'),
		filterTagSet: state.get('ui').get('filterTagSet')
	};
}
function mapDispatchToProps(dispatch) {
	return {
		action: bindActionCreators(uiActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsBar);
