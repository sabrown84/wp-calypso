/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import ActionHeader from 'woocommerce/components/action-header';
import Button from 'components/button';
import SettingsNavigation from '../navigation';
import { getLink } from 'woocommerce/lib/nav-utils';

const Email = ( { isSaving, site, translate, className } ) => {
	const breadcrumbs = [
		( <a href={ getLink( '/store/:site/', site ) }>{ translate( 'Settings' ) }</a> ),
		( <span>{ translate( 'Email' ) }</span> ),
	];

	const	onSave = () => { };

	return (
		<Main className={ classNames( 'email', className ) }>
			<ActionHeader breadcrumbs={ breadcrumbs }>
				<Button
					primary
					onClick={ onSave }
					busy={ isSaving }
					disabled={ isSaving }>
					{ translate( 'Save' ) }
				</Button>
			</ActionHeader>
			<SettingsNavigation activeSection="email" />
		</Main>
	);
};

Email.propTypes = {
	className: PropTypes.string
};

export default localize( Email );
