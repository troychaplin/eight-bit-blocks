import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { gameWidth, gameHeight, showControls } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Game Settings', 'eight-bit-blocks')}>
					<ToggleControl
						label={__('Show Control Buttons', 'eight-bit-blocks')}
						checked={showControls}
						onChange={(value) => setAttributes({ showControls: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div className="falling-blocks-preview" style={{
					width: gameWidth + 'px',
					height: gameHeight + 'px',
					border: '2px solid #333',
					backgroundColor: '#000',
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#fff',
					fontFamily: 'monospace'
				}}>
					<div style={{ textAlign: 'center' }}>
						<div style={{ fontSize: '24px', marginBottom: '10px' }}>🎮</div>
						<div>{__('Falling Blocks Game', 'eight-bit-blocks')}</div>
						<div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
							{gameWidth} × {gameHeight}px
						</div>
						<div style={{ fontSize: '10px', opacity: 0.5, marginTop: '10px' }}>
							{__('Game will be interactive on the front end', 'eight-bit-blocks')}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
	