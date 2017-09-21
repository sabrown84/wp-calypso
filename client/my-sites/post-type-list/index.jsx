/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { isEqual, range, throttle } from 'lodash';

/**
 * Internal dependencies
 */
import QueryPosts from 'components/data/query-posts';
import { getSelectedSiteId } from 'state/ui/selectors';
import {
	isRequestingSitePostsForQueryIgnoringPage,
	isRequestingSitePostsForQuery,
	getSitePostsForQueryIgnoringPage,
	getSitePostsLastPageForQuery
} from 'state/posts/selectors';
import PostItem from 'blocks/post-item';
import PostTypeListEmptyContent from './empty-content';

class PostTypeList extends Component {
	static propTypes = {
		// Props
		query: PropTypes.object,
		largeTitles: PropTypes.bool,
		wrapTitles: PropTypes.bool,
		scrollContainer: PropTypes.object,

		// Connected props
		siteId: PropTypes.number,
		posts: PropTypes.array,
		isRequestingPosts: PropTypes.bool,
		lastPage: PropTypes.number,
		isRequestingLastPage: PropTypes.bool,
	};

	constructor() {
		super( ...arguments );

		this.renderPost = this.renderPost.bind( this );
		this.renderPlaceholder = this.renderPlaceholder.bind( this );

		this.maybeLoadNextPage = this.maybeLoadNextPage.bind( this );
		this.scrollListener = throttle( this.maybeLoadNextPage, 100 );
		window.addEventListener( 'scroll', this.scrollListener );

		this.state = {
			maxRequestedPage: 1,
		};
	}

	componentWillReceiveProps( nextProps ) {
		if ( ! isEqual( this.props.query, nextProps.query ) ) {
			this.setState( {
				maxRequestedPage: 1,
			} );
		}
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.isRequestingPosts && ! this.props.isRequestingPosts ) {
			// We just finished loading a page.  If the bottom of the list is
			// still visible on screen (or almost visible), then we should go
			// ahead and load the next page.
			this.maybeLoadNextPage();
		}
	}

	componentDidMount() {
		this.maybeLoadNextPage();
	}

	componentWillUnmount() {
		window.removeEventListener( 'scroll', this.scrollListener );
		this.scrollListener.cancel(); // Cancel any pending scroll events
	}

	maybeLoadNextPage() {
		const { scrollContainer, lastPage, isRequestingPosts } = this.props;
		if ( ! scrollContainer ) {
			return;
		}
		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		if (
			typeof scrollTop !== 'number' ||
			typeof scrollHeight !== 'number' ||
			typeof clientHeight !== 'number'
		) {
			return;
		}
		const pixelsBelowViewport = scrollHeight - scrollTop - clientHeight;
		const { maxRequestedPage } = this.state;
		if (
			pixelsBelowViewport <= 200 &&
			maxRequestedPage < lastPage &&
			! isRequestingPosts
		) {
			this.setState( {
				maxRequestedPage: maxRequestedPage + 1,
			} );
		}
	}

	isLastPage() {
		const { lastPage, isRequestingLastPage } = this.props;
		const { maxRequestedPage } = this.state;

		return maxRequestedPage === lastPage && ! isRequestingLastPage;
	}

	renderPlaceholder() {
		return (
			<PostItem
				key="placeholder"
				largeTitle={ this.props.largeTitles }
			/>
		);
	}

	renderPost( post ) {
		const globalId = post.global_ID;
		const { query } = this.props;

		return (
			<PostItem
				key={ globalId }
				globalId={ globalId }
				largeTitle={ this.props.largeTitles }
				wrapTitle={ this.props.wrapTitles }
				singleUserQuery={ query && !! query.author }
			/>
		);
	}

	render() {
		const { query, siteId, posts, isRequestingPosts } = this.props;
		const { maxRequestedPage } = this.state;
		const isLoadedAndEmpty = query && posts && ! posts.length && ! isRequestingPosts;
		const classes = classnames( 'post-type-list', {
			'is-empty': isLoadedAndEmpty
		} );

		return (
			<div className={ classes }>
				{ query && range( 1, maxRequestedPage + 1 ).map( page => (
					<QueryPosts
						key={ `query-${ page }` }
						siteId={ siteId }
						query={ { ...query, page } } />
				) ) }
				{ posts && (
					posts.map( this.renderPost )
				) }
				{ isLoadedAndEmpty && (
					<PostTypeListEmptyContent
						type={ query.type }
						status={ query.status } />
				) }
				{ isRequestingPosts && (
					this.renderPlaceholder()
				) }
			</div>
		);
	}
}

export default connect( ( state, ownProps ) => {
	const siteId = getSelectedSiteId( state );
	const lastPage = getSitePostsLastPageForQuery( state, siteId, ownProps.query );

	return {
		siteId,
		posts: getSitePostsForQueryIgnoringPage(
			state,
			siteId,
			ownProps.query
		),
		isRequestingPosts: isRequestingSitePostsForQueryIgnoringPage(
			state,
			siteId,
			ownProps.query
		),
		lastPage,
		isRequestingLastPage: isRequestingSitePostsForQuery(
			state,
			siteId,
			{ ...ownProps.query, page: lastPage }
		),
	};
} )( PostTypeList );
