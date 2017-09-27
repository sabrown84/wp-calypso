/**
 * Eternal dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import createSelector from 'lib/create-selector';

/**
 * Gets the current ui locale slug
 * @param {Object} state - global redux state
 * @return {String} current state value
 */
const getCurrentLocaleSlug = createSelector(
	state => get( state, 'ui.language.localeSlug', 'en' )
);

export default getCurrentLocaleSlug;
