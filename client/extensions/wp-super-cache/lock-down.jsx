/**
 * External dependencies
 */
import React from 'react';
import { pick } from 'lodash';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import SectionHeader from 'components/section-header';
import FormToggle from 'components/forms/form-toggle/compact';
import ClipboardButton from 'components/forms/clipboard-button';
import FormFieldset from 'components/forms/form-fieldset';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import WrapSettingsForm from './wrap-settings-form';
import Notice from 'components/notice';

const LockDown = ( {
	fields: {
		wp_lock_down,
	},
	handleToggle,
	translate,
} ) => {
	const lockdownCodeSnippet = translate(
		'if ( defined( \'WPLOCKDOWN\' ) && constant( \'WPLOCKDOWN\' ) ) { echo ' +
		'"Sorry. My blog is locked down. Updates will appear shortly"; }'
	);

	return (
		<div>
			<SectionHeader label="Lock Down" />
			<Card>
				<form>
					<FormFieldset>
						<FormToggle
							checked={ !! wp_lock_down }
							disabled={ '1' === wp_lock_down }
							onChange={ handleToggle( 'wp_lock_down' ) }>
							<span>
								{ translate( 'Enable lock down to prepare your server for an expected spike in traffic.' ) }
							</span>
						</FormToggle>
					</FormFieldset>
					<FormSettingExplanation className="wp-super-cache__lock-down-explanation">
						<p>
							{ translate(
								'When this is enabled, new comments on a post will not refresh the cached static files.'
							) }
						</p>
						<p>
							{ translate(
								'Developers: Make your plugin lock down compatible by checking the "WPLOCKDOWN" ' +
								'constant. The following code will make sure your plugin respects the WPLOCKDOWN setting.'
							) }
						</p>

						<div className="wp-super-cache__lock-down-code-block">
							<ClipboardButton
								className="wp-super-cache__lock-down-code-block-button"
								text={ lockdownCodeSnippet }>
								<Gridicon icon="clipboard" />
							</ClipboardButton>
							<p className="wp-super-cache__lock-down-code-block-snippet">{ lockdownCodeSnippet }</p>
						</div>

						<Notice isCompact={ true } status={ wp_lock_down ? 'is-warning' : 'is-info' } text={ !! wp_lock_down
							? translate( 'WordPress is locked down. Super Cache static files will not be deleted ' +
								'when new comments are made.' )
							: translate( 'WordPress is not locked down. New comments will refresh Super Cache ' +
								'static files as normal.' )
						}
						/>
					</FormSettingExplanation>
				</form>
			</Card>
		</div>
	);
};

const getFormSettings = settings => {
	return pick( settings, [
		'wp_lock_down',
	] );
};

export default WrapSettingsForm( getFormSettings )( LockDown );
