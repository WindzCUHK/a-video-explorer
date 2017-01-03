
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uiActions from '../actions/ui.js';

class TagsBar extends React.PureComponent {

	constructor(props) {
		super(props);

		this.isFilteredTag = this.isFilteredTag.bind(this);
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
	onTagClick(event) {
		// console.log(event.currentTarget.dataset, event.currentTarget, event.ctrlKey);
		const tag = event.currentTarget.dataset.tag;
		const shouldClearOthers = !event.ctrlKey;
		this.props.action.toggleCoverFilterTag(tag, shouldClearOthers);
	}

	render() {
		console.log('render TagsBar');
		return (
			<nav className="side-nav">
				<div className="side-nav__content">
					<div className="side-nav__search__container">
						<label>
							<img className="side-nav__search__icon" src="./assets/search.svg" />
							<input className="side-nav__search__input" type="search" placeholder="Search tag" onChange={this.onSearchInputChanged} />
						</label>
					</div>
					{this.props.tags
						.filter(tag => !this.props.currentDirTags.has(tag))
						.map((tag) => {
							return (
								<div key={tag} data-tag={tag}
									onClick={this.onTagClick}
									className={'side-nav__menu-item'+' '+((this.isFilteredTag(tag)) ? '' : 'hidden')+' '+((this.props.filterTagSet.has(tag)) ? 'side-nav__menu-item--selected' : '')}
								>
									<span className="side-nav__menu-item__first-char">{tag.charAt(0)}</span>
									<span className="side-nav__menu-item__remaining">{tag.substring(1)}</span>
								</div>
							);
						})
					}
					{
						// ['dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy','dummy']
						// .map((tag, i) => {
						// 	return (
						// 		<div key={tag + i} data-tag={tag}
						// 			onClick={this.onTagClick}
						// 			className={'side-nav__menu-item'+' '+((this.isFilteredTag(tag)) ? '' : 'hidden')+' '+((this.props.filterTagSet.has(tag)) ? 'side-nav__menu-item--selected' : '')}
						// 		>
						// 			<span className="side-nav__menu-item__first-char">{tag.charAt(0)}</span>
						// 			<span className="side-nav__menu-item__remaining">{tag.substring(1)}</span>
						// 		</div>
						// 	);
						// })
					}
				</div>
			</nav>
		);
	}
}

TagsBar.propTypes = {
	// currentDirTags: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
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
		currentDirTags: state.get('currentDirTags'),
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
